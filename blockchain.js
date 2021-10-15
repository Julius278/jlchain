const Block = require("./block");

class BlockChain{
    constructor(){
        this.chain = [Block.genesis()];
    }

    addBlock(data){
        this.chain.push(Block.mineBlock(this.chain[this.chain.length-1], data));
    }

    isValidChain(chain){
        //check if Genesis Block is equal
        if(JSON.stringify(chain[0]) !== this.chain[0]){
            return false;
        }

        //check if every hash in the chain in valid
        for (let i =1; i<chain.length; i++){
            const block = chain[i];
            const lastBlock = chain[i-1];
            
            if (block.lastHash !== lastBlock.hash ||
                block.hash !== Block.blockHash(block)){
                return false
            }
        }
        //if passed these tests
        return true
    }
}

module.exports = BlockChain;