import { CallBack } from './types';

export const wachable = <T>(fun: (...values: any) => T) =>
  (() => {
    const listeners: CallBack[] = [];
    const wachableFun = (...values: any) => {
      listeners.forEach((callback) => callback(...values));
      return fun(...values);
    };
    wachableFun.watch = (callback: CallBack) => {
      listeners.push(callback);
      return wachable;
    };
    return wachableFun;
  })();
