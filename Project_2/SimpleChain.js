const SHA256 = require('crypto-js/sha256');
const{ LevelDBService } = require('./LevelDBService.js');
const { Block } = require('./Block.js');

class Blockchain{
  constructor(){
    this.DB = new LevelDBService('./chaindata')

    this.getBlockHeight().then((height) => {
      if (height === -1){
        this.addBlock(new Block("Genesis block")).then(() => console.log("Genesis added"));
      }
    });
  }

  async addBlock(newBlock){
    let currentBlockHeight = await this.getBlockHeight();
    console.log(newBlock);
    newBlock.height = currentBlockHeight + 1;
    newBlock.time = new Date().getTime().toString().slice(0,-3);

    if(newBlock.height === 0){
      newBlock.previousBlockHash = ''
    } else{
      newBlock.previousBlockHash = (await this.getBlock(currentBlockHeight)).hash
    }

    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();

    console.log(`adding block ${newBlock.height}: \n ${JSON.stringify(newBlock,null,' ')}`);
    await this.DB.put(newBlock.height, JSON.stringify(newBlock));
  }

  async getBlockHeight(){
    try {
      let height = await this.DB.count();
      return height;
    }catch(err){
      console.log("failed to get block height");
      return err;
    }
  }

  async getBlock(blockHeight){
    let block = await this.DB.get(blockHeight);
    return JSON.parse(block); 
  }

  async validateBlock(blockHeight){
    let block = await this.getBlock(blockHeight);
    let blockHash = block.hash;
    block.hash = '';

    let validBlockHash = SHA256(JSON.stringify(block)).toString();
    if (blockHash === validBlockHash) {
      return true;
    } else {
      console.log(`Block #${blockHeight} invalid hash:\n${blockHash}<>${validBlockHash}`);
      return false;
    }
  }

  async validateChain(){
    let errorLog = [];
    let blockHeight = await this.getBlockHeight();
    let previousHash = ''

    for (var i = 0; i < blockHeight; i++) {
      let block = await this.getBlock(i);
      let isValidBlock = await this.validateBlock(i);

      if (!isValidBlock)
        errorLog.push(i);

      if (block.previousBlockHash !== previousHash) 
        errorLog.push(i); 

      previousHash = block.hash;
    }

    if (errorLog.length > 0) {
      console.log('Block errors = ' + errorLog.length);
      console.log('Blocks: ' + errorLog);
    } else {
      console.log('No errors detected');
    }
  }
}

module.exports.Blockchain = Blockchain;
