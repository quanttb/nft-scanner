const mongoose = require('mongoose');
const {
  ConfigSchema,
  NFTSchema,
} = require('../entities');

class DB {
  async init() {
    await mongoose.connect(
      process.env.MONGODB_URL,
      {
        user: process.env.MONGODB_USERNAME,
        pass: process.env.MONGODB_PASSWORD,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        // authSource: 'admin',
      }
    );
    this.connection = mongoose.connection;
    this.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

    this.Configs = mongoose.model('Config', ConfigSchema);
    this.NFTs = mongoose.model('NFT', NFTSchema);

    const startBlock = await this.getConfig('startBlock');
    if (!startBlock) this.setConfig('startBlock', process.env.START_BLOCK);
  }

  async getConfig(id) {
    const result = await this.Configs.findOne({
      _id: id,
    });

    return result ? result.value : null;
  }

  async setConfig(id, value) {
    await this.Configs.updateOne({
      _id: id
    }, {
      value: value
    }, {
      upsert: true,
      setDefaultsOnInsert: true
    });
  }

  async setNFT(tokenId, nft) {
    await this.NFTs.updateOne({
      _id: tokenId,
    }, nft, {
      upsert: true,
      setDefaultsOnInsert: true
    });
  }

  async getNoMetadataNFTs() {
    return this.NFTs.find({
      metadata: null,
    }).sort([['_id', 1]]);
  }
}

module.exports = DB;