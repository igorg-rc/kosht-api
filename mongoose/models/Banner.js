const mongoose = require('mongoose')

const BannerSchema = mongoose.Schema({
  title : {
    type: String,
    required: [true, "Please, provide a title"]
  },
  owner: {
    type: String,
    required: [true, "Please, provide an owner"]
  },
  imgUrl: {
    type: String,
    required: [true, "Please, provide an image"]
  },
  link: {
    type: String,
    required: [true, "Please, provide a link to the site"]
  },
  visible: {
    type: Boolean,
    required: false,
    default: false
  },
  clicks: {
    type: Number,
    required: false,
    default: 0
  }
})


module.exports = mongoose.model('Banner', BannerSchema)