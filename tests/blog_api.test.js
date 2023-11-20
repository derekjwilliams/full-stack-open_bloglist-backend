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
  await Blog.insertMany(helper.initialBlogs)
})

describe('get blogs', () => {
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
})

describe('add blog', () => {
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
  }, 10000)

  test('a blog with a missing likes property is added with the likes property set to zero', async () => {
    const newBlog = helper.newBlogMissingLikes

    const postedBlog = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    expect(postedBlog.body.likes).toEqual(0)
  }, 10000)

  test('a blog with a missing title property causes a 400 error', async () => {
    const newBlog = helper.newBlogMissingTitle

    const postedBlog = await api.post('/api/blogs').send(newBlog).expect(400)
  }, 10000)

  test('a blog with a missing url property causes a 400 error', async () => {
    const newBlog = helper.newBlogMissingUrl

    const postedBlog = await api.post('/api/blogs').send(newBlog).expect(400)
  }, 10000)
})

describe('delete blog', () => {
  test('a blog can be deleted', async () => {
    const startBlogs = await helper.blogsInDb()
    const blog = startBlogs[0]
  
    await api
      .delete(`/api/blogs/${blog.id}`)
      .expect(204)
  
    const endBlogs = await helper.blogsInDb()
  
    expect(endBlogs).toHaveLength(
      helper.initialBlogs.length - 1
    )
  
    const titles = endBlogs.map(r => r.title)
  
    expect(titles).not.toContainEqual(blog.title)
  })
  
})
describe('update blog', () => {
})

afterAll(async () => {
  await mongoose.connection.close()
})
