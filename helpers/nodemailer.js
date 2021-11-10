const nodemailer = require('nodemailer')
const cron = require('node-cron')
const mongoose = require('mongoose')
const Post = require('../mongoose/models/Post')
const { User } = require('../mongoose/models/User')
const { google } = require('googleapis')
const moment = require('moment')
const fs = require('fs')
const ejs = require('ejs')
const path = require('path')

const NODEMAILER_FROM = 'IGOR GAYVORONSKY <igor.gayvoronsky@gmail.com>'
const NODEMAILER_TO = 'igor.gayvoronsky.rc@gmail.com'
const NODEMAILER_USER = 'igor.gayvoronsky@gmail.com'
const NODEMAILER_PASS = 'igor_1987'
const NODEMAILER_SERVICE = 'gmail'

const CLIENT_ID = process.env.CLIENT_ID || '328790408403-9gukrnb4bd4u31csngivfdm30ul4thbd.apps.googleusercontent.com'
const CLIENT_SECRET = process.env.CLIENT_SECRET || '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' 
const REDIRECT_URI = process.env.REDIRECT_URI ||'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = process.env.REFRESH_TOKEN ||'1//04REMrB6rhxX-CgYIARAAGAQSNgF-L9IrRg_W6UN_J8o9Mv-_y42b2KTVW28Z0bnRzVTI1_mzBRtkapcS4rlslCL1EP4HHTrTOA'


const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail() {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const week = 30 * 24 * 3600 * 1000
    const diff = Date.now() - week
    const subscribers = []
    const posts = await Post.find({ createdAt: { $gt: new Date(moment(diff).format('YYYY-MM-DD')) }}, null, { sort: '-createdAt' })
    const users = await User.find()
    users.forEach(el => subscribers.push(el.email))

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'igor.gayvoronsky@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: process.env.NODEMAILER_FROM || 'IGOR GAYVORONSKY <igor.gayvoronsky@gmail.com>',
      to: process.env.NODEMAILER_TO || 'igor.gayvoronsky.rc@gmail.com',
      subject: 'Hello from gmail using API',
      text: 'Hello from gmail email using API',
      html: '<h1>Hello from gmail email using API</h1>',
    };

    const result = await transport.sendMail(mailOptions)
    return result;
  } catch (error) {
    return error;
  }
}

cron.schedule('* * * * *', () => {
  sendMail()
    .then((result) => console.log('Email sent...', result))
    .catch((error) => console.log(error.message))
})

module.exports = sendMail

// email message options
// const mailOptions = {
//   from: require('../config/keys').NODEMAILER_FROM,
//   to: require('../config/keys').NODEMAILER_TO,
//   subject: 'Тижневий дайджест новин від сайту kosht.com.ua',
//   text: 'Вітаємо! Отримуйте останні новини про фінанси, бізнес та інвестиції.'
// }

// // email transport settings
// const transporter = nodemailer.createTransport({
//   service: require('../config/keys').NODEMAILER_SERVICE,
//   auth: {
//     user: require('../config/keys').NODEMAILER_USER,
//     pass: require('../config/keys').NODEMAILER_PASS
//   }
// })

// // sending email
// // '* * * * *' == every minute 
// // '* * * * * *' == every second 
// // '0 16 * * fri' == Friday. at 5:00 p.m.
// const sendMail = () => {
//   cron.schedule('*/10 * * * * *', async () => {
//     try {
//       const week = 30 * 24 * 3600 * 1000
//       const diff = Date.now() - week
//       const subscribers = []
//       const posts = await Post.find({ createdAt: { $gt: new Date(moment(diff).format('YYYY-MM-DD')) }}, null, { sort: '-createdAt' })
//       const users = await User.find()
//       users.forEach(el => subscribers.push(el.email))

//       for (let subscriber of subscribers) {
//         ejs.renderFile(path.join("views/pages/index.ejs"), {articles: posts, email: subscriber}, (err, data) => {
//           if (err) {
//             console.log(err)
//           } 
//           transporter.sendMail({
//           from: require('../config/keys').NODEMAILER_FROM,
//           to: subscriber,
//           subject: 'Тижневий дайджест новин',
//           html: data
//           }, (error, info) => {
//             if (error) {
//               console.log(`Error during sendind a message: ${error}`)
//             } else {
//               console.log(`Sending email - 1 per minute: ${info.response}`)
//             }
//           })
//         })
//       }
//     } catch (error) {
//       console.log(error)
//     }
//   })
// }

// module.exports = sendMail