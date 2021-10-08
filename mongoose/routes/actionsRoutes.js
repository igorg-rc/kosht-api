const router = require('express').Router()
const multer = require('multer')
const crypto = require('crypto')
const path = require('path')
const File = require('../models/ActionModels')
const deleteFile = require('../../helpers/deleteFile')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join("downloads/images/posts"))
  },
  filename: (req, file, cb) => {
    crypto.pseudoRandomBytes(16, (error, raw) => {
      if (error) return cb(error)

      cb(null, `img_${Date.now()}_${(file.originalname).toLowerCase()}`)
    })
  }
})


const filter = (req, file, cb) => {
  const type = file.mimetype
  if (type === 'image/jpeg' || type === 'image/png' || type === 'image/gif') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const limits = { fileSize: 100000000 }

const upload = multer({storage, filter, limits})
// const uploadImgPoster= multer({storage, filter, limits}).single("image-poster")
// const uploadImgBody = multer({storage, filter, limits}).single("image-body")
// const uploadImgGallery = multer({storage, filter, limits})


router.get('/', (req, res) => {
  File
    .find()
    .then(result => res.status(200).json(result))
    .catch(error => res.status(500).json({ message: error}))
})


router.post('/upload', upload.single("image"), (req, res) => {
  const filepath = req.file ? req.file.path : null
  console.log(filepath)
  const file = new File({ filepath })
  file
    .save()
    .then(result => res.status(200).json({ data: result, success: true, status: 200 }))
    .catch(error => res.status(500).json({ data: null, success: false, status: 500, error: error }))
})

router.post('/upload-gallery', upload.array("images", 100), (req, res) => {
  const reqFiles = []
  const filepath = req.file ? req.file : null
  // const url = `${req.protocol}://${req.get('host')}`
  for (let i = 0; i < req.files.length; i++) {
    const file = new File(req.filepath)
    file
      .save()
      .then(result => res.status(200).json({ data: result, success: true, status: 200 }))
      .catch(error => res.status(500).json({ data: null, success: false, status: 500, error: error }))
  }
})


// router.post('/upload-poster', uploadImgPoster, (req, res) => {
//   const filepath = req.file ? req.file.path : null
//   console.log(filepath)
//   const file = new File({ filepath })
//   file
//     .save()
//     .then(result => res.status(200).json({ data: result, success: true, status: 200 }))
//     .catch(error => res.status(500).json({ data: null, success: false, status: 500, error: error }))
// })

// router.post('/upload-img-body', uploadImgBody, (req, res) => {
//   const filepath = req.file ? req.file.path : null
//   console.log(filepath)
//   const file = new File({ filepath })
//   file
//     .save()
//     .then(result => res.status(200).json({ data: result, success: true, status: 200 }))
//     .catch(error => res.status(500).json({ data: null, success: false, status: 500, error: error }))
// })

router.delete('/delete', (req, res) => {
  File
    .find()
    .then(item => deleteFile(item.filepath))
    .catch(error => console.log(error))

  File
    .deleteMany()
    .then(result => res.status(200).json({message: "All files were successfuly deleted!"}))
    .catch(error => {
      console.log(error)
      res.status(500).json({message: error})
    })
})

module.exports = router