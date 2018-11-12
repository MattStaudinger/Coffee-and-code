const express = require("express");
const passport = require('passport');
const nodemailer = require('nodemailer');
const router = express.Router();
const User = require("../models/User");
const randomstring = require('randomstring');
const uploadCloud = require('../config/cloudinary.js');

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Ensure Authenticated
function ensureAuthenticated(req, res, next) {
  if (req.user) {
    return next();
  } else {
    res.redirect('/auth/login')
  }
}

// All the routes
router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", uploadCloud.single('photo'), (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const imgPath = req.file.url;
  const imgName = req.file.originalname;
  const confirmationCode = randomstring.generate(30);

  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate username, email and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashPass,
      confirmationCode,
      imgPath,
      imgName,
    });

    newUser.save()
    .then(() => {

      let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'charlottetreuse42@gmail.com',
          pass: 'chartreuse' 
        }
      });  
      
      transporter.sendMail({
        from: '"Your best worst video" <bestworst@video.com>',
        to: email, //the email entered in the form
        subject: 'Please confirm your Email', 
        html: `Hi ${username}, please validate your account by clicking <a href="http://localhost:3080/auth/confirm/${confirmationCode}">here</a>. 
        If the link doesn't work, please go here: http://localhost:3080/auth/confirm/.`
      })
      .then(info => console.log(info))
      .catch(error => console.log(error))

      res.redirect("/");
    })
  .catch(err => {
    console.log(err)
    res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/confirm/:confirmCode", (req, res, next) => {
  let confirmationCode = req.params.confirmCode
  // Find the first user where confirmationCode = req.params.confirmationCode
  User.findOneAndUpdate({confirmationCode}, {status: 'Active'})
  .then(user => {
      if (user){
        // req.login makes the user login automatically
        req.login(user, () => {
         res.redirect('/auth/profile')
       })
    } 
    else {
      next("No user found")
    }
  })
})


router.get('/profile', ensureAuthenticated, (req, res) => {
  User.findOne({ username: req.user.username })
  .then(username => {
    console.log(username)
    res.render('auth/my-profile', {username});
  })
  .catch(err => {
    console.log(err)
    res.render('auth/login', { message: "Please log in" });
  })
});


router.get('/profile/edit', ensureAuthenticated, (req, res, next) => { 
  res.render('auth/edit-profile');
});

router.post('/profile/edit', ensureAuthenticated, (req, res, next) => { 
  User.findByIdAndUpdate(req.params.id, {
    about: req.body.about,
    imgPath: req.body.description,
  })
    .then(username => {
      res.render('auth/my-profile', {username});
    });
})

module.exports = router;