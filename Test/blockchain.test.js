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

    /*
    it('invalidates the second element of the different chaines', () => {
        setTimeout(() => {
            expect(blockchain.chain[1].hash).not.toEqual(secBlockchain.chain[1].hash);
        },1000);
    });*/

    it('invalidates a chain with a corrupt genesis block', () => {
        secBlockchain.chain[0].data = 'Bad Data';
        expect(secBlockchain.isValidChain(secBlockchain.chain)).toBe(false);
    });

    it('invalidates a chain with a corrupt block', () => {
        secBlockchain.chain[1].data = 'Bad Data';
        expect(secBlockchain.isValidChain(secBlockchain.chain)).toBe(false);
    });

    it('it replaces the chain with a valid chain', () => {
        secBlockchain.replaceChain(blockchain.chain);
        expect(secBlockchain.chain).toEqual(blockchain.chain);
    });
    
    it('does not replace a chain with one less than or equal to length', () => {
        blockchain.replaceChain(secBlockchain.chain);
        expect(blockchain.chain).not.toEqual(secBlockchain.chain);
    });
});