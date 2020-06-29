"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (e, effectName) {
    e.name = "StoreError > " + e.name;
    e.message = e.message + " (in " + effectName + ")";
    console.error(e);
});
