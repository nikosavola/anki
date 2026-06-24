export {};

declare global {
    namespace fabric {
        interface Object {
            id: string;
            ordinal: number;
            /** a custom property set on groups in the ungrouping routine to avoid adding a spurious undo entry */
            destroyed: boolean;
        }
        interface Line {
            /** custom property used to identify polygon edge lines while drawing */
            class: string;
        }
        interface Canvas {
            /** the DOM element fabric overlays for interaction */
            upperCanvasEl: HTMLCanvasElement;
            /** custom properties used to track the pointer while panning */
            lastPosX: number;
            lastPosY: number;
        }
    }

    /** the active image-occlusion canvas, shared with the drawing tools */
    // eslint-disable-next-line no-var
    var canvas: fabric.Canvas;
    /** reloads the image-occlusion editor with a new image */
    // eslint-disable-next-line no-var
    var resetIOImage: typeof import("./mask-editor").resetIOImage;
    /** the image-occlusion editor API, exposed for the surrounding note editor */
    // eslint-disable-next-line no-var
    var maskEditor: import("./tools/api").MaskEditorAPI | null;
}
