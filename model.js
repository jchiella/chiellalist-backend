const mongoose = require('mongoose');
const { Schema } = mongoose;

const itemSchema = new Schema({
  name: String,
  category: String,
  done: Boolean,
});

const Item = mongoose.model('Item', itemSchema);

module.exports = {
  Item,
};