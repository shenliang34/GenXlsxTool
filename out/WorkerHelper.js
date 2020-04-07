"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WorkerHelper = /** @class */ (function () {
    function WorkerHelper() {
    }
    /**
     *打印
     * @param send
     * @param msg
     */
    WorkerHelper.log = function (send, msg) {
        var message = {};
        message.type = 0 /* ConsoleLog */;
        message.message = msg;
        send.postMessage(message);
    };
    return WorkerHelper;
}());
exports.WorkerHelper = WorkerHelper;
