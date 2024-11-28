const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  name: String,
  profilePicture: String,
});

module.exports = mongoose.model('User', userSchema);
