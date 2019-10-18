const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
  name: {
    type: String
  },
  manaCost: {
    type: String
  },
  cmc: {
    type: Number
  },
  colors: {
    type: Array
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
    type: String
  },
  set: {
    type: String
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
  },
  imageUrl: {
    type: String
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Card', cardSchema)
