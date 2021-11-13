const RSS = require('rss')
const fs = require('fs')
const path = require('path')
const Post = require('../mongoose/models/Post')
const { dateFormatter } = require('./dateTimeFormatters')
const SITE_URL = process.env.SITE_URL || require('../config/keys').SITE_URL
const API_URL = process.env.API_URL || require('../config/keys').API_URL
const EDITOR_EMAIL = process.env.EDITOR_EMAIL || require('../config/keys').EDITOR_EMAIL

const getRSS = async () => {

  try {
    const posts = await Post.find({}, null, {sort: '-createdAt', limit: 10})
    const lastPostQuery = await Post.find({}, null, {sort: '-createdAt', limit: 1})
    const lastPost = lastPostQuery[0]

    /* lets create an rss feed */
    let feed = new RSS({
      title: 'Кошт',
      description: 'Говоримо про особисті фінанси',
      feed_url: `${API_URL}/rss.xml`,
      site_url: SITE_URL,
      language: 'uk',
      managingEditor: EDITOR_EMAIL,
      image: {
        url: path.join(__dirname, '../', 'public', 'icon.png'),
        link: SITE_URL,
        title: 'Кошт',
        width: 72,
        height: 72
      }
    })

    /* loop over data and add to feed */
    for (let post of posts) {
      feed.item({
        title: post.title,
        description: post.description,
        pubdate: dateFormatter(post),
        url: `${SITE_URL}/${post.slug}` // link to the item
      })
    }

    // cache the xml to send to clients
    fs.writeFile('rss-file.xml', feed.xml(), err => {
    if (err) {
      console.log(err)
      return
    }
    console.log("XML RSS file has been updated")
    })
    
  } catch (error) {
    console.log(error)
    return
  }
  
}

module.exports = getRSS