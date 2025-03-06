// User.js
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    trim: true,
    set: value => value.trim()
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Invalid email format'
    },
    lowercase: true,
    set: value => value.trim().toLowerCase()
  },
  phone: {
    type: String,
    required: true,
    unique: true 
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    set: value => value.trim()
  },
  resetPasswordOTP: {
    type: String,
    set: value => value === null || value === undefined ? null : value.trim()
  },
  resetPasswordExpire: {
    type: Date,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  refreshToken: {
    type: String,
    set: value => value === null || value === undefined ? null : value.trim()
  }
}, { timestamps: true });

// UserSchema.pre('save', async function(next) {
//   if (this.isModified('password')) {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//   }
//   next();
// });

module.exports = mongoose.model('User', UserSchema);