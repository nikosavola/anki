// Copyright: Ankitects Pty Ltd and contributors
// License: GNU AGPL, version 3 or later; http://www.gnu.org/licenses/agpl.html

export interface Destroyable {
    destroy(): void;
}

export function clearableArray<T>(): (T & Destroyable)[] {
    const list: (T & Destroyable)[] = [];

    return new Proxy(list, {
        get: function(target: (T & Destroyable)[], prop: string | symbol) {
            const indexable = target as unknown as Record<string | symbol, T & Destroyable>;
            if (!(typeof prop === "symbol") && !isNaN(Number(prop)) && !indexable[prop]) {
                const item = {} as T & Destroyable;

                const destroy = (): void => {
                    const index = list.indexOf(item);
                    list.splice(index, 1);
                };

                indexable[prop] = new Proxy(item, {
                    get: function(target: T & Destroyable, prop: string | symbol) {
                        if (prop === "destroy") {
                            return destroy;
                        }

                        return (target as unknown as Record<string | symbol, unknown>)[prop];
                    },
                });
            }

            return indexable[prop];
        },
    });
}
