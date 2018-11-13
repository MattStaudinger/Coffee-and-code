const express = require('express');
const nodemailer = require('nodemailer');
const router  = express.Router();
const uploadCloud = require('../config/cloudinary.js');





router.get('/about', (req, res, next) => {
  res.render('about');
});

router.get('/video', (req, res, next) => {
  res.render('video');
});

router.post('/send-email', (req, res, next)=> {
  let { email, subject, message } = req.body;
  res.render('message', { email, subject, message})
})

router.get('/main', (req, res, next) => {
  let mapboxAPIKey = process.env.MAPBOXTOKEN
  res.render('main', {mapboxAPIKey});
});


router.post('/main', (req, res, next)=> {
  let searchInput = req.body.search;

  

  res.render('message', {searchInput})
})




module.exports = router;
