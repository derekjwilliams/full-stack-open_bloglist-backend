const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    unique: true
  },
  passwordHash: String,
  name: String,
})

userSchema.set('toJSON', {
  transform: (doc, user) => {
    user.id = user._id.toString()
    delete user._id
    delete user.__v
    delete user.passwordHash
  },
})

const User = mongoose.model('User', userSchema)

module.exports = User
