export declare type Action = {
    (...values: any): void;
    watch: (callback: (...values: any) => void) => Action;
};
export declare type Actions = {
    [name: string]: Action;
};
export declare type Reducer<T> = (state: T, ...values: any) => T;
export declare type Reducers<T> = {
    [name: string]: Reducer<T>;
};
export declare type Effect = (actions: Actions, cleanup: (cleanup: Cleanup) => void, ...values: any) => Promise<void>;
export declare type Effects = {
    [name: string]: Effect;
};
export declare type ActionObject = {
    type: string;
    name: string;
    values: any[];
    id: number;
};
export declare type CallBack = (...values: any) => void;
export declare type Cleanup = () => any;
export declare type Store<T> = {
    readonly state: T;
    readonly actions: Actions;
    addReducers(reducers: Reducers<T>): Store<T>;
    addEffects(effects: Effects): Store<T>;
    watch(callback: (state: T) => void): Store<T>;
    map<S>(mapFn: (state: T) => S): WatchStore<T, S>;
};
export declare type WatchStore<T, S> = {
    readonly state: S;
    watch(callback: CallBack): WatchStore<T, S>;
};
