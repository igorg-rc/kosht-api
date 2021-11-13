const nodemailer = require('nodemailer')
const Post = require('../mongoose/models/Post')
const { User } = require('../mongoose/models/User')
const { google } = require('googleapis')
const moment = require('moment')
const ejs = require('ejs')
const path = require('path')

const NODEMAILER_FROM = process.env.NODEMAILER_FROM || require('../config/keys').NODEMAILER_FROM
const NODEMAILER_USER = process.env.NODEMAILER_USER || require('../config/keys').NODEMAILER_USER
const NODEMAILER_SERVICE = process.env.NODEMAILER_SERVICE || require('../config/keys').NODEMAILER_SERVICE
const TYPE = process.env.TYPE || require('../config/keys').TYPE
const CLIENT_ID = process.env.CLIENT_ID || require('../config/keys').CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET || require('../config/keys').CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI || require('../config/keys').REDIRECT_URI
const REFRESH_TOKEN = process.env.REFRESH_TOKEN || require('../config/keys').REFRESH_TOKEN

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

const sendEmail = async () => {
  try {
    const week = 7 * 24 * 3600 * 1000
    const diff = Date.now() - week
    const subscribers = []
    const posts = await Post.find({ createdAt: { $gt: new Date(moment(diff).format('YYYY-MM-DD')) }}, null, { sort: '-createdAt' })
    const users = await User.find()
    users.forEach(el => subscribers.push(el.email))

    for (let subscriber of subscribers) {
      ejs.renderFile(
          path.join('views/pages/index.ejs'), 
          {email: subscriber, articles: posts}, 
          (err, data) => {
            if (err) {
              console.log(err)
              throw err
            }
          const res = nodemailer
          .createTransport({
            service: NODEMAILER_SERVICE,
            auth: {
              type: TYPE,
              user: NODEMAILER_USER,
              clientId: CLIENT_ID,
              clientSecret: CLIENT_SECRET,
              refreshToken: REFRESH_TOKEN,
              accessToken: oAuth2Client.getAccessToken()
            }
          }).sendMail({
            from: NODEMAILER_FROM,
            to: subscriber,
            subject: 'Hello from local',
            text: 'Hello from local',
            html: data
          })
        return res 
      })
    }
  } catch (error) {
    return error
  }
}

module.exports = sendEmail