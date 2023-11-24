const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./supertest_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

// Delete users from the database, then populate using the user list in the helper
// Uses the test database, see utils/config.js, package.json, and .env
beforeEach(async () => {
  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)
})

describe('invalid users do not get added', () => {
  test(
    'a user with a missing username property is not added',
    async () => {
      const newUser = helper.newUserMissingUsername

      const result = await api.post('/api/users').send(newUser).expect(400)

      expect(result.body.error).toContain('`username` is required.')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
    },
    helper.Timeout
  )

  test(
    'a user with a missing password property is not added',
    async () => {
      const newUser = helper.newUserMissingPassword

      const result = await api.post('/api/users').send(newUser).expect(400)

      expect(result.body.error).toContain('password is required')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
    },
    helper.Timeout
  )

  test(
    'a user with a too short username is not added',
    async () => {
      const newUser = helper.newUserTooShortUsername

      const result = await api.post('/api/users').send(newUser).expect(400)

      expect(result.body.error).toContain('username')
      expect(result.body.error).toContain(
        'shorter than the minimum allowed length (3)'
      )

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
    },
    helper.Timeout
  )

  test(
    'a user with a too short password is not added',
    async () => {
      const newUser = helper.newUserTooShortPassword

      const result = await api.post('/api/users').send(newUser).expect(400)

      expect(result.body.error).toContain('password is too short')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
    },
    helper.Timeout
  )
})

describe('get users', () => {
  test(
    'users are returned as json',
    async () => {
      await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    },
    helper.Timeout
  )

  test(
    'correct number of users are returned',
    async () => {
      const response = await api.get('/api/users').expect(200)

      expect(response.body).toHaveLength(helper.initialUsers.length)
    },
    helper.Timeout
  )

  test(
    'users are returned as json',
    async () => {
      await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    },
    helper.Timeout
  )

  test(
    'users all contain a username property',
    async () => {
      const response = await api.get('/api/users')
      for (let user of response.body) {
        expect(user.username).toBeDefined()
      }
    },
    helper.Timeout
  )
})

afterAll(async () => {
  await mongoose.connection.close()
})