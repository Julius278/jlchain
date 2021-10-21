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
        tr = Transaction.newTransaction(wallet, recipient, amount);
        trPool.updateOrAddTransaction(tr);
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
});