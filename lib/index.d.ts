import * as store from './store-api';
export default store;
export declare const createStore: <T>(initialState: T) => store.Store<T>;
export declare const wachable: <T>(fun: (...values: any) => T) => {
    (...values: any): T;
    watch(callback: store.CallBack): any;
};
