const { INITIAL_BALANCE } = require("../config");
const ChainUtil = require("../Utils/chain-util");
const Transaction = require("./transaction");

class Wallet {
    constructor() {
        this.balance = INITIAL_BALANCE;
        this.keyPair = ChainUtil.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    toString() {
        return `Wallet -
        publicKey:  ${this.publicKey.toString()}
        balance:    ${this.balance}`;
    }

    sign(dataHash) {
        return this.keyPair.sign(dataHash);
    }

    createTransaction(recipient, amount, blockchain, transactionPool) {
        this.balance = this.calculateBalance(blockchain);

        if (amount > this.balance) {
            console.log(`Amount ${amount} exceeds the balanace, only ${this.balance} available`);
            return;
        }

        let tr = transactionPool.existingTransaction(this.publicKey);
        if (tr) {
            tr.update(this, recipient, amount);
        } else {
            tr = Transaction.newTransaction(this, recipient, amount);
            transactionPool.updateOrAddTransaction(tr);
        }
        return tr;
    }

    calculateBalance(blockchain) {
        let balance = this.balance;
        let transactions = [];

        blockchain.chain.forEach(b => {
            b.data.forEach(t => {
                transactions.push(t);
            });
        });

        let startTime = 0;
        const walletInputTs = transactions.filter(t => t.input.address === this.publicKey);
        if (walletInputTs.length > 0) {
            const recentInputT = walletInputTs.reduce((prev, current) => 
                prev.input.timestamp > current.input.timestamp ? prev : current
            );
            balance = recentInputT.outputs.find(o => o.address === this.publicKey).amount;
            startTime = recentInputT.input.timestamp;
        }

        transactions.forEach(t => {
            if (t.input.timestamp > startTime) {
                t.outputs.forEach(o => {
                    if (o.address === this.publicKey) {
                        balance += o.amount;
                    }
                });
            }
        });

        return balance;
    }

    static blockChainWallet() {
        const blockChainWallet = new this();
        blockChainWallet.address = 'blockchain-wallet';
        return blockChainWallet;
    }
}
module.exports = Wallet;