const getSlug = require('speakingurl')

const makeSlugEn = title => getSlug(`${title}`.toString(), {truncate: 100, lang: 'en', separator: '-'})
const makeSlugUa = title => getSlug(`${title}`.toString(), {truncate: 100, lang: 'ua', separator: '-'})

module.exports = {makeSlugEn, makeSlugUa}