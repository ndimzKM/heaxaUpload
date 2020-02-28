const mongoose = require('mongoose');

const fileSchema = mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  owner:{
    type:String,
    required:true
  },
  time:{
    type: String,
    required: true
  },
  type:{
    type:String,
    required:true
  },
  othername:{
    type:String,
    required:true
  }
})

const File = module.exports = mongoose.model('File', fileSchema)