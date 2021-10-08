const mongoose = require('mongoose')

const TagSchema = mongoose.Schema({
  title_ua: {
    type: String,
    required: [true, "Please, provide a title in English"]
  },
  title_en: {
    type: String,
    required: [true, "Please, provide a title in Ukrainian"]
  },
  slug: {
    type: String,
    required: false
  }
})

module.exports = mongoose.model("Tag", TagSchema)