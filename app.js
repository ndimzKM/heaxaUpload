const path = require('path')
const express = require('express');
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const File = require('./models/file')

mongoose.connect('mongodb://localhost/hexaupload')

let db = mongoose.connection

db.on('error', (err) => console.log(err))
db.once('open', () => console.log('Connected to database'))

const app = express()

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'shared')))
// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());


app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());



app.get('/', (req,res) => {
  res.render('index',{
    user:req.user
  })
  console.log(req.user)
});


//Handle routes
let fileRoute = require('./routes/files')
let userRoute = require('./routes/users')
app.use('/user', userRoute);
app.use('/files', fileRoute)

function checkAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next()
  }else{
    res.redirect('/user/login')
  }
}

//Start Server
let PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))