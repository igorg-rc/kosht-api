const mongoose = require('mongoose')
const joi = require('joi')

const UserSchema = mongoose.Schema({
  email: { type: String }
}, {
  timestamps: true
})

const User = mongoose.model("User", UserSchema)

const validate = user => {
  const schema = joi.object({
    email: joi.string().min(5).email().required()
  })
  return schema.validate(user)
}

module.exports = { User, validate }
