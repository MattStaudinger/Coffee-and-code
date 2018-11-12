const express = require('express');
const nodemailer = require('nodemailer');
const router  = express.Router();
const uploadCloud = require('../config/cloudinary.js');
const {google} = require('googleapis');
const youtube = google.youtube({
   version: 'v3',
   auth: process.env.YOUTUBE_API_KEY
});







/* GET home page */
router.get('/', (req, res, next) => {
        res.render('index');
      });

router.get('/query', (req, res, next) => {
  youtube.search.list({
    maxResults: "5",
      part: 'snippet',
      q: 'Sharks',
      type: "video",
      videoEmbeddable: "true"
    }, function (err, data) {
      if (err) {
        console.error('Error: ' + err);
      }
      if (data) {
        console.log(data.data.items[0])
        res.redirect('/');
      }
    });
});

router.get('/about', (req, res, next) => {
  res.render('about');
});

router.post('/send-email', (req, res, next)=> {
  let { email, subject, message } = req.body;
  res.render('message', { email, subject, message})
})

module.exports = router;
