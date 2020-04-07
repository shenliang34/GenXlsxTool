"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ByteArray_1 = require("./ByteArray");
var Amf3Types;
(function (Amf3Types) {
    Amf3Types[Amf3Types["kUndefinedType"] = 0] = "kUndefinedType";
    Amf3Types[Amf3Types["kNullType"] = 1] = "kNullType";
    Amf3Types[Amf3Types["kFalseType"] = 2] = "kFalseType";
    Amf3Types[Amf3Types["kTrueType"] = 3] = "kTrueType";
    Amf3Types[Amf3Types["kIntegerType"] = 4] = "kIntegerType";
    Amf3Types[Amf3Types["kDoubleType"] = 5] = "kDoubleType";
    Amf3Types[Amf3Types["kStringType"] = 6] = "kStringType";
    Amf3Types[Amf3Types["kXMLType"] = 7] = "kXMLType";
    Amf3Types[Amf3Types["kDateType"] = 8] = "kDateType";
    Amf3Types[Amf3Types["kArrayType"] = 9] = "kArrayType";
    Amf3Types[Amf3Types["kObjectType"] = 10] = "kObjectType";
    Amf3Types[Amf3Types["kAvmPlusXmlType"] = 11] = "kAvmPlusXmlType";
    Amf3Types[Amf3Types["kByteArrayType"] = 12] = "kByteArrayType";
})(Amf3Types || (Amf3Types = {}));
/**
 * 可读取 AMF3 格式的字节流
 */
