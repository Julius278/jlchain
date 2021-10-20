const Block = require("./block");

class BlockChain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock(data) {
        const block = Block.mineBlock(this.chain[this.chain.length - 1], data);
        this.chain.push(block);
        return block;
    }

    isValidChain(chain) {
        //check if Genesis Block is equal and if genesis hash is correct/identical
        if (JSON.stringify(chain[0]) !== JSON.stringify(this.chain[0])) {
            return false
        }

        //check if genesis block was manipulated (wrong hash value)
        if (chain[0].hash !== Block.blockHash(chain[0])) {
            return false;
        }

        //check if every hash in the chain in valid
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const lastBlock = chain[i - 1];

            if (block.lastHash !== lastBlock.hash ||
                block.hash !== Block.blockHash(block)) {
                return false
            }
        }
        //if passed these tests
        return true;
    }

    replaceChain(newChain) {
        if (newChain.length <= this.chain.length) {
            //console.log('received chain is not longer than the current chain.')
            return;
        } else if (!this.isValidChain(newChain)) {
            console.log('received chain is not valid');
            return;
        }

        //TODO: check if the chains are equal, so nobody can overwrite the existing/correct blockchain
        console.log('replacing blockchain with new chain');
        this.chain = newChain;
    }
}

module.exports = BlockChain;