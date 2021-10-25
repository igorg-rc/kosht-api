const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const PORT = process.env.PORT || require('./config/keys').PORT
const MONGO_URI = process.env.MONGO_URI || require('./config/keys').MONGO_URI
const path = require('path')
const app = express()

mongoose.connect(MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
})
.then(() => console.log("Connected to MongoDb"))
.catch(error => process.disconnect(() => (`Unable to connect. Errors: ${error}`)))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
});

app.use(cors({
  origin: "*",
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

app.use('/downloads/images/ui/contacts', express.static(path.join(__dirname, 'downloads', 'images', 'ui', 'contacts')))
app.use('/downloads/images/ui/categories', express.static(path.join(__dirname, 'downloads', 'images', 'ui', 'categories')))
app.use('/downloads/images/posts', express.static(path.join(__dirname, 'downloads', 'images', 'posts')))

app.get('/', (req, res) => res.status(200).json({ message: 'Kosht API server' }))

app.listen(PORT, () => console.log(`Application is running on port ${PORT}...`))