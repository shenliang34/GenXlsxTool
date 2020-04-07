"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var Zlib = require("zlib");
var ByteArray_1 = require("./ByteArray");
var configUrl = "res\\config.json";
var pathConfig;
var byteArray;
function startRead() {
    var outBinPath = pathConfig.outBinPath, srcXlsxPath = pathConfig.srcXlsxPath, outFileName = pathConfig.outFileName;
    var outFileFullUrl = outBinPath + outFileName;
    fs.ensureDir(outBinPath);
    byteArray = new ByteArray_1.ByteArray();
    var fileStat = fs.statSync(srcXlsxPath);
    if (fileStat.isDirectory()) {
        //是目录
        fs.readdir(srcXlsxPath, function (err, files) {
            files = files.filter(function (value) {
                return /^[^~]*(\.xlsx$)/.test(value);
            });
            console.log("files");
            var count = files.length;
            byteArray.writeFloat(count);
            files.forEach(function (name, index) {
                var newPath = srcXlsxPath + name;
                var stat = fs.statSync(newPath);
                if (stat.isFile()) {
                    // readSingle(newPath);
                }
                console.log("(%s/%s)  开始处理：%s", index + 1, count, name);
            });
            Zlib.gzip(byteArray.bytes, function (err, result) {
                if (!err) {
                    fs.writeFile(outFileFullUrl, result, function (e) {
                        console.log("生成成功");
                        // fs.copy(outBinUrl, "lib\\config.bin", (err) => {
                        //     console.log("拷贝成功")
                        //     // fs.opendir()
                        // })
                    });
                }
            });
            // fs.writeFile(outBinUrl, byteArray.bytes, (err) => {
            //     console.log("生成成功")
            // })
            // console.log("处理结束");
        });
    }
    else {
        // readSingle(srcXlsxPath);
    }
}
var A = /** @class */ (function () {
    function A() {
    }
    return A;
}());
A.prototype.a = function (params) {
    console.log("fsfsfsfs" + params);
};
new A().a("fsfsfs");
