const mongoose = require('mongoose');

const tabSchema = new mongoose.Schema({
  name: String,
  content: String,
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  permissions: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      canEdit: Boolean,
    },
  ],
});

module.exports = mongoose.model('Tab', tabSchema);
