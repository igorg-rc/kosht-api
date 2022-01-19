const router = require('express').Router()
const Post = require('../models/Post')


router.get("/", async (req, res) => {
  try {
    res.status(200).json({ success: true, message: "Search endpoint" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error!" })
  }
})

router.get("/:queryString", async (req, res) => {
  try {
    const queryString = req.params.queryString
    const allPosts = await Post      
      .find()
      .sort('-createdAt')
      .populate('tags')
      .populate('categories')
      
    if (!allPosts) return res.status(404).json({success: false, message: "No posts found!"})
    const selectedPosts = allPosts.filter(item => (
      (item.title).toLowerCase().includes(queryString.toLowerCase()) ||
      (item.body).toLowerCase().includes(queryString.toLowerCase())  || 
      (item.description).toLowerCase().includes(queryString.toLowerCase())
      )
    )
    if (!selectedPosts) return res.status(404).json({success: false, message: "No posts found!"})
    res.status(200).json({success: true, data: selectedPosts})
  } catch (error) {
    return res.status(500).json({ message: "Server error occured!", error: error.message })
  }
})


module.exports = router