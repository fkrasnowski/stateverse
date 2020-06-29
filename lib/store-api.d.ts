import { Store } from './types';
export { wachable } from './wachable';
export * from './types';
export declare const createStore: <T>(initialState: T) => Store<T>;
