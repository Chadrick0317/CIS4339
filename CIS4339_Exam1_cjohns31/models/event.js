const uuid = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let studentSchema = new Schema({
    //_id: Number,
    _id: { type: String, default: uuid.v1 },
    firstName: {
      type: String
    },
    lastName: {
        type: String
    },
    email: {
      type: String
    },
    phoneNumber: {
      type: Number
    },
    studentID: {
      type: Number,
      required: true
    }
  }, {
    collection: 'students'
});

module.exports = mongoose.model('student', studentSchema)

//versionKey: false 



