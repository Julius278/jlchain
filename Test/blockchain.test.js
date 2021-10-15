const BlockChain = require("../blockchain");

describe('BlockChain', () => {

    let blockchain;
    let data = "dummy input Data";

    beforeEach(() => {
        blockchain = new BlockChain();
        blockchain.addBlock(data);
        blockchain.addBlock("second input");
        blockchain.addBlock("third input");
    });
    it('sets the `data` to match the input', () => {
        expect(blockchain.chain[1].data).toEqual(data);
    });

    it('sets the `lastHash` of the new Block to match the hash of the genesis block', () => {
        expect(blockchain.chain[1].lastHash).toEqual(blockchain.chain[0].hash);
    });

    it('sets the `timestamp` of the newest Block is bigger than the genesis one', () => {
        expect(blockchain.chain[blockchain.chain.length - 1].timestamp).toBeGreaterThan(blockchain.chain[0].timestamp);
    });

    it('sets the `timestamp` of the newest Block is bigger than the genesis one', () => {
        secBlockchain = new BlockChain();
        secBlockchain.addBlock(data);
        expect(blockchain.chain[1].hash).not.toEqual(secBlockchain.chain[1].hash);
    });

});