import { parentPort } from "worker_threads";
import { WorkerHelper } from "./WorkerHelper";

// export class ExplorTS {
//     constructor() {

//     }

//     start() {
//         WorkerHelper.log(parentPort, "fsfsfsffs");
//     }


    // var tmpFileContent;

// private function genTsFile(className: string, fields: IFiledProperty[]) {
//     let tmp = tmpFileContent;
//     if (!tmp) {
//         fs.readFile(pathConfig.tmpTsFileUrl, "utf-8", (err, data) => {
//             tmp = tmpFileContent = data;
//             genTsFile2(className, fields);
//         })
//     }
//     else {
//         genTsFile2(className, fields);
//     }
// }

// private function genTsFile2(className: string, fields: IFiledProperty[]) {
//     let content: string = tmpFileContent;
//     className = "I" + className;
//     content = content.replace(/\$classname\$/g, className);
//     let fieldContent = "";
//     fields.forEach(value => {
//         fieldContent += value.key + ":" + value.type + ";\n\t";
//     })
//     content = content.replace("$contont$", fieldContent);
//     fs.ensureDir(pathConfig.outTsFilePath);
//     let tsFileName = pathConfig.outTsFilePath + className + ".ts";
//     fs.writeFile(tsFileName, content);
// }

// function readSingle(filePath: string) {
//     let xlsxList = node_xlsx.parse(filePath);
//     xlsxList.forEach(sheet => {
//         //单簇表
//         let needList: string[] = [];
//         let filedList: string[] = [];
//         let valueList: string[] = [];
//         let filedProp: IFiledProperty[] = [];
//         let className = "";
//         sheet.data.forEach((list, index) => {
//             // let content: string = cfgtmps;
//             let fileds: string = "";
//             let obj: any = new Object();
//             let isValue: boolean = false;
//             list.forEach((value: string, line) => {
//                 if (index == 0) {
//                     if (line == 0) {
//                         className = value.charAt(0).toLocaleUpperCase() + value.substr(1);
//                         //表头
//                         // content.replace("{name}", className);
//                     }
//                     else {
//                         if (value && value.charAt(0) != "*") {
//                             needList[line] = value;
//                         }
//                     }
//                 }
//                 else if (index == 1) {
//                     //客户端字段名
//                     let need = needList[line];
//                     if (need) {
//                         filedList[line] = value;
//                         let p: IFiledProperty = <IFiledProperty>{}
//                         p.key = value;
//                         p.type = need.charAt(0) == "$" ? "number" : "string";
//                         filedProp.push(p);
//                     }
//                 }
//                 else if (index == 2) {
//                     //服务器字段名
//                 }
//                 else {
//                     //数据
//                     let filed = filedList[line];
//                     if (filed) {
//                         let need = needList[line];
//                         isValue = true;
//                         if (need.charAt(0) == "$") {
//                             obj[filed] = +value;
//                         }
//                         else {
//                             obj[filed] = value;
//                         }
//                     }
//                 }
//             })
//             if (isValue) {
//                 let jsonValues = JSON.stringify(obj);
//                 valueList.push(jsonValues);
//             }
//         })

//         if (className) {
//             byteArray.writeUTF(className);
//             let obj = new Object();
//             obj["unit"] = [valueList];
//             let str = JSON.stringify(obj);
//             let uArray = byteArray.encodeUTF8(str);
//             byteArray.writeFloat(uArray.length)
//             byteArray.writeUTFBytes(str);

//             genTsFile(className, filedProp);
//         }
//     })
// }
// }


// new ExplorTS().start();