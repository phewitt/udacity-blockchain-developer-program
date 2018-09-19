const { Block } = require("./Block.js");
const { Blockchain } = require("./SimpleChain.js");
const express = require("express");

const blockchain = new Blockchain();
const app = express();
let port = 8000;

const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.get("/block/:blockheight", async (req, res) => {
  try {
    let block = await blockchain.getBlock(req.params.blockheight);
    console.log(block);
    return res.send(block ? block : "block not found");
  } catch (err) {
    return res.send("Error: block not found");
  }
});

app.post("/block", async (req, res) => {
  if (!req.body.body) {
    res.send("Error: no content in payload");
  }

  try {
    let newblock = new Block(req.body.body);
    await blockchain.addBlock(newblock);
    return res.send(newblock);
  } catch (err) {
    return res.send(err);
  }
});

app.listen(port);
console.log(`Server started! at port :${port}`);
