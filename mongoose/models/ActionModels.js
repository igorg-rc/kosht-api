const mongoose = require('mongoose')

const FileSchema = mongoose.Schema({
  filepath: { type: String }
})

module.exports = mongoose.model("File", FileSchema)