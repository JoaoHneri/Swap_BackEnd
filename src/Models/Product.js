const mongoose = require('mongoose')
const PointSchema = require('./Utils/PointSchema')
const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: PointSchema,
    index: '2dsphere'
  },
  author: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  synopsis: {
    type: String,
    required: true
  },

  year: {
    type: Number,
    required: true
  },
  src: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  allowTrade: {
    type: Boolean,
    default: false
  },
  showOnMap: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Product', Schema)