var AMF3ByteArray = /** @class */ (function (_super) {
    __extends(AMF3ByteArray, _super);
    function AMF3ByteArray(buffer, bufferExtSize) {
        var _this = _super.call(this, buffer, bufferExtSize) || this;
        _this.objectTable = [];
        _this.stringTable = [];
        _this.traitTable = [];
        return _this;
    }
    AMF3ByteArray.prototype.readObject = function () {
        var obj = this.readAMF3Object();
        this.clean();
        return obj;
    };
    AMF3ByteArray.prototype.readAMF3Object = function () {
        var marker = this.readByte();
        if (marker == Amf3Types.kUndefinedType) {
            return undefined;
        }
        else if (marker == Amf3Types.kNullType) {
            return null;
        }
        else if (marker == Amf3Types.kFalseType) {
            return false;
        }
        else if (marker == Amf3Types.kTrueType) {
            return true;
        }
        else if (marker == Amf3Types.kIntegerType) {
            var i = this.readUInt29();
            return i;
        }
        else if (marker == Amf3Types.kDoubleType) {
            var s = this.readDouble();
            return s;
        }
        else if (marker == Amf3Types.kStringType) {
            var sss = this.readStringAMF3();
            return sss;
        }
        else if (marker == Amf3Types.kXMLType) {
            // let xml = this.readXML();
            // return xml;
        }
        else if (marker == Amf3Types.kDateType) {
            var ref = this.readUInt29();
            if ((ref & 1) == 0) {
                return this.objectTable[(ref >> 1)];
            }
            var d = this.readDouble();
            var value = new Date(d);
            this.objectTable.push(value);
            return value;
        }
        else if (marker == Amf3Types.kArrayType) {
            var ref = this.readUInt29();
            if ((ref & 1) == 0) {
                return this.objectTable[(ref >> 1)];
            }
            var len = (ref >> 1);
            var key = this.readStringAMF3();
            if (key == "") {
                var a = [];
                for (var i = 0; i < len; i++) {
                    var value = this.readAMF3Object();
                    a.push(value);
                }
                return a;
            }
            var result = {};
            while (key != "") {
                result[key] = this.readAMF3Object();
                key = this.readStringAMF3();
            }
            for (var i = 0; i < len; i++) {
                result[i] = this.readAMF3Object();
            }
            return result;
        }
        else if (marker == Amf3Types.kObjectType) {
            var o = {};
            this.objectTable.push(o);
            var ref = this.readUInt29();
            if ((ref & 1) == 0) {
                return this.objectTable[(ref >> 1)];
            }
            var ti = this.readTraits(ref);
            var className = ti["className"];
            var externalizable = ti["externalizable"];
            if (externalizable) {
                o = this.readAMF3Object();
            }
            else {
                var len = ti["properties"].length;
                for (var i = 0; i < len; i++) {
                    var propName = ti["properties"][i];
                    var value1 = this.readAMF3Object();
                    o[propName] = value1;
                }
                if (ti["dynamic"]) {
                    for (;;) {
                        var name_1 = this.readStringAMF3();
                        if (!name_1 || name_1.length == 0) {
                            break;
                        }
                        var value2 = this.readAMF3Object();
                        o[name_1] = value2;
                    }
                }
            }
            return o;
        }
        else if (marker == Amf3Types.kAvmPlusXmlType) {
            // let ref = this.readUInt29();
            // if ((ref & 1) == 0) {
            //     return egret.XML.parse(this.objectTable[(ref >> 1)]);
            // }
            // let len = (ref >> 1);
            // if (0 == len) {
            //     return undefined;
            // }
            // let str = this.readString(len);
            // let xml = egret.XML.parse(str);
            // this.objectTable.push(xml);
            // return xml;
        }
        else if (marker == Amf3Types.kByteArrayType) {
            var ref = this.readUInt29();
            if ((ref & 1) == 0) {
                return this.objectTable[(ref >> 1)];
            }
            var len = (ref >> 1);
            var ba = new ByteArray_1.ByteArray();
            this.objectTable.push(ba);
            for (var i = 0; i < len; i++) {
                ba.writeByte(this.readByte());
            }
            return ba;
        }
    };
    AMF3ByteArray.prototype.clean = function () {
        this.objectTable.length = 0;
        this.stringTable.length = 0;
        this.traitTable.length = 0;
    };
    AMF3ByteArray.prototype.readUInt29 = function () {
        var value;
        var b = this.readByte() & 0xFF;
        if (b < 128) {
            return b;
        }
        value = (b & 0x7F) << 7;
        b = this.readByte() & 0xFF;
        if (b < 128) {
            return (value | b);
        }
        value = (value | (b & 0x7F)) << 7;
        b = this.readByte() & 0xFF;
        if (b < 128) {
            return (value | b);
        }
        value = (value | (b & 0x7F)) << 8;
        b = this.readByte() & 0xFF;
        return (value | b);
    };
    AMF3ByteArray.prototype.readStringAMF3 = function () {
        var ref = this.readUInt29();
        if ((ref & 1) == 0) {
            return this.stringTable[(ref >> 1)];
        }
        var len = (ref >> 1);
        if (0 == len) {
            return "";
        }
        var str = this.readString(len);
        this.stringTable.push(str);
        return str;
    };
    AMF3ByteArray.prototype.readString = function (len) {
        var str = this.readUTFBytes(len);
        return str;
    };
    AMF3ByteArray.prototype.readTraits = function (ref) {
        var traitInfo = {};
        traitInfo["properties"] = [];
        if ((ref & 3) == 1) {
            return this.traitTable[(ref >> 2)];
        }
        traitInfo["externalizable"] = ((ref & 4) == 4);
        traitInfo["dynamic"] = ((ref & 8) == 8);
        var a = 0;
        traitInfo["count"] = (ref >> 4);
        traitInfo["className"] = this.readStringAMF3();
        this.traitTable.push(traitInfo);
        for (var i = 0; i < traitInfo["count"]; i++) {
            var propName = this.readStringAMF3();
            traitInfo["properties"].push(propName);
        }
        return traitInfo;
    };
    // private readXML(): egret.XML {
    //     let xmlStr = this.readLongUTF();
    //     let xml = egret.XML.parse(xmlStr);
    //     return xml;
    // }
    AMF3ByteArray.prototype.readLongUTF = function () {
        return this.readString(this.readUInt30());
    };
    AMF3ByteArray.prototype.readUInt30 = function () {
        var ch1 = this.readByte();
        var ch2 = this.readByte();
        var ch3 = this.readByte();
        var ch4 = this.readByte();
        if (ch1 >= 64) {
            return undefined;
        }
        return ch4 | (ch3 << 8) | (ch2 << 16) | (ch1 << 24);
    };
    return AMF3ByteArray;
}(ByteArray_1.ByteArray));
