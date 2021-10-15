const BlockChain = require("../blockchain");

describe('BlockChain', () => {

    let blockchain, secBlockchain, thirdBlockchain, fourthBlockchain;
    let data = "dummy input Data";

    beforeEach(() => {
        blockchain = new BlockChain();
        blockchain.addBlock(data);
        blockchain.addBlock("second input");
        blockchain.addBlock("third input");

        secBlockchain = new BlockChain();
        secBlockchain.addBlock(data);
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

    it('validates a valid chain', () => {
        expect(blockchain.isValidChain(secBlockchain.chain)).toBe(true);
    });

    it('invalidates the second element of the different chaines', () => {
        setTimeout(() => {
            expect(blockchain.chain[1].hash).not.toEqual(secBlockchain.chain[1].hash);
        },1000);
    });

    it('invalidates a chain with a corrupt genesis block', () => {
        thirdBlockchain = new BlockChain();
        thirdBlockchain.addBlock(data);

        thirdBlockchain.chain[0].data = 'Bad Data';
        expect(thirdBlockchain.isValidChain(thirdBlockchain.chain)).toBe(false);
    });

    it('invalidates a chain with a corrupt block', () => {
        fourthBlockchain = new BlockChain();
        fourthBlockchain.addBlock(data);
        fourthBlockchain.chain[1].data = 'Bad Data';
        expect(fourthBlockchain.isValidChain(fourthBlockchain.chain)).toBe(false);
    });
    
});