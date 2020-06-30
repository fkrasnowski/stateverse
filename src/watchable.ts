import { Callback } from './types';
import * as watchAPI from './watch';

export const watchable = (fn: Function) =>
  (() => {
    const listeners: Callback[] = [];
    const wachableFun = (...values: any) => {
      listeners.forEach((callback) => callback(...values));
      return fn(...values);
    };
    wachableFun.watch = (callback: Callback) =>
      watchAPI.watch(callback, listeners, wachableFun);
    wachableFun.unwatch = (callback: Callback) =>
      watchAPI.unwatch(callback, listeners, wachableFun);
    return wachableFun;
  })();
