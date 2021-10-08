const mongoose = require('mongoose')

const ContactSchema = mongoose.Schema({
  title: { type: String, required: [ true, "Please provide a title"] },
  link: { type: String, required: [ true, "Please provide a link"] },
  imgUrl: { type: String, required: [ true, "Please provide an image"] }
})

module.exports = mongoose.model("Contact", ContactSchema)