const Transaction = require("../wallet/transaction");
const Wallet = require("../wallet/wallet");

class Miner {
    constructor(blockchain, transactionPool, wallet, p2pServer){
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.p2pServer = p2pServer;
    }

    mine(){
        const validTransactions = this.transactionPool.validTransactions();
        // include a reward for the miner
        validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockChainWallet()))
        // create a block consisting of the valid transactions
        const b = this.blockchain.addBlock(validTransactions);
        // sync chains in the p2p server
        this.p2pServer.syncChains();
        // clear trPool local 
        this.transactionPool.clear();
        // broadcast clear trPool command to the whole system / all miners
        this.p2pServer.broadcastClearTransactions();

        return b;
    }
}

module.exports = Miner;