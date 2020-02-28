const express = require('express')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const router = express.Router()

const User = require('../models/user')

router.get('/login', (req,res) => {
  res.render('login')
})

router.get('/register', (req,res) => {
  res.render('register')
})

//Register Process
router.post('/register', (req,res) => {
  let newUser = new User({
    name: req.body.fname,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
  bcrypt.genSalt(10, (err,salt) => {
    bcrypt.hash(newUser.password,salt, (err,hash) => {
      if(err){
        console.log(err)
      }
      newUser.password = hash
      newUser.save((err,success) => {
        if(err){
          console.log(err)
        }else{
          res.redirect('/user/login')
        }
      })
    })
  })
})

// Login Process
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect:'/files/drive',
    failureRedirect:'/user/login',
    failureFlash: true
  })(req, res, next);
});

// logout
router.post('/logout',checkAuthenticated, function(req, res){
  req.logout();
  //req.flash('success', 'You are logged out');
  res.redirect('/user/login');
});

function checkAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next()
  }else{
    res.redirect('/user/login')
  }
}

module.exports = router;