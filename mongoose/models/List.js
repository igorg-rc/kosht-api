const mongoose = require('mongoose')

const ListSchema = mongoose.Schema({
  title_ua: {
    type: String,
    required: true
  },
  title_en: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: false
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Post",
    required: false
  }],
  qty: {
    type: Number,
    default: 10,
    required: false
  }
})

module.exports = mongoose.model('List', ListSchema)