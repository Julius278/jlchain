const express = require("express");
const Blockchain = require("./core/blockchain");
const bodyParser = require("body-parser");
const P2pServer = require("./p2p-server")

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new Blockchain();
const p2pserver = new P2pServer(bc);

app.use(bodyParser.json());

app.get("/blocks", (req, res) => {
    res.json(bc.chain);
});

app.post("/blocks/mine", (req, res) => {
    if (req.body.data !== null && req.body.data !== undefined) {
        const block = bc.addBlock(req.body.data);
        //console.log(`new block added: ${block.toString()}`);
        res.redirect("/blocks");
    } else {
        res.json("no block data given")
    }
});

app.listen(HTTP_PORT, () => console.log(`server is listening on ${HTTP_PORT}`));
p2pserver.listen();