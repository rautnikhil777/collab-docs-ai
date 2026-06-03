const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

const User = mongoose.model('User', UserSchema);

module.exports = { User };

