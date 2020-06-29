import * as store from './store-api';
export default store;
export declare const createStore: <T>(initialState: T) => {
    readonly state: T;
    readonly actions: store.Actions;
    addReducers(reducers: store.Reducers<T>): any;
    addEffects(effects: store.Effects): any;
    watch(callback: (state: T) => void): any;
    map<S>(mapFn: (state: T) => S): store.WatchStore<T, S>;
};
export declare const wachable: <T>(fun: (...values: any) => T) => {
    (...values: any): T;
    watch(callback: store.CallBack): any;
};
