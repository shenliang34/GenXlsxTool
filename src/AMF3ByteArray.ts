import { ByteArray } from "./ByteArray";

enum Amf3Types {
    kUndefinedType,
    kNullType,
    kFalseType,
    kTrueType,
    kIntegerType,
    kDoubleType,
    kStringType,
    kXMLType,
    kDateType,
    kArrayType,
    kObjectType,
    kAvmPlusXmlType,
    kByteArrayType
}

/**
 * 可读取 AMF3 格式的字节流
 */
class AMF3ByteArray extends ByteArray {
    private objectTable: any[] = [];
    private stringTable: string[] = [];
    private traitTable: any[] = [];

    public constructor(buffer?: ArrayBuffer | Uint8Array, bufferExtSize?: number) {
        super(buffer, bufferExtSize);
    }

    public readObject(): any {
        let obj = this.readAMF3Object();
        this.clean();
        return obj;
    }

    private readAMF3Object(): any {
        let marker = this.readByte();
        if (marker == Amf3Types.kUndefinedType) {
            return undefined;
        } else if (marker == Amf3Types.kNullType) {
            return null;
        } else if (marker == Amf3Types.kFalseType) {
            return false;
        } else if (marker == Amf3Types.kTrueType) {
            return true;
        } else if (marker == Amf3Types.kIntegerType) {
            let i = this.readUInt29();
            return i;
        } else if (marker == Amf3Types.kDoubleType) {
            let s = this.readDouble();
            return s;
        } else if (marker == Amf3Types.kStringType) {
            let sss = this.readStringAMF3();
            return sss;
        } else if (marker == Amf3Types.kXMLType) {
            // let xml = this.readXML();
            // return xml;
        } else if (marker == Amf3Types.kDateType) {
            let ref = this.readUInt29();
            if ((ref & 1) == 0) {
                return this.objectTable[(ref >> 1)];
            }
            let d = this.readDouble();
            let value = new Date(d);
            this.objectTable.push(value);
            return value;
        } else if (marker == Amf3Types.kArrayType) {
            let ref = this.readUInt29();
            if ((ref & 1) == 0) {
                return this.objectTable[(ref >> 1)];
            }
            let len = (ref >> 1);
            let key = this.readStringAMF3();
            if (key == "") {
                let a = [];
                for (let i = 0; i < len; i++) {
                    let value = this.readAMF3Object();
                    a.push(value);
                }
                return a;
            }
            let result = {};
            while (key != "") {
                result[key] = this.readAMF3Object();
                key = this.readStringAMF3();
            }
            for (let i = 0; i < len; i++) {
                result[i] = this.readAMF3Object();
            }
            return result;
        } else if (marker == Amf3Types.kObjectType) {
            let o = {};
            this.objectTable.push(o);
            let ref = this.readUInt29();
            if ((ref & 1) == 0) {
                return this.objectTable[(ref >> 1)];
            }
            let ti = this.readTraits(ref);
            let className = ti["className"];
            let externalizable = ti["externalizable"];
            if (externalizable) {
                o = this.readAMF3Object();
            } else {
                let len = ti["properties"].length;
                for (let i = 0; i < len; i++) {
                    let propName = ti["properties"][i];
                    let value1 = this.readAMF3Object();
                    o[propName] = value1;
                }
                if (ti["dynamic"]) {
                    for (; ;) {
                        let name = this.readStringAMF3();
                        if (!name || name.length == 0) {
                            break;
                        }
                        let value2 = this.readAMF3Object();
                        o[name] = value2;
                    }
                }
            }
            return o;
        } else if (marker == Amf3Types.kAvmPlusXmlType) {
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
        } else if (marker == Amf3Types.kByteArrayType) {
            let ref = this.readUInt29();
            if ((ref & 1) == 0) {
                return this.objectTable[(ref >> 1)];
            }
            let len = (ref >> 1);
            let ba = new ByteArray();
            this.objectTable.push(ba);
            for (let i = 0; i < len; i++) {
                ba.writeByte(this.readByte());
            }
            return ba;
        }
    }

    private clean(): void {
        this.objectTable.length = 0;
        this.stringTable.length = 0;
        this.traitTable.length = 0;
    }

    private readUInt29(): number {
        let value: number;
        let b = this.readByte() & 0xFF;
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
    }

    private readStringAMF3(): string {
        let ref = this.readUInt29();
        if ((ref & 1) == 0) {
            return this.stringTable[(ref >> 1)];
        }
        let len = (ref >> 1);
        if (0 == len) {
            return "";
        }
        let str = this.readString(len);
        this.stringTable.push(str);
        return str;
    }

    private readString(len: number): string {
        let str = this.readUTFBytes(len);
        return str;
    }

    private readTraits(ref: number): any {
        let traitInfo = {};
        traitInfo["properties"] = [];
        if ((ref & 3) == 1) {
            return this.traitTable[(ref >> 2)];
        }
        traitInfo["externalizable"] = ((ref & 4) == 4);
        traitInfo["dynamic"] = ((ref & 8) == 8);
        let a = 0;
        traitInfo["count"] = (ref >> 4);
        traitInfo["className"] = this.readStringAMF3();
        this.traitTable.push(traitInfo);
        for (let i = 0; i < traitInfo["count"]; i++) {
            let propName = this.readStringAMF3();
            traitInfo["properties"].push(propName);
        }
        return traitInfo;
    }

    // private readXML(): egret.XML {
    //     let xmlStr = this.readLongUTF();
    //     let xml = egret.XML.parse(xmlStr);
    //     return xml;
    // }

    private readLongUTF(): string {
        return this.readString(this.readUInt30());
    }

    private readUInt30(): number {
        let ch1 = this.readByte();
        let ch2 = this.readByte();
        let ch3 = this.readByte();
        let ch4 = this.readByte();
        if (ch1 >= 64) {
            return undefined;
        }
        return ch4 | (ch3 << 8) | (ch2 << 16) | (ch1 << 24);
    }
}

