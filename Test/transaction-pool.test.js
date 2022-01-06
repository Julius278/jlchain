const TransactionPool = require("../wallet/transaction-pool");
const Transaction = require("../wallet/transaction");
const Wallet = require("../wallet/wallet");

describe('Transaction Pool', () => {

    let trPool, tr, tr2, wallet, recipient, amount;

    beforeEach(() => {
        wallet = new Wallet();
        recipient = new Wallet().publicKey;
        amount = 200;
        trPool = new TransactionPool();
        //tr = Transaction.newTransaction(wallet, recipient, amount);
        //trPool.updateOrAddTransaction(tr);
        tr = wallet.createTransaction(recipient,amount,trPool);
    });

    it('updates existing transaction', () => {
        let amount2 = 50;
        const oldTr = JSON.stringify(tr);
        tr.update(wallet, recipient, amount2);
        trPool.updateOrAddTransaction(tr);
        expect(trPool.transactions.find(t => t.id === tr.id).outputs.find(o => o.address === wallet.publicKey).amount)
            .toEqual(wallet.balance - amount - amount2);
        expect(trPool.transactions.length).toEqual(1);
        expect(oldTr).not.toEqual(trPool.transactions.find(t => t.id === tr.id));
    });

    it('adds a new transaction to the pool', () => {
        amount2 = 20;
        tr2 = Transaction.newTransaction(wallet, recipient, amount2);
        trPool.updateOrAddTransaction(tr2);
        expect(trPool.transactions.length).toEqual(2);
        expect(JSON.stringify(trPool.transactions.find(t => t.id === tr.id))).toEqual(JSON.stringify(tr));
        expect(JSON.stringify(trPool.transactions.find(t  => t.id === tr2.id))).toEqual(JSON.stringify(tr2));
    });

    it('clears the transaction pool', () =>{
        trPool.clear();
        expect(trPool.transactions).toEqual([]);
    });

    describe('mixing valid and corrupt transactions', () => {
        let validTransactions;
        beforeEach(() => {
            validTransactions = [...trPool.transactions];
            for (let i=0; i<6; i++){
                wallet = new Wallet();
                tr = wallet.createTransaction(recipient, 30, trPool);
                if(i%2===0){
                    tr.input.amount=9999;
                } else {
                    validTransactions.push(tr);
                }
            }
        });

        it('shows a difference between valid and corrupt transactions', () => {
            expect(JSON.stringify(trPool.transactions)).not.toEqual(JSON.stringify(validTransactions));
        });

        it('grabs valid transactions', () => {
            expect(JSON.stringify(trPool.validTransactions())).toEqual(JSON.stringify(validTransactions));
        })
    });
});