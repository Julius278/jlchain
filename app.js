const express = require("express");
const Blockchain = require("./core/blockchain");
const bodyParser = require("body-parser");
const P2pServer = require("./p2p-server");
const Wallet = require("./wallet/wallet");
const TransactionPool = require("./wallet/transaction-pool");
const Miner = require("./mining/miner");

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pserver = new P2pServer(bc, tp);
const miner = new Miner(bc, tp, wallet, p2pserver);

app.use(bodyParser.json());

app.get("/blocks", (req, res) => {
    res.json(bc.chain);
});

app.post("/blocks/mine", (req, res) => {
    if (req.body.data !== null && req.body.data !== undefined) {
        const block = bc.addBlock(req.body.data);
        console.log(`new block added: ${block.toString()}`);

        p2pserver.syncChains();

        res.redirect("/blocks");
    } else {
        res.json("no block data given")
    }
});

app.get("/transactions", (req, res) => {
    res.json(tp.transactions);
});

app.post("/transact", (req, res) => {
    const { recipient, amount } = req.body;
    const transaction = wallet.createTransaction(recipient, amount, bc, tp);
    p2pserver.broadcastTransaction(transaction);
    res.redirect("/transactions");
});

app.get("/public-key", (req, res) => {
    res.json({ publicKey: wallet.publicKey });
});

app.post("/mine", (req, res) => {
    const b = miner.mine();
    console.log(`new block: ${b.toString()}`)
    res.redirect("/blocks");
});

app.listen(HTTP_PORT, () => console.log(`server is listening on ${HTTP_PORT}`));
p2pserver.listen();