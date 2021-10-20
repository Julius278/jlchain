const SHA256 = require('crypto-js/sha256');

class Hash {
    static hash(timestamp, lastHash, data, nonce, difficulty){
        return SHA256(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
    }
}
module.exports = Hash;