const router = require('express').Router()

router.get('/unsubscribed', (req, res) => {
  res.status(200).render('pages/unsubscribe_success')
})

module.exports = router