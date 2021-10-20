const EC = require("elliptic").ec;
const ec = new EC('secp256k1');
const uuid = require("uuid");

class ChainUtil {

    static genKeyPair() {
        return ec.genKeyPair();
    }

    static id() {
        return uuid.v1();
    }

    static verifySignature(publicKey, signature, dataHash) {
        return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
    }
}

module.exports = ChainUtil;