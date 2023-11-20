const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('dist')) // for integrating front end
app.use(express.json())
app.use(middleware.requestLogger) // important, this needs to be before the router

app.use('/api/blogs', blogsRouter) // for routing

// important, these need to be at the end
app.use(middleware.unknownEndpoint)
app.use(middleware.requestErrorHandler)

module.exports = app
