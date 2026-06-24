import "@poppanator/sveltekit-svg/dist/svg";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        // interface Locals {}
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }

    // Globals the editor exposes for the Qt host and the image-occlusion editor.
    /** sets the image field of an image-occlusion note from the editor */
    // eslint-disable-next-line no-var
    var setImageField: (html: string) => void;
    /** resets the image-occlusion "image loaded" state when reusing the editor */
    // eslint-disable-next-line no-var
    var resetIOImageLoaded: () => void;
    /** the editor's current high-level state, mirrored for the Qt host */
    // eslint-disable-next-line no-var
    var editorState: import("../editor/types").EditorState;
}

export {};
