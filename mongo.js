const mongoose = require('mongoose')
require('dotenv').config()

// const PORT = process.env.PORT || 3001

const MONGODB_URI = process.env.MONGODB_URI_PREFIX + process.env.MONGODB_PASSWORD + process.env.MONGODB_URI_SUFFIX
// const MONGODB_URI = process.env.MONGODB_URI_PREFIX + process.env.MONGODB_PASSWORD + process.env.MONGODB_URI_SUFFIX
// const url =
// `mongodb://127.0.0.1:27017/bloglist`
  
mongoose.set('strictQuery',false)
mongoose.connect(MONGODB_URI)

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

Blog.find({}).then(result => {
  result.forEach(blog => {
    console.log(blog)
  })
  mongoose.connection.close()
})

const blog = new Blog({
  title: 'PostGraphile V5 public beta — get involved!',
  author: 'Graphile Team',
  url: 'https://www.graphile.org/news/20230803-postgraphile-v5-beta/',
  likes: 0
})

blog.save().then(() => {
  console.log('blog entry saved!')
  mongoose.connection.close()
})