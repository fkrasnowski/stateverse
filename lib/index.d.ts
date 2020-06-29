import * as store from './store-api';
export default store;
export declare const createStore: <T>(initialState: T) => store.Store<T>;
export declare const watchable: (fn: Function) => {
    (...values: any): any;
    watch(callback: store.CallBack): any;
};
