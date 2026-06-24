// Copyright: Ankitects Pty Ltd and contributors
// License: GNU AGPL, version 3 or later; http://www.gnu.org/licenses/agpl.html

declare global {
    /** The Anki JS bridge: a dynamic registry of modules exposed to embedded
     * pages. Its members are populated at runtime, so it is typed loosely. */
    // eslint-disable-next-line no-var
    var anki: Record<string, any>;
}

export function globalExport(globals: Record<string, unknown>): void {
    for (const key in globals) {
        (window as unknown as Record<string, unknown>)[key] = globals[key];
    }

    // but also export as window.anki
    window.anki = globals;
}
