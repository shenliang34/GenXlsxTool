import { parentPort, MessagePort, Worker } from "worker_threads";
export class WorkerHelper {
    constructor() {

    }

    /**
     *打印
     * @param send
     * @param msg
     */
    static log(send: Worker | MessagePort, msg: string) {
        let message: SendMessageData = <SendMessageData>{};
        message.type = SubWorkerSendType.ConsoleLog;
        message.message = msg;
        send.postMessage(message);
    }
}