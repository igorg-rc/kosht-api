const mongoose = require('mongoose')

const PostSchema = mongoose.Schema({
  title: { 
    type: String,
    required: [ true, "Please provide a title" ]
  },
  body: { 
    type: String,
    required: [ true, "Please provide a body" ]
  },
  posterImage: { 
    type: String,
    required: false,
    default: null
  },
  posterVideo: { 
    type: String,
    required: false,
    default: null
  },
  description: { 
    type: String,
    required: [ true, "Please provide the description" ]
  },
  slug: { 
    type: String,
    required: [ true, "Please provide a slug" ]
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tag",
  }],
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }]
}, {
  timestamps: true
})

module.exports = mongoose.model("Post", PostSchema)