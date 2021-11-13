const router = require('express').Router()
const Post = require('../models/Post')
const API_URL = process.env.API_URL || require('../../config/keys').API_URL
const EDITOR_EMAIL = process.env.EDITOR_EMAIL || require('../../config/keys').EDITOR_EMAIL
const path = require('path')
const { dateFormatter } = require('../../helpers/dateTimeFormatters')

// const dateHelper = model => {
//   let pubDate = (model.createdAt).toString()
//   let index = pubDate.indexOf(" (")
//   if(~index) pubDate = pubDate.substr(0, index)

//   return pubDate
// }


router.get('/unsubscribed', (req, res) => {
  res.status(200).render('pages/unsubscribe_success')
})


router.get("/rss.xml", async (req, res, next) => {
  // try {
  //   const posts = await Post.find({}, null, {sort: '-createdAt', limit: 10})
  //   const lastPostQuery = await Post.find({}, null, {sort: '-createdAt', limit: 1})
  //   const lastPost = lastPostQuery[0]

  //   let pubDate = (lastPost.createdAt).toString()
  //   let index = pubDate.indexOf(" (")
  //   if(~index) pubDate = pubDate.substr(0, index)
      
  //   let data = `<?xml version="1.0" encoding="UTF-8"?>`
  //   data += `<rss version="2.0">`
  //   data += `<channel>`
  //   data += `<title>Кошт</title>`
  //   data += `<link>http://kosht-clone.netlify.app</link>`
  //   data += `<description>Говоримо особисті фінанси</description>`
  //   data += `<pubDate>${dateFormatter(lastPost)}</pubDate>`
  //   data += `<managingEditor>${EDITOR_EMAIL}</managingEditor>`
  //   data += `<language>uk</language>`
  //   data += `<items>`
  //   for (let post of posts) {
  //     data += `<item> 
  //        <title><![CDATA[ ${post.title} ]]></title>
  //        <link>${API_URL}/${post.slug}</link>
  //        <description><![CDATA[ ${post.description} ]]></description>
  //        <pubDate>${dateFormatter(post)}</pubDate>
  //     </item>`
  //   }
  //   data += `</items>`
  //   data += `</channel>`
  //   data += `</rss>`
  
  //   res.header("Content-Type", "application/xml")
  //   res.status(200).send(data)
  // } catch (error) {
  //   console.log(error)
  //   return
  // }

  res.contentType("application/xml")
  // res.sendFile(path.join(__dirname, '../../', 'rss', 'rss-example.xml'))
  res.sendFile(path.join(__dirname, '../../', 'rss-file.xml'))
  console.log("Reached xml file!")
})

module.exports = router