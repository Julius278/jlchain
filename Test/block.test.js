const Block = require("../block");

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
        const expHash = 'ddf6325cad1b7feef38a25a79fba13383d63b0d3d48988729ec57a2aecac2676';
        expect(expHash).toEqual(Block.genesis().hash);
        expect(expHash).toEqual(Block.blockHash(Block.genesis()));
    });
});