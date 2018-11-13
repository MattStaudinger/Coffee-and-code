const express = require('express');
const nodemailer = require('nodemailer');
const router  = express.Router();
const uploadCloud = require('../config/cloudinary.js');
const {google} = require('googleapis');

/* GET home page */
router.get('/', (req, res, next) => {
        res.render('index');
      });

router.get('/about', (req, res, next) => {
  res.render('about');
});

router.post('/send-email', (req, res, next)=> {
  let { email, subject, message } = req.body;
  res.render('message', { email, subject, message})
})

module.exports = router;
