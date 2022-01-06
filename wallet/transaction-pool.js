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
        return this.transactions;
    }

    existingTransaction(address){
        return this.transactions.find(t => t.input.address === address);
    }

    validTransactions(){
        //let tp = [];
        return this.transactions.filter(t => {
            const outputTotal = t.outputs.reduce((total, output) => {
                if(isNaN(output.amount)){
                    return;
                }
                return total + output.amount;
            }, 0);

            if (t.input.amount !== outputTotal){
                console.log(`invalid transaction from: ${t.input.address}`);
                return;
            }
            if(!Transaction.verifyTransaction(t)){
                console.log(`invalid signature from: ${t.input.address}`);
                return;
            }
            return t;
        });
    }

    clear(){
        this.transactions = [];
    }
}
module.exports = TransactionPool;