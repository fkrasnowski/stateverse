import { Reducers, Effects, Actions, WatchStore } from './types';
export { wachable } from './wachable';
export * from './types';
export declare const createStore: <T>(initialState: T) => {
    readonly state: T;
    readonly actions: Actions;
    addReducers(reducers: Reducers<T>): any;
    addEffects(effects: Effects): any;
    watch(callback: (state: T) => void): any;
    map<S>(mapFn: (state: T) => S): WatchStore<T, S>;
};
