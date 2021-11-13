const dateFormatter = model => {
  let pubDate = (model.createdAt).toString()
  let index = pubDate.indexOf(" (")
  if(~index) pubDate = pubDate.substr(0, index)

  return pubDate
}

module.exports = { dateFormatter }