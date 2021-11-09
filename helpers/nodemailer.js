const nodemailer = require('nodemailer')
const cron = require('node-cron')
const keys = require('../config/keys')
const mongoose = require('mongoose')
const Post = require('../mongoose/models/Post')
const { User } = require('../mongoose/models/User')
const moment = require('moment')
const fs = require('fs')
const ejs = require('ejs')
const path = require('path')

// email message options
const mailOptions = {
  from: process.env.NODEMAILER_FROM || keys.NODEMAILER_FROM,
  to: keys.NODEMAILER_TO,
  subject: 'Тижневий дайджест новин від сайту kosht.com.ua',
  text: 'Вітаємо! Отримуйте останні новини про фінанси, бізнес та інвестиції.'
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
// '0 16 * * fri' == Friday. at 5:00 p.m.
const sendMail = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const week = 7 * 24 * 3600 * 1000
      const diff = Date.now() - week
      const subscribers = []
      const posts = await Post.find({ createdAt: { $gt: new Date(moment(diff).format('YYYY-MM-DD')) }}, null, { sort: '-createdAt' })
      const users = await User.find()
      users.forEach(el => subscribers.push(el.email))

      for (let subscriber of subscribers) {
        ejs.renderFile(path.join("views/pages/index.ejs"), {articles: posts, email: subscriber}, (err, data) => {
          if (err) {
            console.log(err)
          } 
          transporter.sendMail({
          from: process.env.NODEMAILER_FROM || keys.NODEMAILER_FROM,
          to: subscriber,
          subject: 'Тижневий дайджест новин',
          html: data
          }, (error, info) => {
            if (error) {
              console.log(`Error during sendind a message: ${error}`)
            } else {
              console.log(`Sending email - 1 per minute: ${info.response}`)
            }
          })
        })
      }
    } catch (error) {
      console.log(error)
    }
  })
}

module.exports = sendMail