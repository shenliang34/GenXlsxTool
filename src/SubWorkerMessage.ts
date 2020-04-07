const enum SubWorkerSendType {
    ConsoleLog,
}


interface SendMessageData {
    type: SubWorkerSendType;
    message: string;
}