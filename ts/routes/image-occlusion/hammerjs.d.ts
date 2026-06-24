// Minimal typings for the subset of hammerjs we use. The package ships no
// type declarations and @types/hammerjs is not a dependency, so without this
// `import Hammer from "hammerjs"` would have an implicit `any` type.

interface HammerInput {
    scale: number;
}

interface HammerManager {
    get(recognizer: string): { set(options: { enable: boolean }): HammerManager };
    on(events: string, handler: (event: HammerInput) => void): HammerManager;
    off(events: string): HammerManager;
}

interface HammerStatic {
    new(element: HTMLElement | SVGElement): HammerManager;
}

declare module "hammerjs" {
    const Hammer: HammerStatic;
    export default Hammer;
}
