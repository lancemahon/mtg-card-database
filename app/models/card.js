const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
  id: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  manaCost: {
    type: String,
    required: true
  },
  cmc: {
    type: Number,
    required: true
  },
  colors: {
    type: Array,
    required: true
  },
  type: {
    type: String
  },
  supertypes: {
    type: String
  },
  types: {
    type: String
  },
  subTypes: {
    type: String
  },
  rarity: {
    type: String,
    required: true
  },
  set: {
    type: String,
    required: true
  },
  text: {
    type: String
  },
  artist: {
    type: String
  },
  power: {
    type: Number
  },
  toughness: {
    type: Number
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Card', cardSchema)
