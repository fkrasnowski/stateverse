"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ID = void 0;
var idGenenrator = function () {
    var id = 0;
    return function () {
        if (id > 20000)
            id = 0;
        return id++;
    };
};
var ID = /** @class */ (function () {
    function ID() {
        this.id = 0;
        this.generateID = idGenenrator();
    }
    ID.prototype.generate = function () {
        this.id = this.generateID();
        return this.id;
    };
    ID.prototype.match = function (id) {
        return id === this.id;
    };
    Object.defineProperty(ID.prototype, "current", {
        get: function () {
            return this.id;
        },
        enumerable: false,
        configurable: true
    });
    return ID;
}());
exports.ID = ID;
