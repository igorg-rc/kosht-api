const router = require('express').Router()
const mongoose = require('mongoose')
const {User, validate} = require('../models/User')


router.get('/test', (req, res) => {
  res.render('pages/index')
  console.log('test route reched!')
})


router.get('/', async (req, res) => {
  try {
    const users = await User.find()
    if (!users || users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        status: 404, 
        message: 'Users were not found!' }
    )}
    res.status(200).json({ success: true, status: 200, data: users })
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      status: 500, 
      message: "Server error!" 
    })}
})


router.get('/id/:id', async (req, res) => {
  const { id } = req.params
  try {
    const user = await User.findById(id)
    if (!user || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ 
        success: false, 
        status: 404, 
        message: `Requested user with id=${id} was not found!` 
    })}
    res.status(200).json({
      success: true,
      status: 200,
      data: user
    })
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      status: 500,
      message: 'Server error!' 
    })
  }
})

router.get('/email/:email', async (req, res) => {
  const { email } = req.params
  try {
    const user = await User.findOne({ email: email })
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        status: 404, 
        message: `Requested user with id=${id} was not found!` 
    })}
    res.status(200).json({
      success: true,
      status: 200,
      data: user
    })
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      status: 500,
      message: 'Server error!' 
    })
  }
})


router.post('/', async (req, res) => {
  try {
    const { error } = validate(req.body)
    if (error) {
      return res.status(400).json({ 
        success: false, 
        status: 400, 
        message: error.details[0].message 
      })
    }
    const user = await User.findOne({ email: req.body.email })
    if (user) {
      return res.status(400).json({ 
        success: false, 
        status: 400, 
        message: 'User with such email is already exists!', data: user.email })
    }
    newUser = new User({ email: req.body.email })
    await newUser.save()
    return res.status(201).json({ 
      success: true, 
      status: 201, 
      message: 'New user has been successfuly created!', data: newUser 
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, status: 500, message: "Server error!" })
  }
})


router.patch('/:id', async (req, res) => {
  const { id } = req.params
  const { email } = req.body
  try {
    const { error } = validate(req.body)
    if (error) {
      res.status(400).json({
        success: false,
        status: 400,
        message: error.details[0].message
      })
    }
    const user = await User.findById(id)
    if (!user || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ 
        success: false, 
        status: 404, 
        message: `Requested user with id=${id} was not found!` 
      })
    }
    user.email = email
    await user.save()
    return res.status(201).json({
      success: true, 
      status: 201, 
      message: `Requested user with id=${id} was successfuly updated!`,
      data: user 
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ 
      success: false, 
      status: 500, 
      message: "Server error!" 
    })
  }
})


// router.post('/delete/email/:email', async (req, res) => {
//   const { email } = req.params
//   try {
//     const user = await User.findOneAndRemove({ email: email })
//     if (!user) {
//       return res.status(404).json({ 
//         success: false, 
//         status: 404, 
//         message: `Requested user with email=${email} was not found!` 
//     })}
//     return res.status(200).render('pages/unsubscribe_success')
//   } catch (error) {
//     return res.status(500).json({ 
//       success: false, 
//       status: 500, 
//       message: "Server error!" 
//     })
//   }
// })


router.delete('/', async (req, res) => {
  try {
    await User.deleteMany()
    return res.status(200).json({
      success: true,
      status: 200,
      message: "All users were successfuly deleted!"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Server error!"
    })
  }
})



module.exports = router