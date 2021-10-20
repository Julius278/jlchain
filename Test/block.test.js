const Block = require("../core/block");
const { DIFFICULTY } = require("../config");

describe('Block', () => {

    let data, lastBlock, block;

    beforeEach(() => {
        data = 'bar';
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock, data);
    });
    it('sets the `data` to match the input', () => {
        expect(block.data).toEqual(data);
    });

    it('sets the `lastHash` to match the hash of the last block', () => {
        expect(block.lastHash).toEqual(lastBlock.hash);
    });

    it('sets the `hash` to match the hash of the Genesis block', () => {
        expect(Block.genesis().hash).toEqual(Block.blockHash(Block.genesis()));
    });

    it('generates a hash that matches the difficulty', () => {
        expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));
    });

    it('adjusts the difficulty of a slow mined block', () => {
        expect(Block.adjustDifficulty(block, block.timestamp + 360000)).toEqual(block.difficulty - 1);
    });

    it('adjusts the difficulty of a fast mined block', () => {
        expect(Block.adjustDifficulty(block, block.timestamp + 1)).toEqual(block.difficulty + 1);
    });
});