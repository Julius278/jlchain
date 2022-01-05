const ChainUtil = require("../Utils/chain-util");
const BlockDate = require("../Utils/blockdate");
const Hash = require("../Utils/hash");

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
        const tr = new this();

        if (amount > senderWallet.balance) {
            console.log(`Amount: ${amount} exceeds balance; add`);
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