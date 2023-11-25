const logger = require('./logger')
const { Error } = require('mongoose')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('------------------------')
  next() // call next in middleware chain
}

const requestErrorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === Error.CastError.name) {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === Error.ValidationError.name) {
    return response.status(400).json({ error: error.message })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: error.message })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }
  next(error)
}

const unknownEndpoint = (request, response) => {
  logger.error('unknown api endpoint:', request.originalUrl)
  response.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  requestErrorHandler
}