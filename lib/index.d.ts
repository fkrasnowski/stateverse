import * as store from './store-api';
export default store;
export declare const Store: typeof store.Store;
export declare const wachable: <T>(fun: (...values: any) => T) => {
    (...values: any): T;
    watch(callback: store.CallBack): any;
};
