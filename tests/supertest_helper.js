const Blog = require('../models/blog')
const User = require('../models/user')
const Timeout = 10000

const initialUsers = [
  {
    username: 'ringo',
    password: 'RSsudAY8XWF8sJol20t2rjyT',
    name: 'Ringo Starr',
  },
]
const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  },
]

const newBlog = {
  title: 'PostGraphile V5 public beta — get involved!',
  author: 'Graphile Team',
  url: 'https://www.graphile.org/news/20230803-postgraphile-v5-beta/',
  likes: 0,
}

const newBlogMissingLikes = {
  title: 'PostGraphile V5 public beta — get involved!',
  author: 'Graphile Team',
  url: 'https://www.graphile.org/news/20230803-postgraphile-v5-beta/',
}

const newBlogMissingTitle = {
  author: 'Graphile Team',
  url: 'https://www.graphile.org/news/20230803-postgraphile-v5-beta/',
  likes: 0,
}

const newBlogMissingUrl = {
  title: 'PostGraphile V5 public beta — get involved!',
  author: 'Graphile Team',
  likes: 0,
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

// user helpers

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

const newUserDuplicateUsername =   {
  username: 'ringo',
  password: 'RSsudAY8XWF8sJol20t2rjyT',
  name: 'Ringo Starr',
}


const newUserTooShortUsername = {
  username: 'T',
  password: 'RSsudAY8XWF8sJol20t2rjyTTina',
  name: 'Tina Weymouth',
}

const newUserTooShortPassword = {
  username: 'Tina',
  password: 'RS',
  name: 'Tina Weymouth',
}

const newUserMissingUsername = {
  password: 'RSsudAY8XWF8sJol20t2rjyTTina',
  name: 'Tina Weymouth',
}

const newUserMissingPassword = {
  username: 'Tina',
  name: 'Tina Weymouth',
}


module.exports = {
  Timeout,
  initialBlogs,
  newBlog,
  blogsInDb,
  newBlogMissingLikes,
  newBlogMissingUrl,
  newBlogMissingTitle,
  initialUsers,
  usersInDb,
  newUserMissingUsername,
  newUserMissingPassword,
  newUserTooShortUsername,
  newUserTooShortPassword,
  newUserDuplicateUsername
}
