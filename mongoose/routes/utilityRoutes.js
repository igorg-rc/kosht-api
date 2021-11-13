const router = require('express').Router()
const path = require('path')

router.get('/unsubscribed', (req, res) => res.status(200).render('pages/unsubscribe_success'))

router.get("/rss.xml", async (req, res) => {
  res.contentType("application/xml")
  res.status(200).sendFile(path.join(__dirname, '../../', 'rss-file.xml'))
})

module.exports = router