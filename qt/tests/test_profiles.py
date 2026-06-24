# Copyright: Ankitects Pty Ltd and contributors
# License: GNU AGPL, version 3 or later; http://www.gnu.org/licenses/agpl.html

"""Tests for profile storage and the pickle -> JSON migration."""

import json
import pickle
from pathlib import Path
from tempfile import TemporaryDirectory

import pytest

from aqt.profiles import _JSON_BINARY_KEY, ProfileManager


def _global_blob(pm: ProfileManager) -> bytes:
    return pm.db.scalar(
        "select cast(data as blob) from profiles where name = '_global'"
    )


def _profile_blob(pm: ProfileManager, name: str) -> bytes:
    return pm.db.scalar(
        "select cast(data as blob) from profiles where name = ? collate nocase", name
    )


def test_new_profiles_are_stored_as_json():
    with TemporaryDirectory() as base:
        pm = ProfileManager(Path(base))
        pm.setupMeta()
        pm.create("alice")
        pm.load("alice")

        # binary values (e.g. Qt window state) survive a save/load round-trip
        blob = b"\x00\x01\xff\xfe window state"
        pm.profile["mainWindowState"] = blob
        pm.save()

        # both the profile and _global rows are valid JSON, not pickle
        for raw in (_profile_blob(pm, "alice"), _global_blob(pm)):
            assert not raw.startswith(b"\x80"), "data should not be pickle"
            decoded = json.loads(raw)
            assert isinstance(decoded, dict)

        # the binary value is tagged + base64-encoded inside the JSON
        encoded = json.loads(_profile_blob(pm, "alice"))["mainWindowState"]
        assert _JSON_BINARY_KEY in encoded

        # reloading restores the original bytes
        pm.load("alice")
        assert pm.profile["mainWindowState"] == blob


def test_legacy_pickle_is_migrated_to_json():
    with TemporaryDirectory() as base:
        pm = ProfileManager(Path(base))
        pm.setupMeta()
        pm.create("bob")

        # simulate data written by an older, pickle-based Anki
        legacy_profile = {"syncKey": "secret", "mainWindowGeom": b"\x01\x02geom"}
        legacy_meta = {"defaultLang": "en_US", "uiScale": 1.0}
        pm.db.execute(
            "update profiles set data = ? where name = 'bob'",
            pickle.dumps(legacy_profile, protocol=4),
        )
        pm.db.execute(
            "update profiles set data = ? where name = '_global'",
            pickle.dumps(legacy_meta, protocol=4),
        )
        pm.db.commit()

        # a fresh manager reads the legacy data and rewrites it as JSON
        pm2 = ProfileManager(Path(base))
        pm2.setupMeta()
        assert pm2.meta["defaultLang"] == "en_US"
        assert not _global_blob(pm2).startswith(b"\x80")

        pm2.load("bob")
        assert pm2.profile["syncKey"] == "secret"
        assert pm2.profile["mainWindowGeom"] == b"\x01\x02geom"
        assert not _profile_blob(pm2, "bob").startswith(b"\x80")


def test_unpickler_rejects_untrusted_globals():
    """The migration unpickler must not execute arbitrary callables."""

    class Evil:
        def __reduce__(self):
            import os

            return (os.system, ("echo pwned",))

    with TemporaryDirectory() as base:
        pm = ProfileManager(Path(base))
        with pytest.raises(pickle.UnpicklingError):
            pm._unpickle(pickle.dumps(Evil()))
