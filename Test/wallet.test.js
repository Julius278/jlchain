const { INITIAL_BALANCE } = require("../config");
const TransactionPool = require("../wallet/transaction-pool");
const Wallet = require("../wallet/wallet");

describe('Wallet', () => {

    let trPool, senderWallet, recipient;

    beforeEach(() => {
        trPool = new TransactionPool();
        senderWallet = new Wallet();
        recipient = new Wallet();
    });
    describe('creates a transaction', () => {
        let t, sendAmount;
        beforeEach(() => {
            sendAmount = 5;
            t = senderWallet.createTransaction(recipient.publicKey, sendAmount, trPool);
        });

        describe('and doing the same transaction', ()=> {
            beforeEach(()=>{
                senderWallet.createTransaction(recipient.publicKey, sendAmount, trPool);
            });

            it('doubles the `sendAmount` subtracted from the wallet balance', () => {
                expect(t.outputs.length).toEqual(3);
                expect(t.outputs.find(output => output.address === senderWallet.publicKey).amount).toEqual(INITIAL_BALANCE - (sendAmount*2));
                expect(t.outputs[0].amount).toEqual(INITIAL_BALANCE - (sendAmount*2));
            });

            it('clones the `sendAmount` output for the recipient wallet', () => {
                expect(t.outputs.length).toEqual(3);
                expect(t.outputs[1]).toEqual(t.outputs[2]);
                expect(t.outputs.filter(output => output.address === recipient.publicKey).map(output => output.amount))
                    .toEqual([sendAmount, sendAmount]);
            });
        });
    });
});