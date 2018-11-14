const express = require('express');
const nodemailer = require('nodemailer');
const router  = express.Router();
const uploadCloud = require('../config/cloudinary.js');
const Cafe = require('../models/Cafe');

function ensureAuthenticated(req, res, next) {
  if (req.user) {
    return next();
  } else {
    res.redirect('/auth/login')
  }
}

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
    let coffeeName = coffee.map (coffee => {
      return coffee.name
    })
    let coffeeId = coffee.map (coffee => {
      return coffee._id
    })
    console.log(coffeeLocation)
    res.render('main', {mapboxAPIKey, coffeeLocation, coffeeName, coffeeId});
  })
  
});

router.post('/main', (req, res, next)=> {
  let searchInput = req.body.search;
  res.render('message', {searchInput})
})


router.get('/cafe/:id', (req, res, next) => {
let id = req.params.id

Cafe.findById(id)
// .populate("_creator")
  .then (cafe => {
    res.render("cafe", {cafe})
})
})

router.get('/auth/cafe/:id/add-comment', ensureAuthenticated, (req, res, next) => {
  let id = req.params.id


Cafe.findById(id)
  .then (cafe => {
    res.render("add-comment", {cafe})
})
})


router.post('/cafe/:id', (req, res, next)=> {
  let id = req.params.id;
  console.log("Test", req.body.comment)
  let comment = req.body.comment
  Cafe.findByIdAndUpdate(id, {comments: {
    content: comment,
    _creator: req.user._id,
    createdAt: Date.now()
  }
})

  .then (cafe => {
    res.redirect('/cafe/'+id)
  })
});


module.exports = router;
