import { Reducers, Effects, Actions, CallBack } from './types';
export { wachable } from './wachable';
export * from './types';
export declare class Store<T> {
    constructor(initialState: T);
    private _state;
    private _innerState;
    private _reducers;
    private _effects;
    private _listeners;
    private _actionListeners;
    private _id;
    private _cleanup;
    private _clean;
    private _setCleanup;
    private _setState;
    private _setInnerState;
    private _createActions;
    private _callActionListeners;
    private _callAction;
    private _actions;
    get state(): T;
    get actions(): Actions;
    addReducers(reducers: Reducers<T>): this;
    addEffects(effects: Effects): this;
    watch(callback: (state: T) => void): this;
    map<S>(mapFunction: (state: T) => S): WatchStore<T, S>;
}
declare class WatchStore<T, S> {
    constructor(store: Store<T>, mapFunction: (state: T) => S);
    private _mapFunction;
    private _state;
    private _setState;
    private _listeners;
    get state(): S;
    watch(callback: CallBack): this;
}
