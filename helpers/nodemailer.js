const nodemailer = require('nodemailer')
const cron = require('node-cron')
const keys = require('../config/keys')
const mongoose = require('mongoose')
const Post = require('../mongoose/models/Post')
const { User } = require('../mongoose/models/User')
const moment = require('moment')

// const users = User.find().concat(", ").then(users => users.json()).catch(error => console.log(error))

// email message options
const mailOptions = {
  from: keys.NODEMAILER_FROM,
  to: keys.NODEMAILER_TO,
  subject: 'Hello from nodemailer',
  text: 'Hello from node! Hello from node! Hello from node! Hello from node! Hello from node! Hello from node!'
}


// email transport settings
const transporter = nodemailer.createTransport({
  service: keys.NODEMAILER_SERVICE,
  auth: {
    user: keys.NODEMAILER_USER,
    pass: keys.NODEMAILER_PASS
  }
})

// sending email
// '* * * * *' == every minute 
// '* * * * * *' == every second 
const sendMail = () => {
  // cron.schedule('*/10 * * * * *', () => {
  cron.schedule('* * * * *', () => {
    const week = 7 * 24 * 3600 * 1000
    const diff = Date.now() - week

    Post.find(
      { createdAt: { $gt: new Date(moment(diff).format('YYYY-MM-DD')) }},
      null, 
      { sort: '-createdAt' }
    )
    .then(posts => {
      const subscribers = []
      User.find().then(users => users.forEach(element => subscribers.push(element.email))).catch(error => console.log(error))
      const output = posts.map(i => 
        `<div style="font-size: 18px">
          <a href="http://localhost:3000/${i.slug}">${(i.title)}</a>
        </div>`
      )
      transporter.sendMail({
        from: process.env.NODEMAILER_FROM || keys.NODEMAILER_FROM,
        to: subscribers,
        subject: 'Hello from nodemailer',
        html: `<h1 style="text-align:center">Hello from kosht! Doon't waste our weekly newslatter!</h1>
          <h2>${output}</h2>
        `
      }, (error, info) => {
        if (error) {
          console.log(`Error during sendind a message: ${error}`)
        } else {
          console.log(`Sending email - 1 per minute: ${info.response}`)
        }
      })
    })
    .catch(error => console.log(error))

  })
}

module.exports = sendMail