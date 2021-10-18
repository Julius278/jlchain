const Hash = require("../Utils/hash");
const Blockdate = require("../Utils/blockdate");

class Block {
    constructor(timestamp, lastHash, hash, data) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }

    toString() {
        return `Block - 
        Timestamp:  ${this.timestamp}
        Last Hash:  ${this.lastHash.substring(0, 25)}
        Hash:       ${this.hash.substring(0, 25)}
        Data:       ${this.data}`;
    }

    static genesis() {
        let date = 1634325563013;
        let data = "Julius";
        let lastHash = "DummyLastHash";
        let hash = Hash.hash(date, lastHash, data);
        return new this(date, lastHash, hash, data);
    }

    static mineBlock(lastBlock, data) {
        let date = Blockdate.getDate();
        let hash = Hash.hash(date, lastBlock.hash, data);
        return new this(date, lastBlock.hash, hash, data);
    }

    static blockHash(block) {
        const { timestamp, lastHash, data } = block;
        return Hash.hash(timestamp, lastHash, data);
    }
}
module.exports = Block;