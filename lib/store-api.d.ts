import { Store } from './types';
export { watchable } from './watchable';
export * from './types';
export declare const createStore: <T>(initialState: T) => Store<T>;
