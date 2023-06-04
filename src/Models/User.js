const mongoose = require('mongoose')
const Product = require('../Models/Product')
const PointSchema = require('./Utils/PointSchema')
const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phone:{
    type: String,
    required: true
  },
  dateBirth:{
    type: String,
    required: true
  },
  gender:{
    type: String,
    required: true
  },

  location: {
    type: PointSchema,
    index: '2dsphere'
  },
  createdAt: {
    type: String,
    required: true
  },
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
})

module.exports = mongoose.model('User', Schema)
