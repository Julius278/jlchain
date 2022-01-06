const ChainUtil = require("../Utils/chain-util");
const BlockDate = require("../Utils/blockdate");
const Hash = require("../Utils/hash");
const { MINING_REWARD } = require("../config");

class Transaction {
    constructor() {
        this.id = ChainUtil.id();
        this.input = null;
        this.outputs = [];
    }

    update(senderWallet, recipient, amount) {
        const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);
        if (amount > senderOutput.amount) {
            console.log(`Amount: ${amount} exceeds balance; update`);
            return;
        }

        senderOutput.amount = senderOutput.amount - amount;
        this.outputs.push({ amount, address: recipient });
        Transaction.signTransaction(this, senderWallet);
        return this;
    }

    static newTransaction(senderWallet, recipient, amount) {
        if (amount > senderWallet.balance) {
            console.log(`Amount: ${amount} exceeds balance; add`);
            return;
        }
        return Transaction.transactionWithOutputs(senderWallet, [
            { amount: senderWallet.balance - amount, address: senderWallet.publicKey },
            { amount, address: recipient }
        ]);
    }

    static rewardTransaction(minerWallet, blockChainWallet) {
        return Transaction.transactionWithOutputs(blockChainWallet, [
            { amount: MINING_REWARD, address: minerWallet.publicKey }
        ]);
    }

    static transactionWithOutputs(senderWallet, outputs) {
        const tr = new this();
        tr.outputs.push(...outputs);
        Transaction.signTransaction(tr, senderWallet);
        return tr;
    }


    static signTransaction(transaction, senderWallet) {
        transaction.input = {
            timestamp: BlockDate.getDate(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(Hash.hash(transaction.outputs))
        };
        //return transaction;
    }

    static verifyTransaction(transaction) {
        const { address, signature } = transaction.input;
        return ChainUtil.verifySignature(address, signature, Hash.hash(transaction.outputs));
    }
}

module.exports = Transaction;