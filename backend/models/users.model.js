const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const usersSchema = mongoose.Schema({
  name: {type: String, required: true},
  dob: {type: String, require: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  phone: {type: String, required: true},
  imagePath: {type: String, required: true},
  tagline: {type: String, required: true},
  content: {type: String, required: true}
});

usersSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Users', usersSchema);
