"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var worker_threads_1 = require("worker_threads");
var MainWorker = /** @class */ (function () {
    function MainWorker() {
    }
    MainWorker.prototype.start = function () {
        var worker = new worker_threads_1.Worker("./SubWorker.js");
        // worker.on("message", (data) => {
        //     console.log("come from subworker", data);
        // })
    };
    return MainWorker;
}());
exports.MainWorker = MainWorker;
