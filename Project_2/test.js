const { Block } = require('./Block.js');
const { Blockchain } = require('./SimpleChain.js');

let blockchain = new Blockchain();
const TIMES_TO_LOOP = 50;

(function theLoop (i) {
  setTimeout(() => {
    blockchain.addBlock(new Block(`Test Data`)).then(() => {
      if (--i) {
        theLoop(i)
      }
      else{
        blockchain.validateChain();
      }
    })
  }, 100);
})(TIMES_TO_LOOP);
