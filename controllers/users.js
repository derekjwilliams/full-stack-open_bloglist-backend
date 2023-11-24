const bcrypt = require('bcrypt')
const User = require('../models/user')
const usersRouter = require('express').Router()

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const {username, name, password} = request.body
  if (!password) {
    return response.status(400).json({
      error: 'password is required'
    })
  }
  if (password.length < 3) {
    return response.status(400).json({
      error: 'password is too short, must be at least 3 characters long'
    })
  }
  const saltRounds = 12
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter
