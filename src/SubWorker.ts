import { isMainThread, Worker, parentPort } from "worker_threads";

class SubWorker {
    constructor() {

    }

    start() {
        if (isMainThread) {
            return;
        }

        this.log("init finished");
        parentPort.on("message", (value) => {
            this.log("收到主线程信息：" + value);
        })
    }


    postMessage(msg: SendMessageData) {
        parentPort.postMessage(msg);
    }

    /** 打印信息*/
    log(msg: string) {
        this.postMessage({ type: SubWorkerSendType.ConsoleLog, message: msg })
    }
}

new SubWorker().start();