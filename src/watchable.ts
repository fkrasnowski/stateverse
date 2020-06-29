import { CallBack } from './types';

export const watchable = (fn: Function) =>
  (() => {
    const listeners: CallBack[] = [];
    const wachableFun = (...values: any) => {
      listeners.forEach((callback) => callback(...values));
      return fn(...values);
    };
    wachableFun.watch = (callback: CallBack) => {
      listeners.push(callback);
      return watchable;
    };
    return wachableFun;
  })();
