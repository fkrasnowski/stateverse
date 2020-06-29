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
exports.Store = void 0;
var id_generator_1 = require("./id-generator");
var store_error_1 = require("./store-error");
var wachable_1 = require("./wachable");
Object.defineProperty(exports, "wachable", { enumerable: true, get: function () { return wachable_1.wachable; } });
__exportStar(require("./types"), exports);
var Store = /** @class */ (function () {
    function Store(initialState) {
        this._reducers = {};
        this._effects = {};
        this._listeners = [];
        this._actionListeners = {};
        this._cleanup = function () { };
        this._actions = {};
        this._state = initialState;
        this._innerState = initialState;
        this._id = new id_generator_1.ID();
    }
    Store.prototype._clean = function () {
        if (this._cleanup)
            this._cleanup();
        this._cleanup = null;
    };
    Store.prototype._setCleanup = function (cleanup, id) {
        if (this._cleanup)
            this._clean();
        if (this._id.match(id))
            this._cleanup = cleanup;
        else
            cleanup();
    };
    Store.prototype._setState = function (state) {
        this._state = state;
        this._listeners.forEach(function (callback) { return callback(state); });
    };
    Store.prototype._setInnerState = function (state) {
        this._setState(state);
        this._innerState = state;
    };
    Store.prototype._createActions = function (funs, type, id) {
        var _this = this;
        var actions = {};
        var _loop_1 = function (name_1) {
            actions[name_1] = (function () {
                _this._actionListeners[name_1] = _this._actionListeners[name_1]
                    ? _this._actionListeners[name_1]
                    : [];
                var action = function () {
                    var values = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        values[_i] = arguments[_i];
                    }
                    _this._callAction({ name: name_1, type: type, id: id, values: values }); // Need to bind Store
                };
                action.watch = function (callback) {
                    _this._actionListeners[name_1].push(callback);
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
    Store.prototype._callActionListeners = function (name, values) {
        this._actionListeners[name].forEach(function (callback) {
            return callback.apply(void 0, values);
        });
    };
    Store.prototype._callAction = function (action) {
        return __awaiter(this, void 0, void 0, function () {
            var effectID_1, cleanup, effect;
            var _a, _b, _c;
            var _this = this;
            return __generator(this, function (_d) {
                if (action.type === 'reducer') {
                    this._clean();
                    this._callActionListeners(action.name, action.values);
                    this._id.generate();
                    this._setInnerState((_a = this._reducers)[action.name].apply(_a, __spreadArrays([this._innerState], action.values)));
                }
                else if (action.type === 'effect-reducer') {
                    if (this._id.match(action.id)) {
                        this._callActionListeners(action.name, action.values);
                        this._setState((_b = this._reducers)[action.name].apply(_b, __spreadArrays([this._state], action.values)));
                    }
                }
                else if (action.type === 'effect') {
                    this._clean();
                    this._callActionListeners(action.name, action.values);
                    this._state = this._innerState; // State takes value of virtual if new effect is run
                    effectID_1 = this._id.generate();
                    cleanup = function (cleanup) { return _this._setCleanup(cleanup, effectID_1); };
                    effect = (_c = this._effects)[action.name].apply(_c, __spreadArrays([this._createActions(this._reducers, 'effect-reducer', effectID_1),
                        cleanup], action.values));
                    effect
                        .catch(function (e) { return store_error_1.default(e, action.name); })
                        .finally(function () {
                        if (_this._id.match(effectID_1))
                            _this._innerState = _this._state;
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    Object.defineProperty(Store.prototype, "state", {
        get: function () {
            return this._state;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Store.prototype, "actions", {
        get: function () {
            return this._actions;
        },
        enumerable: false,
        configurable: true
    });
    Store.prototype.addReducers = function (reducers) {
        this._reducers = __assign(__assign({}, this._reducers), reducers);
        this._actions = __assign(__assign({}, this._actions), this._createActions(reducers, 'reducer', this._id.current));
        return this;
    };
    Store.prototype.addEffects = function (effects) {
        this._effects = __assign(__assign({}, this._effects), effects);
        this._actions = __assign(__assign({}, this._actions), this._createActions(effects, 'effect', this._id.current));
        return this;
    };
    Store.prototype.watch = function (callback) {
        this._listeners.push(callback);
        return this;
    };
    Store.prototype.map = function (mapFunction) {
        return new WatchStore(this, mapFunction);
    };
    return Store;
}());
exports.Store = Store;
var WatchStore = /** @class */ (function () {
    function WatchStore(store, mapFunction) {
        var _this = this;
        this._listeners = [];
        this._mapFunction = mapFunction;
        this._state = mapFunction(store.state);
        store.watch(function (state) { return _this._setState(state); });
    }
    WatchStore.prototype._setState = function (state) {
        var _this = this;
        var nextState = this._mapFunction(state);
        if (nextState !== this.state) {
            this._state = nextState;
            this._listeners.forEach(function (callback) { return callback(_this.state); });
        }
    };
    Object.defineProperty(WatchStore.prototype, "state", {
        get: function () {
            return this._state;
        },
        enumerable: false,
        configurable: true
    });
    WatchStore.prototype.watch = function (callback) {
        this._listeners.push(callback);
        return this;
    };
    return WatchStore;
}());
