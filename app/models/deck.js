const mongoose = require('mongoose')

const deckSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  colors: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  format: {
    type: String
  },
  commander: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card'
  },
  legal: {
    type: Boolean
  },
  cards: [String]
}, {
  timestamps: true
})

module.exports = mongoose.model('Deck', deckSchema)
