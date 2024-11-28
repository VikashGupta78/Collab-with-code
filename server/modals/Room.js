const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomId: String,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Room', roomSchema);
