const express = require('express');
const nodemailer = require('nodemailer');
const router  = express.Router();
const uploadCloud = require('../config/cloudinary.js');

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

// router.post('edit-profile', uploadCloud.single('photo'), (req, res, next) => {
//   const imgPath = req.file.url;
//   const imgName = req.file.originalname;
//   const newUser = new User({username, descriptaboution, imgPath, imgName})
//   newMovie.save()
//   .then(user => {
//     res.redirect('/');
//   })
//   .catch(error => {
//     console.log(error);
//   })
// });

module.exports = router;
