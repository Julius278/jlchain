const { INITIAL_BALANCE } = require("../config");
const ChainUtil = require("../Utils/chain-util");
const Transaction = require("./transaction");

class Wallet {
    constructor() {
        this.balance = INITIAL_BALANCE;
        this.keyPair = ChainUtil.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    toString(){
        return `Wallet -
        publicKey:  ${this.publicKey.toString()}
        balance:    ${this.balance}`;
    }

    sign(dataHash){
        return this.keyPair.sign(dataHash);
    }

    createTransaction(recipient, amount, transactionPool){
        if(amount > this.balance){
            console.log(`Amount ${amount} exceeds the balanace, only ${this.balance} available`);
            return;
        }

        let tr = transactionPool.existingTransaction(this.publicKey);
        if (tr){
            tr.update(this, recipient, amount);
        } else {
            tr = Transaction.newTransaction(this, recipient, amount);
            transactionPool.updateOrAddTransaction(tr);
        }
        return tr;
    }

    static blockChainWallet(){
        const blockChainWallet = new this();
        blockChainWallet.address = 'blockchain-wallet';
        return blockChainWallet;
    }
}
module.exports = Wallet;