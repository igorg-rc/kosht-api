const router = require('express').Router()
const mongoose = require('mongoose')
const { uploadContactFile } = require('../../helpers/uploadFile')
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


router.post('/', uploadContactFile.single('image'), async (req, res) => {
  const title_ua = req.body.title_ua
  const title_en = req.body.title_en
  const link = req.body.link
  const imgUrl = req.file.path
  try {
    if (!title_ua || !title_en || !link || !imgUrl) {
      return res.status(400).json({ message: "Fill all fields of form!"})
    }
    const contact = new Contact({ title_ua, title_en, link, imgUrl })
    await contact.save()
    return res.status(201).json({ status: 201, success: true, data: contact })
  } catch (error) {
    return res.status(500).json({ status: 500, success: true, message: "Server error!" })
  }
})


router.patch('/:id', uploadContactFile.single('image'), async (req, res) => {
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
    contact.title_ua = req.body.title_ua
    contact.title_en = req.body.title_en
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
    const contact = await Contact.findById(req.params.id)
    if (!contact || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ status: 404, success: false, message: `Contact with id=${req.params} was not found!` })
    }
    if (contact.imgUrl) {
      deleteFile(contact.imgUrl)
    }
    await Contact.deleteOne({ _id: req.params.id })
    return res.status(200).json({ status: 200, success: true, message: `Contact with id=${id} was successfuly deleted!` })
  } catch (error) {
    return res.status(500).json({ status: 500, success: false, message: error })
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