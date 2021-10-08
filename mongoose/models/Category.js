const mongoose = require('mongoose')

const CategorySchema = mongoose.Schema({
  title_ua: {
    type: String,
    required: [true, "Please, provide a title in Ukrainian"]
  },
  title_en : {
    type: String,
    required: [true, "Please, provide a title in English"]
  },
  slug: {
    type: String,
    required: [true, "Please, provide a slug"]
  },
  imgUrl: {
    type: String,
    required: [true, "Please, provide an image"]
  }
})

module.exports = mongoose.model('Category', CategorySchema)