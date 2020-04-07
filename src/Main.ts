import node_xlsx = require("node-xlsx");
import fs = require("fs-extra");
import Zlib = require("zlib");
import { KeyObject } from "crypto";
import { ByteArray } from "./ByteArray";
import { exec } from "child_process";
import { fileURLToPath } from "url";
// import { MainWorker } from "./MainWorker";
import { isMainThread, Worker } from "worker_threads";

let configUrl: string = "res/config.json";
let pathConfig: IPathConfig;


var byteArray: ByteArray;
function startRead() {
    let { outBinPath, srcXlsxPath, outFileName } = pathConfig;
    let outFileFullUrl = outBinPath + outFileName;
    fs.ensureDir(outBinPath)
    byteArray = new ByteArray();


    let fileStat = fs.statSync(srcXlsxPath);
    if (fileStat.isDirectory()) {
        //是目录
        fs.readdir(srcXlsxPath, (err, files) => {
            files = files.filter(value => {
                return /^[^~]*(\.xlsx$)/.test(value)
            })

            console.log("files")

            let count: number = files.length;
            byteArray.writeFloat(count);

            files.forEach((name, index) => {
                let newPath = srcXlsxPath + name;
                let stat = fs.statSync(newPath);
                if (stat.isFile()) {
                    // readSingle(newPath);
                }
                console.log("(%s/%s)  开始处理：%s", index + 1, count, name);
            })

            Zlib.gzip(byteArray.bytes, (err, result) => {
                if (!err) {
                    fs.writeFile(outFileFullUrl, result, (e) => {
                        console.log("生成成功");
                        // fs.copy(outBinUrl, "lib\\config.bin", (err) => {
                        //     console.log("拷贝成功")
                        //     // fs.opendir()
                        // })
                    })
                }
            })

            // fs.writeFile(outBinUrl, byteArray.bytes, (err) => {
            //     console.log("生成成功")
            // })
            // console.log("处理结束");
        })
    }
    else {
        // readSingle(srcXlsxPath);
    }
}





// exec("explorer.exe config\\", (err, out) => {
//     if (err) {
//         console.log(err.message);
//     }
//     else {
//         console.log(out);
//     }
// })



// fs.readFile(outBinUrl, (err, buff) => {
//     Zlib.unzip(buff, (err, data) => {
//         var b = new ByteArray(data);
//         b.position = 0;
//         console.log(b.readFloat());
//         console.log(b.readUTF());
//         let len = b.readFloat();
//         console.log(b.readUTFBytes(len))
//         // let obj = JSON.parse(b.readUTF())
//         // console.log(obj);

//     })
// })

// new Zlib.deflate("fsfsfsfs", (err, result) => {
//     // let a = new ArrayBuffer(result.byteLength);
//     console.log(result);
//     new Zlib.unzip(result, (err, result2) => {
//         console.log(result2.toString());
//     })
// })
// inflate.compress();


// fs.readFile(configUrl, "utf-8", (err, data) => {
//     pathConfig = <IPathConfig>JSON.parse(data);

//     startRead();
// })

// workerThreads
// startRead();


// const input = '.................................';
// Zlib.deflate(input, (err, buffer) => {
//     if (!err) {
//         console.log(buffer.toString('base64'));
//     } else {
//         // 处理错误
//     }
// });

// new Worker("thread").postMessage("aaaaa",PostMessageOptions)

// const buffer = Buffer.from('eJzT0yMAAGTvBe8=', 'base64');
// Zlib.unzip(buffer, (err, buffer) => {
//     if (!err) {
//         console.log(buffer.toString());
//     } else {
//         // 处理错误
//     }
// });

// let val = "fsfsfsfs"
// console.log(val)
// var a: Buffer = Buffer.alloc(val.length * 3);
// var dataView = new DataView(a);
// var buff = new ArrayBuffer(4);
// var dataView = new DataView(buff, 0, buff.byteLength);
// dataView.setFloat32(0, 5);
// console.log(dataView.getFloat32(0));

// var a = new ByteArray();
// a.writeUTF("fsfsffsfs");
// a.position = 0;
// let result = a.readUTF();
// console.log(result);

// a.write(val);
// console.log(a.toString());
// console.log(dataView.getUint16(0));

// import {is} = require("worker_threads")


interface IPathConfig {
    outBinPath: string;
    srcXlsxPath: string;
    outFileName: string;
    tmpTsFileUrl: string;
    outTsFilePath: string;
}

// import { Worker, isMainThread, workerData } from "worker_threads";
// var work = new Worker("ExplorTS.js");
// work.on("message", (evt) => {
//     console.log("val", evt);
// })
// var myUrl: string = "ffsfsfsfs";

// var worker = new Worker("./out/ExplorTS.js");
// worker.on("error", (err) => {
//     console.log("error" + err.message)
// })

// worker.on("message", (value: SendMessageData) => {
//     switch (value.type) {
//         case SubWorkerSendType.ConsoleLog:
//             console.log("收到子线程消息" + value.message);
//             break;
//     }
// })

// worker.postMessage("发送给子线程");

// export interface IFiledProperty {
//     key: string;
//     type: string;
// }


const enum FiledType {
    String,
    Number,
}



class A {

}

interface A {
    a(params: string);
}

A.prototype.a = function (this: A, params: string) {
    console.log("fsfsfsfs" + params);
}


new A().a("fsfsfs");