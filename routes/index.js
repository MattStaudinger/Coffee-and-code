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
  console.log(req.user)
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
let mapboxAPIKey = process.env.MAPBOXTOKEN


Cafe.findById(id)
//  .populate({
//    path: "comments",
//    populate: {path: "_creator"}
//  })
  .populate("comments._creator")
  .then (cafe => {
    console.log(cafe.comments)
    let coffeeLocation = cafe.location.coordinates
    res.render("cafe", {cafe, mapboxAPIKey, coffeeLocation})
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
  Cafe.findByIdAndUpdate(id, {$push: {comments: {
    content: comment,
    _creator: req.user._id,
    createdAt: Date.now()
  }}
})

  .then (cafe => {
    res.redirect('/cafe/'+id)
  })
});


router.get('/cafe/:id/edit-cafe', ensureAuthenticated, (req, res, next) => { 
  
  let id = req.params.id

  Cafe.findById(id)
  .then (cafe => {
    res.render("auth/edit-cafe", {cafe})
})
});

router.post('/cafe/:id/edit', ensureAuthenticated, uploadCloud.single('photo'), (req, res, next) => {
let id = req.params.id;

let openingHours = {
	// type: 'Hours',
	hours: [req.body.start, req.body.end]
};
  
let address = {
	// type: 'Address',
  address: [req.body.street, req.body.town]
};

if (req.body.wifi === 'no'){
  req.body.wifi = false
} else {
  req.body.wifi = true
}
if (req.body.powerSocket === 'no'){
  req.body.powerSocket = false
} else {
  req.body.powerSocket = true
}

Cafe.findByIdAndUpdate(id, {
  address: address,
  openingHours: openingHours,
  Wifi: req.body.wifi,
  powerSockets: req.body.powerSocket,
  imgPath : req.file.url
})


.then (cafe => {
    res.redirect('/cafe/'+id)
  })
});


module.exports = router;
