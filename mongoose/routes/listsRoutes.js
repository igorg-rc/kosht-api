const router = require('express').Router()
const List = require('../models/List')
const mongoose = require('mongoose')
const getSlug = require('speakingurl')

router.get('/', async (req, res) => {
  try {
    const lists = await List.find({}, null, {sort: '-createdAt'})
    if (!lists || lists.length == 0) {
      return res.status(404).json(`Reqested lists were not found!`)
    }
    res.status(200).json(lists)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})

router.get('/id/:id', async (req, res) => {
  const { id } = req.params
  try {
    const list = await List.find({ _id: id }).populate('posts')
    if (!list) return res.status(404).json(`Reqested list was not found!`)
    // const selected_list = list[0]
    res.status(200).json(list)
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
})

router.get('/slug/:slug', async (req, res) => {
  const { slug } = req.params
  try {
    const list = await List.find({ slug: slug }).populate('posts')
    if (!list) return res.status(404).json(`Reqested list was not found!`)
    const selected_list = list[0]
    res.status(200).json(selected_list)
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
})

router.post('/', async (req, res) => {
  const { title_ua, title_en, posts, qty } = req.body
  const slug = getSlug(title_en)
  try {
    const list = new List({ title_ua, title_en, slug, posts, qty })
    await list.save()
    res.status(201).json(list)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})


router.patch('/id/:id' , async (req, res) => {
  const { id } = req.params
  const {title_ua, title_en, posts, qty} = req.body
  const slug = getSlug(title_en)
  try {
    const list = await List.findById(id)
    if (!list || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json(`Requested list with id ${id} was not found!`)
    }
    list.title_ua = title_ua ? title_ua : list.title_ua
    list.title_en = title_en ? title_en : list.title_en
    list.slug = title_en ? slug : list.slug
    list.posts = posts ? posts : list.posts
    list.qty = qty     ? qty   : list.qty
    const updatedList = await list.save()
    console.log(title_ua, title_en, slug, posts, qty)
    res.status(201).json(updatedList)
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
})


router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const list = await List.findByIdAndRemove(id)
    if (!list || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json(`Requested list with id ${id} was not found!`)
    }
    res.status(200).json(`Selected list with id=${id} was successfuly deleted`)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})


router.delete('/', async (req, res) => {
  try {
    await List.deleteMany()
    return res.status(200).json('All lists were successfuly deleted!')
  } catch (error) {
    return res.status(500).json({ message: error })
  }
})

module.exports = router