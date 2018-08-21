const level = require('level');

class LevelDBService{
  // Set database path for this levelDBService 
  constructor(DBPath){
    this.db = level(DBPath);
  }

  // Add data to levelDB with key/value pair
  async put(key,value){
    try{
      await this.db.put(key, value);
    }catch(err){
      console.log('Block ' + key + ' submission failed', err);
    }
  }

  // Get data from levelDB with key
  async get(key){
    try{
      return await this.db.get(key);
    }catch(err){
      return console.log('Not found!', err);
    }
  }

  // Add data to levelDB with value
  count() {
    return new Promise((resolve, reject) => {
      let count = -1;
      this.db.createReadStream()
        .on('data', (data) => {
          count++;
        })
        .on('error', (err) => {
          reject(err)
        })
        .on('close', () => {
          resolve(count);
        });
    });    
  }
}

module.exports.LevelDBService = LevelDBService;
