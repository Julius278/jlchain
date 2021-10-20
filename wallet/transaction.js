const ChainUtil = require("../Utils/chain-util");
const BlockDate = require("../Utils/blockdate");
const Hash = require("../Utils/hash");

class Transaction {
    constructor() {
        this.id = ChainUtil.id();
        this.input = null;
        this.outputs = [];
    }

    static newTransaction(senderWallet, recipient, amount) {
        const tr = new this();

        if (amount > senderWallet.balance) {
            console.log(`Amount: ${amount} exceeds balance`);
            return;
        }
        tr.outputs.push(...[
            { amount: senderWallet.balance - amount, address: senderWallet.publicKey },
            { amount, address: recipient }
        ]);

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