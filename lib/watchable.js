"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchable = void 0;
exports.watchable = function (fn) {
    return (function () {
        var listeners = [];
        var wachableFun = function () {
            var values = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                values[_i] = arguments[_i];
            }
            listeners.forEach(function (callback) { return callback.apply(void 0, values); });
            return fn.apply(void 0, values);
        };
        wachableFun.watch = function (callback) {
            listeners.push(callback);
            return exports.watchable;
        };
        return wachableFun;
    })();
};
