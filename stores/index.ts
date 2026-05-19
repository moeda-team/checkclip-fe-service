// stores/index.ts
// createSelectors() utility for Zustand stores.
// WHY: Zustand's useStore() causes rerenders on ANY state change, even if
// the component only reads one field. createSelectors() generates individual
// selectors so components subscribe to only the state they need.
//
// USAGE:
//   const useUserStore = createSelectors(create<UserState>(...))
//   // In component:
//   const name = useUserStore.use.name()  // only rerenders when name changes

import type { StoreApi, UseBoundStore } from "zustand";

type ExtractState<S> = S extends { getState: () => infer T } ? T : never;

type SelectorKeys<S> = {
  [K in keyof ExtractState<S>]: () => ExtractState<S>[K];
};

export function createSelectors<S extends StoreApi<unknown>>(
  store: S
): UseBoundStore<S> & { use: SelectorKeys<S> } {
  const useStore: any = store;

  useStore.use = {};

  Object.keys(store.getState() as object).forEach((key) => {
    const selector = (state: any) => state[key] as unknown;
    useStore.use[key] = () => useStore(selector);
  });

  return useStore;
}
