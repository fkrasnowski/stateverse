import {
  Reducers,
  Effects,
  Actions,
  ActionObject,
  CallBack,
  Cleanup,
} from './types';
import { ID } from './id-generator';
import err from './store-error';
export { wachable } from './wachable';
export * from './types';

export class Store<T> {
  constructor(initialState: T) {
    this._state = initialState;
    this._innerState = initialState;
    this._id = new ID();
  }
  private _state: T;
  private _innerState: T;
  private _reducers: Reducers<T> = {};
  private _effects: Effects = {};
  private _listeners: CallBack[] = [];
  private _actionListeners: { [name: string]: CallBack[] } = {};
  private _id: ID;
  private _cleanup: (() => void) | null = () => {};
  private _clean() {
    if (this._cleanup) this._cleanup();
    this._cleanup = null;
  }
  private _setCleanup(cleanup: () => void, id: number) {
    if (this._cleanup) this._clean();
    if (this._id.match(id)) this._cleanup = cleanup;
    else cleanup();
  }
  private _setState(state: T) {
    this._state = state;
    this._listeners.forEach((callback) => callback(state));
  }
  private _setInnerState(state: T) {
    this._setState(state);
    this._innerState = state;
  }

  private _createActions(
    funs: Reducers<T> | Effects,
    type: string,
    id: number
  ) {
    const actions: Actions = {};
    for (let name in funs) {
      actions[name] = (() => {
        this._actionListeners[name] = this._actionListeners[name]
          ? this._actionListeners[name]
          : [];
        const action = (...values: any[]) => {
          this._callAction({ name, type, id, values }); // Need to bind Store
        };
        action.watch = (callback: (...values: any) => void) => {
          this._actionListeners[name].push(callback);
          return action;
        };
        return action;
      })();
    }
    return actions;
  }
  private _callActionListeners(name: string, values: any[]) {
    this._actionListeners[name].forEach((callback: (...values: any) => any) =>
      callback(...values)
    );
  }

  private async _callAction(action: ActionObject) {
    if (action.type === 'reducer') {
      this._clean();
      this._callActionListeners(action.name, action.values);
      this._id.generate();
      this._setInnerState(
        this._reducers[action.name](this._innerState, ...action.values)
      );
    } else if (action.type === 'effect-reducer') {
      if (this._id.match(action.id)) {
        this._callActionListeners(action.name, action.values);
        this._setState(
          this._reducers[action.name](
            this._state, // Inside effect state are mutating
            ...action.values
          )
        );
      }
    } else if (action.type === 'effect') {
      this._clean();
      this._callActionListeners(action.name, action.values);
      this._state = this._innerState; // State takes value of virtual if new effect is run
      const effectID = this._id.generate();
      const cleanup = (cleanup: Cleanup) => this._setCleanup(cleanup, effectID);
      const effect = this._effects[action.name](
        this._createActions(this._reducers, 'effect-reducer', effectID),
        cleanup,
        ...action.values
      );

      effect
        .catch((e) => err(e, action.name))
        .finally(() => {
          if (this._id.match(effectID)) this._innerState = this._state;
        });
    }
  }
  private _actions: Actions = {};
  get state(): T {
    return this._state;
  }
  get actions(): Actions {
    return this._actions;
  }
  addReducers(reducers: Reducers<T>) {
    this._reducers = { ...this._reducers, ...reducers };
    this._actions = {
      ...this._actions,
      ...this._createActions(reducers, 'reducer', this._id.current),
    };
    return this;
  }
  addEffects(effects: Effects) {
    this._effects = { ...this._effects, ...effects };
    this._actions = {
      ...this._actions,
      ...this._createActions(effects, 'effect', this._id.current),
    };
    return this;
  }
  watch(callback: (state: T) => void) {
    this._listeners.push(callback);
    return this;
  }
  map<S>(mapFunction: (state: T) => S) {
    return new WatchStore<T, S>(this, mapFunction);
  }
}

class WatchStore<T, S> {
  constructor(store: Store<T>, mapFunction: (state: T) => S) {
    this._mapFunction = mapFunction;
    this._state = mapFunction(store.state);
    store.watch((state: T) => this._setState(state));
  }
  private _mapFunction: (state: T) => S;
  private _state: S;
  private _setState(state: T) {
    const nextState: S = this._mapFunction(state);
    if (nextState !== this.state) {
      this._state = nextState;
      this._listeners.forEach((callback) => callback(this.state));
    }
  }
  private _listeners: CallBack[] = [];
  get state() {
    return this._state;
  }
  watch(callback: CallBack) {
    this._listeners.push(callback);
    return this;
  }
}
