const cron = require('node-cron')
const sendEmail = require('./nodemailer')
const getRSS = require('./rss/rssToFile')

const getRSSJob = () => {
  cron.schedule('* * * * *', () => {
    getRSS()
    console.log("RSS for posts has been updated")
  })
}

const sendEmailJob = () => {
  cron.schedule('0 17 * * FRI', () => {
    User.find().then(users => {
      if (users.length > 0) {
      sendEmail()
        .then(result => console.log('Email sent...'))
        .catch(error => console.log(error.message))
      } else {
        return
      }
    })
  })
}

module.exports = {getRSSJob, sendEmailJob}