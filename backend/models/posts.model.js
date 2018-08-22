const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  title: {type: String, required: true},
  content: {type: String, required: true},
  imagePath: {type: String, required: true}
});

module.exports = mongoose.model('Post', postSchema);
