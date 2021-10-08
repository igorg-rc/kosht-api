const router = require('express').Router()
const Post = require('../models/Post')
const mongoose = require('mongoose')
const postImageUpload = require('../../helpers/uploadFile')


router.get('/', async (req, res) => {
  try {
    const posts = await Post
      .find({}, null, {sort: '-createdAt'})
      .populate('tags')
      .populate('categories')
    if (!posts || posts.length == 0) {
      return res.status(404).json({ status:404, success: false, message: "Posts were not fond" })
    }
    res.status(200).json(posts)
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)    
  }
})


router.get('/readmore/:slug', async (req, res) => {
  const { slug } = req.params
  try {
    const posts = await Post.find({}, null, {sort: '-createdAt'})
    selected_posts = posts.filter(item => item.slug != slug).slice(0, 5)
    if (!selected_posts) {
      return res.status(404).json(`Requsted posts were not found!`)
    }
    res.status(200).json(selected_posts)
  } catch (error) {
    return res.status(500).json('Beee!')
  }
})


router.get('/slug/:slug', async (req, res) => {
  const { slug } = req.params
  const post = await Post.find({ slug: slug }).populate('categories')
  const selected_post = post[0]
  res.status(200).json(selected_post)
  try {
    const post = await Post.find({ slug: slug })
    if (!mongoose.Types.ObjectId.isValid(slug) || !post) { 
      return res.status(404).json(`Requested post with slug ${slug} was not found!`)
    }
    res.status(200).json(post)
  } catch (error) {
    return res.status(500).json({ message: 'Error: Bad request!' })
  }
})

router.get('/id/:id', async (req, res) => {
  const { id } = req.params
  try {
    const post = await Post.findById(id).populate('tags').populate('categories')
    if (!mongoose.Types.ObjectId.isValid(id) || !post) { 
      return res.status(404).json(`Requested post with id ${id} was not found!`)
    }
    res.status(200).json(post)
  } catch (error) {
    return res.status(500).json({ message: 'Error: Bad request!' })
  }
})


router.get('/tags/:tag', async (req, res) => {
  const { tag } = req.params
  try {
    const posts = await Post
      .find({}, null, {sort: '-createdAt'})
      .populate('tags')
      .populate('categories')
    const req_posts = posts.filter(item => item.tags.find(i => i.slug == tag))
    if (req_posts.length === 0) {
      return res.status(404).json(`Posts with requested tag '${tag}' were not found!`)
    }
    res.status(200).json(req_posts)
  } catch (error) {
    return res.status(500).json(error)
  }
})


router.get('/categories/:category', async (req, res) => {
  const { category } = req.params
  try {
    const posts = await Post.find({}, null, {sort: '-createdAt'}).populate('categories')
    const req_posts = posts.filter(
      item => item.categories.find(i => i.slug == category)
    )
    if (req_posts.length == 0) {
      return res.status(404).json(`Posts with requested '${category}' were not found.`)
    }
    res.status(200).json(req_posts)
  } catch (error) {
    res.status(500).json(error)
  }
})


// router.post('/', postImageUpload.single('image-poster'), async (req, res) => {
router.post('/', async (req, res) => {
  const { title, body, description, tags, categories, posterImage, posterVideo, slug } = req.body
  try {
    const post = new Post({ title, body, description, tags, categories, posterImage, posterVideo, slug })
    await post.save()
    res.status(201).json({ data: post, success: true, status: 201 })
  } catch (error) {
    console.log(error)
    res.status(500).json({ data: null, success: false, status: 500, error: error })
  }
})


router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const post = await Post.findByIdAndRemove(id)
    if (!mongoose.Types.ObjectId.isValid(id) || !post) {
      return res.status(404).json(`Requested post with id=${id} was not found!`)
    }
    res.status(201).json(`Requested post with id=${id} was successfuly deleted!`)
  } catch (error) {
    res.status(500).json({message: error})
  }
})


router.delete('/', async (req, res) => {
  try {
    const posts = await Post.deleteMany()
    res.status(200).json(`All posts were successuly deleted!`)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})


module.exports = router