const router = require('express').Router()
const mongoose = require('mongoose')
const uploadFile = require('../../helpers/uploadFile')
const deleteFile = require('../../helpers/deleteFile')
const Contact = require('../models/Contact')


router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find()
    if (!contacts || contacts.length == 0) {
      return res.status(404).json({ status: 404, success: false, message: "There were not contacts found" })
    }
    return res.status(200).json({ status: 200, success: true, data: contacts })
  } catch (error) {
    return res.status(500).json({ status: 500, success: true, message: "Server error!" })
  }
})


router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const contact = await Contact.findById(id)
    if (!contact || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ status: 404, success: false, message: `Contact with id=${id} was not found` })
    }
    return res.status(200).json({ status: 200, success: true, data: contact })
  } catch (error) {
    return res.status(500).json({ status: 500, success: true, message: "Server error!" })
  }
})


router.post('/', uploadFile.single('image'), async (req, res) => {
  const title = req.body.title
  const link = req.body.link
  const imgUrl = req.file.path
  try {
    if (!title || !link || !imgUrl) {
      return res.status(400).json({ message: "Fill all fields of form!"})
    }
    const contact = new Contact({ title, link, imgUrl })
    await contact.save()
    return res.status(201).json({ status: 201, success: true, data: contact })
  } catch (error) {
    return res.status(500).json({ status: 500, success: true, message: "Server error!" })
  }
})


router.patch('/:id', uploadFile.single('image'), async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
    if (!contact || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ 
        success: false, 
        message: `Contact with id=${id} was not found` 
      })
    }
    if (contact.imgUrl && req.file.path) {
      deleteFile(contact.imgUrl)
    }
    contact.title = req.body.title
    contact.link = req.body.link
    contact.imgUrl = req.file.path
    await contact.save()
    res.status(200).json({ success: true, message: 'Contact was successfuly updated!', data: contact })
  } catch (error) {
    return res.status(500).json({ status: 500, success: false, message: "Server error!" })
  }
})


router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params)
    if (!contact || !mongoose.Types.ObjectId.isValid(req.params)) {
      return res.status(404).json({ status: 404, success: false, message: `Contact with id=${req.params} was not found!` })
    }
    if (contact.imgUrl) {
      deleteFile(contact.imgUrl)
    }
    contact.delete()
    return res.status(200).json({ status: 200, success: true, message: `Contact with id=${id} was successfuly deleted!` })
  } catch (error) {
    return res.status(500).json({ status: 500, success: false, message: "Server error!" })
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