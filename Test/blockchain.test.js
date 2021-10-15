const BlockChain = require("../blockchain");

describe('BlockChain', () => {

    let blockchain;
    let data = "dummy input Data";

    beforeEach(() => {
       blockchain = new BlockChain();
       blockchain.addBlock(data);
       console.log(blockchain.chain[0].data);
    });
    it('sets the `data` to match the input', () => {
        expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(data);
    });

    it('sets the `lastHash` of the new Block to match the hash of the genesis block', () => {
        expect(blockchain.chain[blockchain.chain.length-1].lastHash).toEqual(blockchain.chain[0].hash);
    });
});