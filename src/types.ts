export type Action = {
  (...values: any): void;
  watch: (callback: (...values: any) => void) => Action;
};
export type Actions = {
  [name: string]: Action;
};
export type Reducer<T> = (state: T, ...values: any) => T;
export type Reducers<T> = {
  [name: string]: Reducer<T>;
};

export type Effect = (
  actions: Actions,
  cleanup: (cleanup: Cleanup) => void,
  ...values: any
) => Promise<void>;
export type Effects = {
  [name: string]: Effect;
};

export type ActionObject = {
  type: string;
  name: string;
  values: any[];
  id: number;
};

export type CallBack = (...values: any) => void;

export type Cleanup = () => any;

export type Store<T> = {
  readonly state: T;
  readonly actions: Actions;
  addReducers(reducers: Reducers<T>): Store<T>;
  addEffects(effects: Effects): Store<T>;
  watch(callback: (state: T) => void): Store<T>;
  map<S>(mapFn: (state: T) => S): WatchStore<T, S>;
};

export type WatchStore<T, S> = {
  readonly state: S;
  watch(callback: CallBack): WatchStore<T, S>;
};
