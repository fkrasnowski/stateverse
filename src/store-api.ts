import {
  Reducers,
  Effects,
  Actions,
  ActionObject,
  Callback,
  Cleanup,
  Store,
  WatchStore,
} from './types';
import { ID } from './id-generator';
import err from './store-error';
export { watchable } from './watchable';
export * from './types';
import * as watchAPI from './watch';

const createWatchStore = <T, S>(
  store: Store<T>,
  mapFunction: (state: T) => S
): WatchStore<T, S> => {
  let _state: S = mapFunction(store.state);
  const _setState = (state: T) => {
    const nextState: S = mapFunction(state);
    if (nextState !== _state) {
      _state = nextState;
      _listeners.forEach((callback) => callback(_state));
    }
  };
  let _listeners: Callback[] = [];
  store.watch((state: T) => _setState(state));
  return {
    get state() {
      return _state;
    },
    watch(callback: Callback) {
      return watchAPI.watch(callback, _listeners, this);
    },
    unwatch(callback: (state: T) => any) {
      return watchAPI.unwatch(callback, _listeners, this);
    },
  };
};

export const createStore = <T>(initialState: T): Store<T> => {
  let _state: T = initialState;
  let _innerState: T = initialState;
  let _reducers: Reducers<T> = {};
  let _effects: Effects = {};
  let _listeners: Callback[] = [];
  let _actionListeners: { [name: string]: Callback[] } = {};
  const _id = new ID();
  let _cleanup: (() => void) | null = () => {};
  const _clean = () => {
    if (_cleanup) _cleanup();
    _cleanup = null;
  };
  const _setCleanup = (cleanup: () => void, id: number) => {
    if (_cleanup) _clean();
    if (_id.match(id)) _cleanup = cleanup;
    else cleanup();
  };
  const _setState = (state: T) => {
    _state = state;
    _listeners.forEach((callback) => callback(state));
  };
  const _setVirtualState = (state: T) => {
    _setState(state);
    _innerState = state;
  };

  const _createActions = (
    funs: Reducers<T> | Effects,
    type: string,
    id: number
  ) => {
    const actions: Actions = {};
    for (let name in funs) {
      actions[name] = (() => {
        _actionListeners[name] = _actionListeners[name]
          ? _actionListeners[name]
          : [];
        const action = (...values: any[]) => {
          _callAction({ name, type, id, values }); // Need to bind Store
        };
        action.watch = (callback: (...values: any) => void) => {
          _actionListeners[name].push(callback);
          return action;
        };
        return action;
      })();
    }
    return actions;
  };
  const _callActionListeners = (name: string, values: any[]) => {
    _actionListeners[name].forEach((callback: (...values: any) => any) =>
      callback(...values)
    );
  };

  const _callAction = async (action: ActionObject) => {
    if (action.type === 'reducer') {
      _clean();
      _callActionListeners(action.name, action.values);
      _id.generate();
      _setVirtualState(_reducers[action.name](_innerState, ...action.values));
    } else if (action.type === 'effect-reducer') {
      if (_id.match(action.id)) {
        _callActionListeners(action.name, action.values);
        _setState(
          _reducers[action.name](
            _state, // Inside effect state are mutating
            ...action.values
          )
        );
      }
    } else if (action.type === 'effect') {
      _clean();
      _callActionListeners(action.name, action.values);
      _state = _innerState; // State takes value of virtual if new effect is run
      const effectID = _id.generate();
      const cleanup = (cleanup: Cleanup) => _setCleanup(cleanup, effectID);
      const effect = _effects[action.name](
        _createActions(_reducers, 'effect-reducer', effectID),
        cleanup,
        ...action.values
      );

      effect.catch((e) => err(e, action.name));
    }
  };
  let _actions: Actions = {};
  return {
    get state(): T {
      return _state;
    },
    get actions(): Actions {
      return _actions;
    },
    addReducers(reducers: Reducers<T>) {
      _reducers = { ..._reducers, ...reducers };
      _actions = {
        ..._actions,
        ..._createActions(reducers, 'reducer', _id.current),
      };
      return this;
    },
    addEffects(effects: Effects) {
      _effects = { ..._effects, ...effects };
      _actions = {
        ..._actions,
        ..._createActions(effects, 'effect', _id.current),
      };
      return this;
    },
    watch(callback: (state: T) => any) {
      return watchAPI.watch(callback, _listeners, this);
    },
    unwatch(callback: (state: T) => any) {
      return watchAPI.unwatch(callback, _listeners, this);
    },
    map<S>(mapFn: (state: T) => S): WatchStore<T, S> {
      return createWatchStore<T, S>(this, mapFn);
    },
  };
};
