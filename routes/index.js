const express = require('express');
const nodemailer = require('nodemailer');
const router  = express.Router();
const uploadCloud = require('../config/cloudinary.js');
const Cafe = require('../models/Cafe');





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

router.get('/main', (req, res, next) => {
  let mapboxAPIKey = process.env.MAPBOXTOKEN
  Cafe.find()
  .then (coffee => {
    let coffeeLocation = coffee.map (coffee => {
      return coffee.location.coordinates
    })
    console.log(coffeeLocation)
    res.render('main', {mapboxAPIKey, coffeeLocation});
  })
  
});


router.post('/main', (req, res, next)=> {
  let searchInput = req.body.search;



  res.render('message', {searchInput})
})




module.exports = router;
