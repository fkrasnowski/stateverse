import { CallBack } from './types';
export declare const wachable: <T>(fun: (...values: any) => T) => {
    (...values: any): T;
    watch(callback: CallBack): any;
};
