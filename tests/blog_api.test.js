const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./supertest_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

const loginTestUser = async (user) => {
  const testUser = {
    username: user.username,
    password: user.password,
  }
  const response = await api.post('/api/login').send(testUser)
  return response.body.token
}

// Delete from the database, then populate using the bloglist in the helper
// Uses the test database, see utils/config.js
beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('get blogs', () => {
  const testUser = helper.initialUsers[0]
  test('blogs are returned as json', async () => {
    const authToken = 'Bearer ' + (await loginTestUser(testUser))

    await api
      .get('/api/blogs')
      .set('Authorization', authToken)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 10000)

  test('blogs all contain an id property', async () => {
    const authToken = 'Bearer ' + (await loginTestUser(testUser))

    const response = await api.get('/api/blogs').set('Authorization', authToken)

    for (let blog of response.body) {
      expect(blog.id).toBeDefined()
    }
  }, 10000)
})

describe('add blog', () => {
  const testUser = helper.initialUsers[0]
  test('a blog can be added', async () => {
    const authToken = 'Bearer ' + (await loginTestUser(testUser))

    const newBlog = helper.newBlog

    await api
      .post('/api/blogs')
      .set('Authorization', authToken)
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
    const authToken = 'Bearer ' + (await loginTestUser(testUser))

    const postedBlog = await api
      .post('/api/blogs')
      .set('Authorization', authToken)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    expect(postedBlog.body.likes).toEqual(0)
  }, 10000)

  test('a blog with a missing title property causes a 400 error', async () => {
    const newBlog = helper.newBlogMissingTitle
    const authToken = 'Bearer ' + (await loginTestUser(testUser))

    await api
      .post('/api/blogs')
      .set('Authorization', authToken)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  }, 10000)

  test('a blog with a missing url property causes a 400 error', async () => {
    const newBlog = helper.newBlogMissingUrl
    const authToken = 'Bearer ' + (await loginTestUser(testUser))

    await api
      .post('/api/blogs')
      .set('Authorization', authToken)
      .send(newBlog)
      .expect(400)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  }, 10000)
})

describe('delete blog', () => {
  const testUser = helper.initialUsers[0]
  test('a blog can be deleted', async () => {
    const authToken = 'Bearer ' + (await loginTestUser(testUser))

    const blogsAtStart = await helper.blogsInDb()
    const blog = blogsAtStart[0]

    await api.delete(`/api/blogs/${blog.id}`).set('Authorization', authToken).expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map((r) => r.title)
    expect(titles).not.toContainEqual(blog.title)
  }, 10000)
})

describe('blog updates', () => {
  const testUser = helper.initialUsers[0]
  test('a blog can have its number of likes updated, uses ids from random blogs', async () => {
    const authToken = 'Bearer ' + (await loginTestUser(testUser))

    const blogsAtStart = await helper.blogsInDb()
    const count = blogsAtStart.length

    // index of a random blog
    const index = Math.floor(count * Math.random())
    const blog = blogsAtStart[index]
    const id = blog.id

    // a random number of likes between 0 and 100
    const likes = Math.round(Math.random() * 100)
    blog.likes = likes

    await api.put(`/api/blogs/${id}`).set('Authorization', authToken).send(blog)
    const updatedBlog = await api.get(`/api/blogs/${id}`).set('Authorization', authToken)
    expect(updatedBlog.body.likes).toBe(blog.likes)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(count)
  }, 100000)

  test('a blog can have its title updated, uses ids from random blogs', async () => {
    const authToken = 'Bearer ' + (await loginTestUser(testUser))

    const blogsAtStart = await helper.blogsInDb()
    const count = blogsAtStart.length

    // index of a random blog
    const index = Math.floor(count * Math.random())
    const blog = blogsAtStart[index]
    const id = blog.id

    // a random title
    const title = 'random title ' + index * Math.random()
    blog.title = title

    await api.put(`/api/blogs/${id}`).send(blog).set('Authorization', authToken)
    const updatedBlog = await api.get(`/api/blogs/${id}`).set('Authorization', authToken)
    expect(updatedBlog.body.title).toBe(blog.title)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(count)
  }, 100000)
})

afterAll(async () => {
  await mongoose.connection.close()
})
