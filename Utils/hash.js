const SHA256 = require('crypto-js/sha256');

class Hash {
    static hash(timestamp, lastHash, data){
        return SHA256(`${timestamp}${lastHash}${data}`).toString();
    }
}
module.exports = Hash;