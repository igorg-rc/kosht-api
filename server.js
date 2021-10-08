const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const PORT      = process.env.NODE_ENV  === 'production' ? process.env.PORT      : require('./config/keys').PORT
const MONGO_URI = process.env.NODE_ENV  === 'production' ? process.env.MONGO_URI : require('./config/keys').MONGO_URI
// const mongoStart = require('./mongoose/db/start')
const path = require('path')
const app = express()

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


mongoStart()

app.use(cors({
  origin: ["*"
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}))

app.use(express.json({ extended: true }))
app.use(express.urlencoded({ extended: true }))

app.use('/api/posts', require('./mongoose/routes/postsRoutes'))
app.use('/api/tags', require('./mongoose/routes/tagsRoutes'))
app.use('/api/categories', require('./mongoose/routes/categoriesRoutes'))
app.use('/api/lists', require('./mongoose/routes/listsRoutes'))
app.use('/api/actions', require('./mongoose/routes/actionsRoutes'))
app.use('/api/users', require('./mongoose/routes/usersRoutes'))
app.use('/api/contacts', require('./mongoose/routes/contactsRoutes'))

app.use('/downloads/images/posts', express.static(path.join(__dirname, 'downloads', 'images', 'posts')))

if (process.env.NODE_ENV === 'production') {
}
app.use(express.static(path.join(__dirname, "site", "build")))
app.use(express.static(path.join(__dirname, "admin", "build")))
app.get('/', (req, res) => res.sendFile(path.join(__dirname, "site", "build", "index.html")))
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, "admin", "build", "index.html")))


app.listen(PORT, () => console.log(`Application is running on port ${PORT}...`))