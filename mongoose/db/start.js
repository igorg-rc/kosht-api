const mongoose = require('mongoose')
const MONGO_URI = process.env.MONGO_URI || 
'mongodb+srv://igor-1987:7KN2Cwxcc0Rtj7Y4@cluster0.mgaax.mongodb.net/blog?retryWrites=true&w=majority'

const mongoStart = async () => {
  try {
    mongoose.connect(MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    }, () => console.log(`Connected to MongoDB...`))
  } catch (error) {
    process.disconnect(() => (`Unable to connect. Errors: ${error}`))
  }
}

module.exports = mongoStart