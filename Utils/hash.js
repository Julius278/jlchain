const SHA256 = require('crypto-js/sha256');

class Hash {
    /*static hash(timestamp, lastHash, data, nonce, difficulty){
        return SHA256(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
    }*/

    static hash(data){
        return SHA256(JSON.stringify(data)).toString();
    }
}
module.exports = Hash;