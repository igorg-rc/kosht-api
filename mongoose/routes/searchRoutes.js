const router = require('express').Router()
const Post = require('../models/Post')


router.get("/:queryString", async (req, res) => {
  const queryString = req.params.query
  const allPosts = await Post.find()
  if (!allPosts) return res.status(404).json({success: false, message: "No posts found!"})
  const selectedPosts = allPosts.filter(item => (
    (item.title).toLowerCase().includes(queryString.toLowerCase()) || 
    (item.body).toLowerCase().includes(queryString.toLowerCase())  || 
    (item.description).toLowerCase().includes(queryString.toLowerCase())
    )
  )
  if (!selectedPosts) return res.status(404).json({success: false, message: "No posts found!"})
  res.status(200).json({success: true, data: selectedPosts})
})


module.exports = router