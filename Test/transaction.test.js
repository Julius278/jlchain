const { MINING_REWARD } = require("../config");
const BlockChain = require("../core/blockchain");
const Transaction = require("../wallet/transaction");
const Wallet = require("../wallet/wallet");

describe('Transaction', () => {

    let blockchain, senderWallet, recipient, transaction, amount;

    beforeEach(() => {
        blockchain = new BlockChain();
        blockchain.addBlock("input");
        senderWallet = new Wallet();
        recipient = new Wallet().publicKey;
        amount = 400;
        transaction = Transaction.newTransaction(senderWallet, recipient, amount);
    });

    it('shows new senderWallet balance in outputs', () => {
        expect(transaction.outputs.find(output => output.address === senderWallet.publicKey).amount)
            .toEqual(senderWallet.balance - amount);
    });

    it('shows amount added to the recipient', () => {
        expect(transaction.outputs.find(output => output.address === recipient).amount)
            .toEqual(amount);
    });

    it('inputs the balance of the wallet', () => {
        expect(transaction.input.amount).toEqual(senderWallet.balance);
    });

    it('verifies a valid transaction', () => {
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
    });

    it('does not verify a corrupt transaction', () => {
        transaction.outputs[0].amount = 50000;
        expect(Transaction.verifyTransaction(transaction)).toBe(false);
    });


    //Updating tests
    it('updates a transaction with a valid addition', () => {
        let recipient2 = new Wallet().publicKey;
        let amount2 = 10;
        transaction.update(senderWallet, recipient2, amount2)
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
    });

    it('invalidates an exceeding `update transaction`', () => {
        let recipient2 = new Wallet().publicKey;
        let amount2 = 200;
        expect(transaction.update(senderWallet, recipient2, amount2)).toBe(undefined);
    });

    it('updates/subtracts the amount from the sender', () => {
        let recipient2 = new Wallet().publicKey;
        let amount2 = 50;
        transaction.update(senderWallet, recipient2, amount2);
        expect(transaction.outputs[0].amount).toEqual(senderWallet.balance - amount - amount2);
        expect(transaction.outputs.find(output => output.address === senderWallet.publicKey).amount)
            .toEqual(senderWallet.balance - amount - amount2);
    });

    it('ouputs an amount for the `next recipient`', () => {
        let recipient2 = new Wallet().publicKey;
        let amount2 = 20;
        transaction.update(senderWallet, recipient2, amount2)
        expect(transaction.outputs.find(output => output.address === recipient2).amount).toEqual(amount2);
    });

    //Exceeding Test
    it('detects exceeding of a wallet', () => {
        transaction = Transaction.newTransaction(senderWallet, recipient, 800);
        expect(transaction).toEqual(undefined);
    });

    describe('creating a reward transaction', () => {
        let minerWallet = new Wallet();
        beforeEach(() => {
            transaction = Transaction.rewardTransaction(minerWallet, Wallet.blockChainWallet());
        });

        it(`rewards the miners 'wallet' for mining`, () => {
            expect(transaction.outputs.find(output => output.address === minerWallet.publicKey).amount).toEqual(MINING_REWARD);
        });

    });
});