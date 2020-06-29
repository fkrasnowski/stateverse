"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wachable = void 0;
exports.wachable = function (fun) {
    return (function () {
        var listeners = [];
        var wachableFun = function () {
            var values = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                values[_i] = arguments[_i];
            }
            listeners.forEach(function (callback) { return callback.apply(void 0, values); });
            return fun.apply(void 0, values);
        };
        wachableFun.watch = function (callback) {
            listeners.push(callback);
            return exports.wachable;
        };
        return wachableFun;
    })();
};
