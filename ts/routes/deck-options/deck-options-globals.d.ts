// Bridge global the deck options page exposes for the Qt host.
export {};

declare global {
    /** resolves to the deck options page component once it is mounted */
    // eslint-disable-next-line no-var
    var $deckOptions: Promise<unknown>;
}
