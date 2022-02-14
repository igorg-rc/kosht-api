const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const PORT = process.env.PORT || require('./config/keys').PORT
const MONGO_URI = process.env.MONGO_URI || require('./config/keys').MONGO_URI
const path = require('path')
const preHandler = require('./helpers/preHandler')
const Tag = require('./mongoose/models/Tag')
const { getRSSJob, sendEmailJob } = require('./helpers/cronJobs')

const app = express()

mongoose.connect(MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
})
.then(() => console.log("Connected to MongoDb"))
.catch(error => process.disconnect(() => (`Unable to connect. Errors: ${error}`)))

app.set('view engine', 'ejs')

preHandler(Tag)

app.use(cors({
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}))
// app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  // res.setHeader("Access-Control-Expose-Headers", "Content-Range, X-Total-Count");
  res.setHeader("Access-Control-Expose-Headers", "*");
  next()
});


// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header("Access-Control-Expose-Headers", "Content-Range, X-Total-Count");

//     next();
// });

app.use(express.json({ extended: true }))
app.use(express.urlencoded({ extended: true }))

app.use('/api/posts', require('./mongoose/routes/postsRoutes'))
app.use('/api/tags', require('./mongoose/routes/tagsRoutes'))
app.use('/api/categories', require('./mongoose/routes/categoriesRoutes'))
app.use('/api/lists', require('./mongoose/routes/listsRoutes'))
app.use('/api/actions', require('./mongoose/routes/actionsRoutes'))
app.use('/api/users', require('./mongoose/routes/usersRoutes'))
app.use('/api/contacts', require('./mongoose/routes/contactsRoutes'))
app.use('/api/banners', require('./mongoose/routes/bannersRoutes'))
app.use('/api/search', require('./mongoose/routes/searchRoutes'))
app.use('/utility', require('./mongoose/routes/utilityRoutes'))

app.use('/downloads/images/ui/contacts', express.static(path.join(__dirname, 'downloads', 'images', 'ui', 'contacts')))
app.use('/downloads/images/ui/categories', express.static(path.join(__dirname, 'downloads', 'images', 'ui', 'categories')))
app.use('/downloads/images/posts', express.static(path.join(__dirname, 'downloads', 'images', 'posts')))
app.use('/downloads/images', express.static(path.join(__dirname, 'downloads', 'images')))
app.use('/downloads/images/banners', express.static(path.join(__dirname, 'downloads', 'images', 'banners')))
app.use('/public', express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => res.status(200).json({ message: 'Kosht API server' }))


getRSSJob()
sendEmailJob()


app.listen(PORT, () => console.log(`Application is running on port ${PORT}...`))