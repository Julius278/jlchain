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

    it('detects exceeding of a wallet', () => {
        transaction = Transaction.newTransaction(senderWallet, recipient, 800);
        expect(transaction).toEqual(undefined);
    });
});