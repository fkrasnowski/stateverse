"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStore = void 0;
var id_generator_1 = require("./id-generator");
var store_error_1 = require("./store-error");
var wachable_1 = require("./wachable");
Object.defineProperty(exports, "wachable", { enumerable: true, get: function () { return wachable_1.wachable; } });
__exportStar(require("./types"), exports);
// export class Store<T> {
//   constructor(initialState: T) {
//     this._state = initialState;
//     this._innerState = initialState;
//     this._id = new ID();
//
//   }
//   private _state: T;
//   private _innerState: T;
//   private _reducers: Reducers<T> = {};
//   private _effects: Effects = {};
//   private _listeners: CallBack[] = [];
//   private _actionListeners: { [name: string]: CallBack[] } = {};
//   private _id: ID;
//   private _cleanup: (() => void) | null = () => {};
//   private _clean() {
//     if (this._cleanup) this._cleanup();
//     this._cleanup = null;
//   }
//   private _setCleanup(cleanup: () => void, id: number) {
//     if (this._cleanup) this._clean();
//     if (this._id.match(id)) this._cleanup = cleanup;
//     else cleanup();
//   }
//   private _setState(state: T) {
//     this._state = state;
//     this._listeners.forEach((callback) => callback(state));
//   }
//   private _setInnerState(state: T) {
//     this._setState(state);
//     this._innerState = state;
//   }
//   private _createActions(
//     funs: Reducers<T> | Effects,
//     type: string,
//     id: number
//   ) {
//     const actions: Actions = {};
//     for (let name in funs) {
//       actions[name] = (() => {
//         this._actionListeners[name] = this._actionListeners[name]
//           ? this._actionListeners[name]
//           : [];
//         const action = (...values: any[]) => {
//           this._callAction({ name, type, id, values }); // Need to bind Store
//         };
//         action.watch = (callback: (...values: any) => void) => {
//           this._actionListeners[name].push(callback);
//           return action;
//         };
//         return action;
//       })();
//     }
//     return actions;
//   }
//   private _callActionListeners(name: string, values: any[]) {
//     this._actionListeners[name].forEach((callback: (...values: any) => any) =>
//       callback(...values)
//     );
//   }
//   private async _callAction(action: ActionObject) {
//     if (action.type === 'reducer') {
//       this._clean();
//       this._callActionListeners(action.name, action.values);
//       this._id.generate();
//       this._setInnerState(
//         this._reducers[action.name](this._innerState, ...action.values)
//       );
//     } else if (action.type === 'effect-reducer') {
//       if (this._id.match(action.id)) {
//         this._callActionListeners(action.name, action.values);
//         this._setState(
//           this._reducers[action.name](
//             this._state, // Inside effect state are mutating
//             ...action.values
//           )
//         );
//       }
//     } else if (action.type === 'effect') {
//       this._clean();
//       this._callActionListeners(action.name, action.values);
//       this._state = this._innerState; // State takes value of virtual if new effect is run
//       const effectID = this._id.generate();
//       const cleanup = (cleanup: Cleanup) => this._setCleanup(cleanup, effectID);
//       const effect = this._effects[action.name](
//         this._createActions(this._reducers, 'effect-reducer', effectID),
//         cleanup,
//         ...action.values
//       );
//       effect
//         .catch((e) => err(e, action.name))
//         .finally(() => {
//           if (this._id.match(effectID)) this._innerState = this._state;
//         });
//     }
//   }
//   private _actions: Actions = {};
//   get state(): T {
//     return this._state;
//   }
//   get actions(): Actions {
//     return this._actions;
//   }
//   addReducers(reducers: Reducers<T>) {
//     this._reducers = { ...this._reducers, ...reducers };
//     this._actions = {
//       ...this._actions,
//       ...this._createActions(reducers, 'reducer', this._id.current),
//     };
//     return this;
//   }
//   addEffects(effects: Effects) {
//     this._effects = { ...this._effects, ...effects };
//     this._actions = {
//       ...this._actions,
//       ...this._createActions(effects, 'effect', this._id.current),
//     };
//     return this;
//   }
//   watch(callback: (state: T) => void) {
//     this._listeners.push(callback);
//     return this;
//   }
//   map<S>(mapFunction: (state: T) => S) {
//     return new WatchStore<T, S>(this, mapFunction);
//   }
// }
// class WatchStore<T, S> {
//   constructor(store: Store<T>, mapFunction: (state: T) => S) {
//     this._mapFunction = mapFunction;
//     this._state = mapFunction(store.state);
//     //store.watch((state: T) => this._setState(state));
//   }
//   private _mapFunction: (state: T) => S;
//   private _state: S;
//   private _setState(state: T) {
//     const nextState: S = this._mapFunction(state);
//     if (nextState !== this.state) {
//       this._state = nextState;
//       this._listeners.forEach((callback) => callback(this.state));
//     }
//   }
//   private _listeners: CallBack[] = [];
//   get state() {
//     return this._state;
//   }
//   watch(callback: CallBack) {
//     this._listeners.push(callback);
//     return this;
//   }
// }
// 💥💥💥💥💥💥💥💥💥💥💥💥
// 💥💥💥💥💥💥💥💥💥💥💥💥
// 💥💥💥💥💥💥💥💥💥💥💥💥
var createWatchStore = function (store, mapFunction) {
    var _state = mapFunction(store.state);
    var _setState = function (state) {
        var nextState = mapFunction(state);
        if (nextState !== _state) {
            _state = nextState;
            _listeners.forEach(function (callback) { return callback(_state); });
        }
    };
    var _listeners = [];
    store.watch(function (state) { return _setState(state); });
    return {
        get state() {
            return _state;
        },
        watch: function (callback) {
            _listeners.push(callback);
            return this;
        },
    };
};
exports.createStore = function (initialState) {
    var _state = initialState;
    var _innerState = initialState;
    var _reducers = {};
    var _effects = {};
    var _listeners = [];
    var _actionListeners = {};
    var _id = new id_generator_1.ID();
    var _cleanup = function () { };
    var _clean = function () {
        if (_cleanup)
            _cleanup();
        _cleanup = null;
    };
    var _setCleanup = function (cleanup, id) {
        if (_cleanup)
            _clean();
        if (_id.match(id))
            _cleanup = cleanup;
        else
            cleanup();
    };
    var _setState = function (state) {
        _state = state;
        _listeners.forEach(function (callback) { return callback(state); });
    };
    var _setVirtualState = function (state) {
        _setState(state);
        _innerState = state;
    };
    var _createActions = function (funs, type, id) {
        var actions = {};
        var _loop_1 = function (name_1) {
            actions[name_1] = (function () {
                _actionListeners[name_1] = _actionListeners[name_1]
                    ? _actionListeners[name_1]
                    : [];
                var action = function () {
                    var values = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        values[_i] = arguments[_i];
                    }
                    _callAction({ name: name_1, type: type, id: id, values: values }); // Need to bind Store
                };
                action.watch = function (callback) {
                    _actionListeners[name_1].push(callback);
                    return action;
                };
                return action;
            })();
        };
        for (var name_1 in funs) {
            _loop_1(name_1);
        }
        return actions;
    };
    var _callActionListeners = function (name, values) {
        _actionListeners[name].forEach(function (callback) {
            return callback.apply(void 0, values);
        });
    };
    var _callAction = function (action) { return __awaiter(void 0, void 0, void 0, function () {
        var effectID_1, cleanup, effect;
        return __generator(this, function (_a) {
            if (action.type === 'reducer') {
                _clean();
                _callActionListeners(action.name, action.values);
                _id.generate();
                _setVirtualState(_reducers[action.name].apply(_reducers, __spreadArrays([_innerState], action.values)));
            }
            else if (action.type === 'effect-reducer') {
                if (_id.match(action.id)) {
                    _callActionListeners(action.name, action.values);
                    _setState(_reducers[action.name].apply(_reducers, __spreadArrays([_state], action.values)));
                }
            }
            else if (action.type === 'effect') {
                _clean();
                _callActionListeners(action.name, action.values);
                _state = _innerState; // State takes value of virtual if new effect is run
                effectID_1 = _id.generate();
                cleanup = function (cleanup) { return _setCleanup(cleanup, effectID_1); };
                effect = _effects[action.name].apply(_effects, __spreadArrays([_createActions(_reducers, 'effect-reducer', effectID_1),
                    cleanup], action.values));
                effect.catch(function (e) { return store_error_1.default(e, action.name); });
            }
            return [2 /*return*/];
        });
    }); };
    var _actions = {};
    return {
        get state() {
            return _state;
        },
        get actions() {
            return _actions;
        },
        addReducers: function (reducers) {
            _reducers = __assign(__assign({}, _reducers), reducers);
            _actions = __assign(__assign({}, _actions), _createActions(reducers, 'reducer', _id.current));
            return this;
        },
        addEffects: function (effects) {
            _effects = __assign(__assign({}, _effects), effects);
            _actions = __assign(__assign({}, _actions), _createActions(effects, 'effect', _id.current));
            return this;
        },
        watch: function (callback) {
            _listeners.push(callback);
            return this;
        },
        map: function (mapFn) {
            return createWatchStore(this, mapFn);
        },
    };
};
