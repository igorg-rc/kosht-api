const router = require('express').Router()
const mongoose = require('mongoose')
const Banner = require('../models/Banner')
const { uploadBannerFile } = require('../../helpers/uploadFile') 
const deleteFile = require('../../helpers/deleteFile')

router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find()
    if (!banners || banners.length == 0) {
      return res.status(404).json({ message: "Banners were not find" })
    }
    res.status(200).json({ success: true, status: 200, data: banners })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})


router.get('/visible', async (req, res) => {
  try {
    const banners = await Banner.find({ visible: true })
    if (!banners || banners.length == 0) {
      return res.status(404).json({ message: "Banners were not find" })
    }
    const selected_banner = banners[0]
    res.status(200).json({ success: true, status: 200, data: selected_banner })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})


router.get('/visible-all', async (req, res) => {
  try {
    const banners = await Banner.find({ visible: true })
    // if (!banners) {
    //   return res.status(404).json({ message: 'Requested banners were not found!' })
    // }
    res.status(200).json(banners)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})


router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const banner = await Banner.findById(id)
    if (!banner || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: `Requsted banner was not found!` })
    } 
    res.status(200).json({ success: true, status: 200, data: banner })    
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})


router.post('/', uploadBannerFile.single('banner-img'), async (req, res) => {
  const { title, owner, link } = req.body
  const imgUrl = req.file ? req.file.path : null
  try {
    const banner = new Banner({ title, owner, imgUrl, link })
    await banner.save()
    if (!title || !owner || !link) return res.status(400).json({ message: 'Fill all fields!' })
    res.status(201).json({ status: 201, success: true, data: banner })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})


router.post('/visible', async (req, res) => {
  const { id } = req.params
  try {
    const banner = await Banner.find({ visible: true })
    const selected_banner = banner[0]
    selected_banner.clicks += 1
    await selected_banner.save()
    res.status(201).json(selected_banner)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})


router.patch('/:id', uploadBannerFile.single('banner-img'), async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id)
    if (!banner || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ 
        status: 404, 
        success: true, 
        message: 'Requsted banner was not found!' 
      })
    }
    if ((banner.imgUrl) && req.file) {
      deleteFile(banner.imgUrl)
      banner.imgUrl = req.file.path 
    }
    banner.title = req.body.title ? req.body.title : banner.title
    banner.owner = req.body.owner ? req.body.owner : banner.owner
    banner.link = req.body.link ? req.body.link : banner.link
    banner.visible = req.body.visible ? req.body.visible : banner.visible
    banner.save()
    res.status(201).json({ status: 201, success: true, data: banner })
  } catch (error) {
    return res.status(500).json({ 
      status: 500, 
      success: false, 
      message: error.message 
    })
  }
})


router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const banner = await Banner.findById(id)
    if (!banner || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ 
        status: 404, 
        success: true, 
        message: 'Requsted banner was not found!' 
      })
    }
    if (banner.imgUrl) {
      deleteFile(banner.imgUrl)
      banner.imgUrl = null 
    }
    await Banner.deleteOne({ _id: id })
    res.status(200).json({ 
      status: 200, 
      success: true, 
      message: `Requsted banner with was successfuly deleted.` 
    })
  } catch (error) {
    return res.status(500).json({
      status: 500, 
      success: false, 
      message: error.message       
    })
  }
})



module.exports = router