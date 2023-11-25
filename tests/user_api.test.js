const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./supertest_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const User = require('../models/user')

const loginTestUser = async (user) => {
  const testUser = {
    username: user.username,
    password: user.password,
  }
  const response = await api.post('/api/login').send(testUser)
  return response.body.token
}
// Delete users from the database, then populate using the user list in the helper
// Uses the test database, see utils/config.js, package.json, and .env
beforeEach(async () => {
  await User.deleteMany({})

  const oneUser = helper.initialUsers[0] // only one user to start
  const passwordHash = await bcrypt.hash(oneUser.password, 10)
  const user = new User({username: oneUser.username, passwordHash})

  await user.save()

  // await User.insertMany(helper.initialUsers)
})

describe('invalid users do not get added', () => {
  const testUser = helper.initialUsers[0]
  test(
    'a user with a missing username property is not added',
    async () => {
      const authToken = 'Bearer ' + (await loginTestUser(testUser))

      const usersAtStart = await helper.usersInDb()
      const newUser = helper.newUserMissingUsername

      const result = await api
        .post('/api/users')
        .send(newUser)
        .set('Authorization', authToken)
        .expect(400)

      expect(result.body.error).toContain('`username` is required.')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    },
    helper.Timeout
  )

  test(
    'a user with a missing password property is not added',
    async () => {
      const authToken = 'Bearer ' + (await loginTestUser(testUser))

      const usersAtStart = await helper.usersInDb()
      const newUser = helper.newUserMissingPassword

      const result = await api
        .post('/api/users')
        .set('Authorization', authToken)
        .send(newUser)
        .expect(400)

      expect(result.body.error).toContain('password is required')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    },
    helper.Timeout
  )

  test(
    'a user with a too short username is not added',
    async () => {
      const authToken = 'Bearer ' + (await loginTestUser(testUser))

      const usersAtStart = await helper.usersInDb()
      const newUser = helper.newUserTooShortUsername

      const result = await api
        .post('/api/users')
        .set('Authorization', authToken)
        .send(newUser)
        .expect(400)

      expect(result.body.error).toContain('username')
      expect(result.body.error).toContain(
        'shorter than the minimum allowed length (3)'
      )

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    },
    helper.Timeout
  )

  test(
    'a user with a too short password is not added',
    async () => {
      const authToken = 'Bearer ' + (await loginTestUser(testUser))

      const usersAtStart = await helper.usersInDb()

      const newUser = helper.newUserTooShortPassword

      const result = await api
        .post('/api/users')
        .set('Authorization', authToken)
        .send(newUser)
        .expect(400)

      expect(result.body.error).toContain('password is too short')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    },
    helper.Timeout
  )
  test('a user with a duplicate name is not added', async () => {
    const authToken = 'Bearer ' + (await loginTestUser(testUser))

    const usersAtStart = await helper.usersInDb()

    const newUser = helper.newUserDuplicateUsername

    const result = await api
      .post('/api/users')
      .set('Authorization', authToken)
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})

describe('get users', () => {
  const testUser = helper.initialUsers[0]
  test(
    'users are returned as json',
    async () => {
      const authToken = 'Bearer ' + (await loginTestUser(testUser))

      await api
        .get('/api/users')
        .set('Authorization', authToken)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    },
    helper.Timeout
  )

  test(
    'correct number of users are returned',
    async () => {
      const authToken = 'Bearer ' + (await loginTestUser(testUser))

      const response = await api
        .get('/api/users')
        .set('Authorization', authToken)
        .expect(200)

      expect(response.body).toHaveLength(helper.initialUsers.length)
    },
    helper.Timeout
  )

  test(
    'users all contain a username property',
    async () => {
      const authToken = 'Bearer ' + (await loginTestUser(testUser))

      const response = await api
        .get('/api/users')
        .set('Authorization', authToken)
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
