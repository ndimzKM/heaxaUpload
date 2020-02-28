const express = require('express')
const multer = require('multer')
const moment = require('moment')
const fs = require('fs')
const File = require('../models/file')
const router = express.Router()

const SharedFile = require('../models/sharedFile')

const storage = multer.diskStorage({
  destination: function(req,file, cb){
      cb(null, './uploads');
  },
  filename: function(req,file,cb){
      cb(null, new Date().toISOString() + file.originalname);
  }
})

const fileFilter = (req,file,cb) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
      //accept file
      cb(null, true)
  }else{
      //reject a file
      cb(null, false)
  }
}

const upload = multer({
  storage:storage,
  limits:{
      fileSize: 1024 * 1024 * 3
  },
  fileFilter: fileFilter
});



router.get('/drive',checkAuthenticated, (req,res) => {
  File.find({owner:req.user._id}, (err,files) => {
    res.render('drive', {
      files:files,
      user:req.user.name
    })
  })
})

router.get('/shared',checkAuthenticated ,(req,res) => {
  SharedFile.find({owner:req.user._id}, (err,files) => {
    if(err) throw err;
    else{
      res.render('drive', {
        files:files,
        user:req.user.name
      })
    }
  })
})

router.get('/public', checkAuthenticated,(req,res) => {
  SharedFile.find({}, (err,files) => {
    res.render('drive', {
      files:files,
      user:req.user.name
    })
  })
})

router.post('/upload',checkAuthenticated, upload.single('fileName'), (req,res) => {
  const newFile = new File({
    name: req.file.originalname,
    owner: req.user._id,
    time: moment().format('llll'),
    type: req.file.mimetype.split('/')[0],
    othername: req.file.filename
  })
  newFile.save((err,result) => {
    if(err){
      console.log(err)
    }else{
      console.log(result)
      res.redirect('/files/drive')
    }
  })
})

router.post('/:id/share', checkAuthenticated,(req,res) => {
  let query = {_id:req.params.id}
  File.findOne(query, (err,file) => {
    if(err){
      console.log(err)
    }else{
      let newFile = new SharedFile({
        name: file.name,
        owner:req.user._id,
        time: moment().format('llll'),
        type: file.type,
        othername: file.othername
      });
      let fullname = `./uploads/${newFile.othername}`;
      fs.realpath(fullname, (err,path) => {
        if(err){
          console.log(err)
        }else{
          //console.log(path)
          fs.copyFile(path, '/home/thacondor/SeriousProjects/hexaUpload/shared/'+newFile.othername,(err) => {
            if(err){
              console.log(err)
            }else{
              console.log('File copied successfulyy succesfully')
              //res.redirect('/files/drive')
            }
          })
        }
      })
      newFile.save((err,success) => {
        if(err){
          console.log(err)
        }else{
          console.log(success)
          res.redirect('/files/drive')
        }
      })
    }
  })
})

router.post('/:id/delete', checkAuthenticated, (req,res) => {
  
  File.find({owner:req.user._id}, (err,files) => {
    //console.log(files[0])
    File.remove({_id:req.params.id}, (err,success) => {
      if(err){
        console.log(err)
        res.redirect('/')
      }else{
        console.log(success)
        //res.redirect('/files/drive')
      }
    })
    for(let i = 0; i < files.length; i++){
      if(files[i].id === req.params.id){
        console.log(files[i].othername)
        let fullname = `./uploads/${files[i].othername}`;
        console.log(fullname)
        fs.realpath(fullname, (err,path) => {
          if(err){
            console.log(err)
          }else{
            //console.log(path)
            fs.unlink(path, (err) => {
              if(err){
                console.log(err)
              }else{
                console.log('Path deleted succesfully')
                res.redirect('/files/drive')
              }
            })
          }
        })
      }else{
        console.log("something's not right")
      }
    }
  })
})

function checkAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next()
  }else{
    res.redirect('/user/login')
  }
}

module.exports = router;