const router = require('express').Router()
const { makeSlugEn } = require('../../helpers/makeSlug')
const Category = require('../models/Category')
const uploadFile = require('../../helpers/uploadFile')
const deleteFile = require('../../helpers/deleteFile')


router.get('/', async (req, res) => {
  try {
    const categories = await Category.find()
    res.status(200).json(categories)
  } catch (error) {
    res.status(500).json(error)
  }
})

router.get('/slug/:slug', async (req, res) => {
  const { slug } = req.params
  try {
    const category = await Category.findOne({slug})
    if (!category) return res.status(404).json("Requested category was not found!")
    res.status(200).json(category)
  } catch (error) {
    res.status(500).json(error)
  }
})


router.get('/id/:id', async (req, res) => {
  const { id } = req.params
  try {
    const category = await Category.findById(id)
    if (!category) return res.status(404).json("Requested category was not found!")
    res.status(200).json(category)
  } catch (error) {
    res.status(500).json(error)
  }
})


router.post('/', uploadFile.single('image'), async (req, res) => {
  const title_ua = req.body ? req.body.title_ua : ""
  const title_en = req.body ? req.body.title_en : ""
  const slug = makeSlugEn(title_en)
  const imgUrl = req.file ? req.file.path : null
  try {
    const category = new Category({ title_ua, title_en, slug, imgUrl })
    if (!title_ua || !title_en || !imgUrl) {
      return res.status(400).json({ message: 'Fill title and image fields!'})
    }
    await category.save()
    res.status(201).json(category)
  } catch (error) {
    res.status(500).json(error)
  }
})


router.patch('/id/:id', uploadFile.single("image"), async (req, res) => {
  const { id } = req.params
  try {
    const category = await Category.findById(id)
    if (!category) return res.status(404).json("Requested category was not found!")
    if (category.imgUrl && req.file) {
      deleteFile(category.imgUrl)
    }
    category.title_ua = req.body ? req.body.title_ua : category.title_ua
    category.title_en = req.body ? req.body.title_en : category.title_en
    category.slug = req.body ? getSlug(req.body.title_en) : category.slug
    category.imgUrl = req.file ? req.file.path : category.imgUrl
    await category.save()
    res.status(201).json({ success: true, category: category, status: 201 })
  } catch (error) {
    res.status(500).json(error)
  }
})


router.delete('/id/:id', async (req, res) => {
  const { id } = req.params
  try {
    const category = await Category.findById(id)
    if (!category) return res.status(404).json("Requested category was not found!")
    if (category.imgUrl) {
      deleteFile(category.imgUrl)
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error })
  }
  try {
    const category = await Category.findByIdAndRemove(id)
    if (!category) return res.status(404).json("Requested category was not found!")
    res.status(200).json({ success: true, status: 200, message: `Category with id=${id} was successfuly deleted!` })
  } catch (error) {
    res.status(500).json(error)
  }
})

router.delete('/', async (req, res) => {
  try {
    const contacts = await Contact.find()
    contacts.forEach(contact => deleteFile(contact.imgUrl))
  } catch (error) {
    return res.status(500).json({ status: 500, success: false, message: "Server error!" })
  }
  try {
    await Contact.deleteMany()
    return res.status(200).json({ status: 200, success: true, message: `All contacts were successfuly deleted!` })
  } catch (error) {
    return res.status(500).json({ status: 500, success: false, message: "Server error!" })
  }
})


module.exports = router