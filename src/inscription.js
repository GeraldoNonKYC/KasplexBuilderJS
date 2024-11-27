"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inscription = void 0;
const encoder = new TextEncoder();
class Inscription {
    constructor(operation, params) {
        this.data = Object.assign({ 'p': 'krc-20', 'op': operation }, params);
    }
    write(builder, publicKey) {
        builder.drain();
        builder
            .addData(publicKey)
            .addOp(172) // OpCheckSig
            .addOp(0) // OpFalse
            .addOp(99) // OpIf
            .addData(encoder.encode("kasplex"))
            .addI64(BigInt(0))
            .addData(encoder.encode(this.toString()))
            .addOp(104); // OpEndIf
    }
    toString() {
        return JSON.stringify(this.data, null, 0);
    }
}
exports.Inscription = Inscription;
