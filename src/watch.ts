import { Callback, Store, WatchStore } from './types';

export const watch = <T, S>(
  callback: (state: T) => any,
  listeners: Callback[],
  that: S
) => {
  listeners.push(callback);
  return that;
};

export const unwatch = <T, S>(
  callback: (state: T) => any,
  listeners: Callback[],
  that: S
) => {
  listeners = listeners.filter((v) => callback !== v);
  return that;
};
