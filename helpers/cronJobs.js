const cron = require('node-cron')
const sendEmail = require('./sendEmail')
const getRSS = require('./getRSS')

const getRSSJob = () => {
  cron.schedule('*/1440 * * * *', () => {
    getRSS()
    console.log("RSS cron job done")
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