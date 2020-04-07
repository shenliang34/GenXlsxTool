"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var worker_threads_1 = require("worker_threads");
var SubWorker = /** @class */ (function () {
    function SubWorker() {
    }
    SubWorker.prototype.start = function () {
        var _this = this;
        if (worker_threads_1.isMainThread) {
            return;
        }
        this.log("init finished");
        worker_threads_1.parentPort.on("message", function (value) {
            _this.log("收到主线程信息：" + value);
        });
    };
    SubWorker.prototype.postMessage = function (msg) {
        worker_threads_1.parentPort.postMessage(msg);
    };
    /** 打印信息*/
    SubWorker.prototype.log = function (msg) {
        this.postMessage({ type: 0 /* ConsoleLog */, message: msg });
    };
    return SubWorker;
}());
new SubWorker().start();
