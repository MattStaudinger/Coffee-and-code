const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const videoSchema = new Schema({
  comments: String,
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Video = mongoose.model('Video', videoSchema);
module.exports = Video;
