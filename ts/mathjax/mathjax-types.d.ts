// Copyright: Ankitects Pty Ltd and contributors
// License: GNU AGPL, version 3 or later; http://www.gnu.org/licenses/agpl.html

export {};

declare global {
    /** The MathJax startup module.
     * https://docs.mathjax.org/en/latest/web/start.html */
    interface MathJaxStartup {
        /** Resolves once MathJax has finished loading and is ready to typeset. */
        promise: Promise<void>;
        /** When false, MathJax does not typeset the page on load. */
        typeset?: boolean;
        [key: string]: unknown;
    }

    /** The subset of the MathJax global object that we interact with.
     *
     * MathJax does not ship full TypeScript types, and the global doubles as
     * both the configuration object passed in before loading and the live API
     * exposed afterwards, so members we don't use are left as `unknown` via the
     * index signature rather than typed as `any`. */
    interface MathJaxObject {
        startup: MathJaxStartup;
        /** Clear MathJax's internal buffers from previous typesets. */
        typesetClear(): void;
        /** Typeset the given elements, resolving when rendering completes. */
        typesetPromise(elements?: HTMLElement[]): Promise<void>;
        /** Convert a TeX string into an SVG element. */
        tex2svg(input: string, options?: Record<string, unknown>): HTMLElement;
        [key: string]: unknown;
    }

    interface Window {
        MathJax: MathJaxObject;
    }

    // `var` (not `const`/`let`) so the global is also visible as
    // `globalThis.MathJax`, which editable/mathjax.ts relies on.
    // eslint-disable-next-line no-var
    var MathJax: MathJaxObject;
}
