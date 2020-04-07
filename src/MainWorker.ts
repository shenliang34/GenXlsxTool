import { isMainThread, Worker } from "worker_threads";

export class MainWorker {
    constructor() {

    }

    start() {
        var worker = new Worker("./SubWorker.js");
        // worker.on("message", (data) => {
        //     console.log("come from subworker", data);
        // })
    }
}