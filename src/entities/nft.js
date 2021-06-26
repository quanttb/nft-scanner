const Schema = require('mongoose').Schema;

const NFTSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  quantities: {
    type: Number,
    required: true
  },
  uri: {
    type: String,
    required: true
  },
  creator: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  mintTransactionHash: {
    type: String,
    required: true
  },
  metadata: {
    name: String,
    description: String,
    image: String,
    externalUrl: String,
    // attributes: String,
  }
}, {
  collection: 'nfts'
});

module.exports = NFTSchema;