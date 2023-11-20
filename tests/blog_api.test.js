const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./supertest_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

// Delete from the database, then populate using the bloglist in the helper
// Uses the test database, see utils/config.js
beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test('a blog can be added', async () => {
  const newBlog = helper.newBlog

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const title = blogsAtEnd.map((r) => r.title)
  expect(title).toContain(newBlog.title)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 10000)

test('blogs all contain an id property', async () => {
  const response = await api.get('/api/blogs')
  for (let blog of response.body) {
    expect(blog.id).toBeDefined()
  }
}, 10000)

afterAll(async () => {
  await mongoose.connection.close()
})
