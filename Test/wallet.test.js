const { INITIAL_BALANCE } = require("../config");
const TransactionPool = require("../wallet/transaction-pool");
const Wallet = require("../wallet/wallet");
const Blockchain = require("../core/blockchain");

describe('Wallet', () => {

    let trPool, senderWallet, recipient, bc, t, sendAmount;

    beforeEach(() => {
        trPool = new TransactionPool();
        senderWallet = new Wallet();
        recipient = new Wallet();
        bc = new Blockchain();
    });

    describe('creates a transaction', () => {
        beforeEach(() => {
            sendAmount = 5;
            t = senderWallet.createTransaction(recipient.publicKey, sendAmount, bc, trPool);
        });

        describe('and doing the same transaction', () => {
            beforeEach(() => {
                senderWallet.createTransaction(recipient.publicKey, sendAmount, bc, trPool);
            });

            it('doubles the `sendAmount` subtracted from the wallet balance', () => {
                expect(t.outputs.length).toEqual(3);
                expect(t.outputs.find(output => output.address === senderWallet.publicKey).amount).toEqual(INITIAL_BALANCE - (sendAmount * 2));
                expect(t.outputs[0].amount).toEqual(INITIAL_BALANCE - (sendAmount * 2));
            });

            it('clones the `sendAmount` output for the recipient wallet', () => {
                expect(t.outputs.length).toEqual(3);
                expect(t.outputs[1]).toEqual(t.outputs[2]);
                expect(t.outputs.filter(output => output.address === recipient.publicKey).map(output => output.amount))
                    .toEqual([sendAmount, sendAmount]);
            });
        });
    });

    describe('calculating a balance', () => {
        let addBalance, repeatAdd;
        beforeEach(() => {
            senderWallet = new Wallet();
            addBalance = 20;
            repeatAdd = 3;
            for (i = 0; i < repeatAdd; i++) {
                senderWallet.createTransaction(recipient.publicKey, addBalance, bc, trPool);
            }
            bc.addBlock(trPool.transactions);
        });

        it('calculates the balance for the blockchain transactions matching the recipient', () => {
            expect(recipient.calculateBalance(bc)).toEqual(INITIAL_BALANCE + (repeatAdd * addBalance));
        });

        it('calculates the balance for blockchain transactions matching the senderwallet', () => {
            expect(senderWallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE - (repeatAdd * addBalance));
        });

        describe('and the recipient conducts a transaction', () => {
            let subtractBalance, repeatSubtract;
            beforeEach(() => {
                trPool.clear();
                subtractBalance = 30;
                repeatSubtract = 5;
                for (i = 0; i < repeatSubtract; i++) {
                    recipient.createTransaction(senderWallet.publicKey, subtractBalance, bc, trPool);
                }
                bc.addBlock(trPool.transactions);
            });

            it('calculates the balance for second blockchain transactions matching the recipient', () => {
                expect(recipient.calculateBalance(bc)).toEqual(INITIAL_BALANCE + (repeatAdd * addBalance) - (repeatSubtract * subtractBalance));
            });
        });
    });
});