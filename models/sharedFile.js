const mongoose = require('mongoose');

const shareFileSchema = mongoose.Schema({
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

let SharedFile = module.exports = mongoose.model('SharedFile', shareFileSchema)