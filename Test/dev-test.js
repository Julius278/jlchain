const Block = require("../block");

const block = Block.mineBlock(Block.genesis(), 'second Block data');
console.log(block.toString());

const block2 = Block.mineBlock(block, 'third Block data');
console.log(block2.toString());