const mongoose = require('mongoose')

const ListSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please, provide a title"]
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