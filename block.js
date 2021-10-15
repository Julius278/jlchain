const Hash = require("./Utils/hash");
class Block {
    constructor(timestamp, lastHash, hash, data) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }

    toString(){
        return `Block - 
        Timestamp:  ${this.timestamp}
        Last Hash:  ${this.lastHash.substring(0,25)}
        Hash:       ${this.hash.substring(0,25)}
        Data:       ${this.data}`;
    }

    static genesis() {
        let date = new Date();
        let data = "Julius";
        let lastHash = "DummyLastHash";
        let hash = Hash.hash(date, lastHash, data);
        return new this(date, lastHash, hash, data);
    }

    static mineBlock(lastBlock, data){
        let hash = Hash.hash(lastBlock.timestamp, lastBlock.hash, data);
        return new this(new Date(), lastBlock.hash, hash, data);
    }
}
module.exports = Block;