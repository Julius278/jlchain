const Block = require("./block");
const Hash = require("./Utils/hash");
class BlockChain{
    constructor(){
        this.chain = [Block.genesis()];
    }

    addBlock(data){
        this.chain.push(Block.mineBlock(this.chain[this.chain.length-1], data));
    }
}

module.exports = BlockChain;