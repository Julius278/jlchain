const Hash = require("../Utils/hash");
const Blockdate = require("../Utils/blockdate");

const { DIFFICULTY, MINE_RATE } = require("../config");

class Block {
    constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY;
    }

    toString() {
        return `Block - 
        Timestamp:  ${this.timestamp}
        Last Hash:  ${this.lastHash.substring(0, 25)}
        Hash:       ${this.hash.substring(0, 25)}
        Nonce:      ${this.nonce}
        Difficulty: ${this.difficulty}
        Data:       ${this.data}`;
    }

    static genesis() {
        let date = 1634325563013;
        let data = "Julius";
        let lastHash = "DummyLastHash";
        let hash = Hash.hash(date, lastHash, data, 0, DIFFICULTY);
        return new this(date, lastHash, hash, data, 0, DIFFICULTY);
    }

    static mineBlock(lastBlock, data) {
        let hash, timestamp;
        let { difficulty } = lastBlock;
        let nonce = 0;
        do {
            nonce++;
            timestamp = Blockdate.getDate();
            difficulty = Block.adjustDifficulty(lastBlock, timestamp);
            hash = Hash.hash(timestamp, lastBlock.hash, data, nonce, difficulty);
        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

        return new this(timestamp, lastBlock.hash, hash, data, nonce, difficulty);
    }

    static adjustDifficulty(lastBlock, currentTime) {
        const { timestamp, difficulty } = lastBlock;
        if ((currentTime - timestamp) < MINE_RATE) {
            return difficulty + 1;
        } else {
            return difficulty - 1;
        }
    }

    static blockHash(block) {
        const { timestamp, lastHash, data, nonce, difficulty } = block;
        return Hash.hash(timestamp, lastHash, data, nonce, difficulty);
    }
}
module.exports = Block;