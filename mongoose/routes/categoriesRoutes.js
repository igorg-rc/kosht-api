const router = require('express').Router()
const { makeSlugEn } = require('../../helpers/makeSlug')
const Category = require('../models/Category')
const { uploadCategoryFile } = require('../../helpers/uploadFile')
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


router.post(
  '/', 
  uploadCategoryFile.fields([
    {name: "img_main", maxCount: 1}, 
    {name: "img_hover", maxCount: 1}
  ]), 
  async (req, res) => {
    const title_ua = req.body ? req.body.title_ua : ""
    const title_en = req.body ? req.body.title_en : ""
    const slug = makeSlugEn(title_en)
    const imgUrl_main = req.files ? req.files.img_main[0].path : null
    const imgUrl_hover = req.files ? req.files.img_hover[0].path : null
    try {
      const category = new Category({ title_ua, title_en, slug, imgUrl_main, imgUrl_hover })
      if (!title_ua || !title_en || !imgUrl_main || !imgUrl_hover) {
        return res.status(400).json({ message: 'Fill titles and images fields!'})
      }
      await category.save()
      res.status(201).json(category)
    } catch (error) {
      res.status(500).json(error)
    }
    // if (req.files){ 
    //   console.log(req.files.img_main[0].path) 
    //   console.log(req.files.img_hover[0].path) 
    // }
  }
)


router.patch(
  '/id/:id', 
  uploadCategoryFile.fields([
    {name: "img_main", maxCount: 1}, 
    {name: "img_hover", maxCount: 1}
  ]), 
  async (req, res) => {
    const { id } = req.params
    try {
      const category = await Category.findById(id)
      if (!category) return res.status(404).json("Requested category was not found!")
      if (category.imgUrl_main) {
        deleteFile(category.imgUrl_main)
      }
      if (category.imgUrl_hover) {
        deleteFile(category.imgUrl_hover)
      }
      category.title_ua = req.body ? req.body.title_ua : category.title_ua
      category.title_en = req.body ? req.body.title_en : category.title_en
      category.slug = req.body ? getSlug(req.body.title_en) : category.slug
      category.imgUrl_main = req.files ? req.files.img_main[0].path : category.imgUrl_main
      category.imgUrl_hover = req.files ? req.files.img_hover[0].path : category.imgUrl_hover
      await category.save()
      res.status(201).json({ success: true, category: category, status: 201 })
    } catch (error) {
      res.status(500).json(error)
    }
  }
)


router.delete('/id/:id', async (req, res) => {
  const { id } = req.params
  try {
    const category = await Category.findById(id)
    if (!category) return res.status(404).json("Requested category was not found!")
    if (category.imgUrl_main) {
      deleteFile(category.imgUrl_main)
    }
    if (category.imgUrl_hover) {
      deleteFile(category.imgUrl_hover)
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