//jshint esversion:6
require('dotenv').config();
const express = require('express');
const app =express();
const bodyParser= require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const db = mongoose.connection;
const encrypt=require('mongoose-encryption');
mongoose.connect('mongodb://localhost:27017/SecretDB', {useNewUrlParser: true, useUnifiedTopology: true});



db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('we are connected');
});

const userSchema =new mongoose.Schema({
  email:String,
  password:String
});
const secret= process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret,encryptedFields: ['password'] });

const User=new mongoose.model('User',userSchema);

app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
  res.render('home');
});
app.get('/login',(req,res)=>{
  res.render('login');
});
app.get('/register',(req,res)=>{
  res.render('register');
});


app.post('/register',(req,res)=>{
  const user =new User({
    email:req.body.username,
    password:req.body.password
  });
  user.save((err)=>{
    if(!err){
      res.render('secrets');
    }else{
      console.log(err);
    }
  });
});
const hehe= 'asdjm';

app.post('/login',(req,res)=>{
  const userName= req.body.username;
  const password= req.body.password;
  User.findOne({email:userName},(err,foundUser)=>{
    if(password===foundUser.password){
      res.render('secrets');
    }
  });
});

app.listen(3000,()=>{
  console.log('server is running');
});
