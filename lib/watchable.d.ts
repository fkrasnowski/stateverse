import { CallBack } from './types';
export declare const watchable: (fn: Function) => {
    (...values: any): any;
    watch(callback: CallBack): any;
};
