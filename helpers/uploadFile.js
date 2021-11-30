const multer = require('multer')
const crypto = require('crypto')
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join("downloads/images/posts"))
  },
  filename: (req, file, cb) => {
    crypto.pseudoRandomBytes(16, (error, raw) => {
      if (error) return cb(error)

      cb(null, `img_${Date.now()}_${file.originalname}`)
    })
  }
})

const UIStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join("downloads/images/ui/contacts"))
  },
  filename: (req, file, cb) => {
    crypto.pseudoRandomBytes(16, (error, raw) => {
      if (error) return cb(error)

      cb(null, `img_${Date.now()}_${file.originalname}`)
    })
  }
})

const categoryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join("downloads/images/ui/categories"))
  },
  filename: (req, file, cb) => {
    crypto.pseudoRandomBytes(16, (error, raw) => {
      if (error) return cb(error)

      cb(null, `img_${Date.now()}_${file.originalname}`)
    })
  }
})

const bannerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join("downloads/images"))
  },
  filename: (req, file, cb) => {
    crypto.pseudoRandomBytes(16, (error, raw) => {
      if (error) return cb(error)

      cb(null, `img_${Date.now()}_${file.originalname}`)
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

const uploadFile = multer({ storage: storage, filter: filter, limits: { fileSize: 10000000 } })
const uploadCategoryFile = multer({ storage: categoryStorage, filter: filter, limits: { fileSize: 10000000 } })
const uploadContactFile = multer({ storage: UIStorage, filter: filter, limits: { fileSize: 10000000 } })
const uploadBannerFile = multer({ storage: bannerStorage, filter: filter, limits: { fileSize: 10000000 } })
   

module.exports = { uploadFile, uploadCategoryFile, uploadContactFile, uploadBannerFile }