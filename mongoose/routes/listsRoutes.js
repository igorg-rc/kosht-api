const router = require('express').Router()
const List = require('../models/List')
const mongoose = require('mongoose')

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

router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const list = await List.find({ _id: id }).populate('posts')
    // const selected_list = list[0]
    if (!list) return res.status(404).json(`Reqested list was not found!`)
    res.status(200).json(list)
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
})

router.post('/', async (req, res) => {
  const { title, posts, qty } = req.body
  try {
    const list = new List({ title, posts, qty })
    await list.save()
    res.status(201).json(list)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})


router.patch('/:id' , async (req, res) => {
  const { id } = req.params
  const {title, posts, qty} = req.body
  try {
    const list = await List.findById(id)
    if (!list || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json(`Requested list with id ${id} was not found!`)
    }
    list.title = req.body.title ? title : list.title
    list.posts = req.body.posts ? posts : list.posts
    list.qty = req.body.qty     ? qty   : list.qty
    const updatedList = await(list.save())
    console.log(title, posts, qty)
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