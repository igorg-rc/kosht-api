const mongoose = require('mongoose')

const ContactSchema = mongoose.Schema({
  title_ua: { type: String, required: [ true, "Please provide a title in Ukrainian"] },
  title_en: { type: String, required: [ true, "Please provide a title in English"] },
  link: { type: String, required: [ true, "Please provide a link"] },
  imgUrl: { type: String, required: false}
})

module.exports = mongoose.model("Contact", ContactSchema)