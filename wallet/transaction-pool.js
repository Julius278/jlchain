const Transaction = require("./transaction");

class TransactionPool {
    constructor() {
        this.transactions = [];
    }

    updateOrAddTransaction(transaction) {
        if (!Transaction.verifyTransaction(transaction)) {
            console.log("transaction is invalid");
            return null;
        }

        let transactionWithID = this.transactions.find(tr => tr.id === transaction.id);
        //console.log(transactionWithID);
        if (transactionWithID === undefined) {
            this.transactions.push(transaction);
        } else {
            this.transactions[this.transactions.indexOf(transactionWithID)] = transaction;
        } 
        return this.transactions
    }
}
module.exports = TransactionPool;