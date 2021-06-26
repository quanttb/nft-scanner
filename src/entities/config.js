const Schema = require('mongoose').Schema;

const ConfigSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
}, {
  collection: 'configs'
});

module.exports = ConfigSchema;