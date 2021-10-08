const router = require('express').Router()
const { makeSlugEn } = require('../../helpers/makeSlug')
const Tag = require('../models/Tag')


router.get('/', async (req, res) => {
  const tags = await Tag.find()
  try {
    if (!tags) return res.status(404).json({ message: "Tags were not found!" })
    res.status(200).json(tags)
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" })
  }
})


router.get('/slug/:slug', async (req, res) => {
  const { slug } = req.params
  try {
    const tag = await Tag.find({slug})
    if (!tag) return res.status(404).json("Requsted tag was not found!")
    res.status(200).json(tag)
  } catch (error) {
    res.status(500).json(error)
  }
})


router.get('/id/:id', async (req, res) => {
  const { id } = req.params
  try {
    const tag = await Tag.findById(id)
    if (!tag) return res.status(404).json("Requsted tag was not found!")
    res.status(200).json(tag)
  } catch (error) {
    res.status(500).json(error)
  }
})


router.post('/', async (req, res) => {
  const title_ua = req.body ? req.body.title_ua : "default title"
  const title_en = req.body ? req.body.title_en : "default title"
  const slug =  req.body ? makeSlugEn(title_en) : "default_slug"
  try {
    const tag = new Tag({ title_ua, title_en, slug })
    if (!title_ua || !title_en) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Bad request! Fill title field!"
      })
    }
    await tag.save()
    res.status(201).json({
      status: 201,
      success: true,
      message: "New tag was successfuly created.",
      data: tag
    })
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Server error!",
      data: error
    })
  }
})


router.patch('/:id', async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id)
    tag.title_ua = req.body.title_ua ? req.body.title_ua : tag.title_ua
    tag.title_en = req.body.title_en ? req.body.title_en : tag.title_en
    tag.slug = req.body.title_en ? makeSlugEn(req.body.title_en) : tag.slug
    await tag.save()
    res.status(201).json(tag)
  } catch (error) {
    res.status(500).json(error)
  }
})


router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const tag = await Tag.findByIdAndRemove(id)
    if (!tag) return res.status(404).json("Requsted tag was not found!")
    res.status(200).json("Tag was deleted successfully.")
  } catch (error) {
    res.status(500).json(error)
  }
})


module.exports = router