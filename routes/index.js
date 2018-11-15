const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const uploadCloud = require("../config/cloudinary.js");
const Cafe = require("../models/Cafe");

function ensureAuthenticated(req, res, next) {
  if (req.user) {
    return next();
  } else {
    res.redirect("/auth/login");
  }
}

// Check roles
function checkRole(req, res, next) {
  if (req.user.role === "Admin" || req.user.role === "Creator") {
    next();
  } else {
    res.render("auth/notauthorized");
  }
}

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/about", (req, res, next) => {
  res.render("about");
});

router.post("/send-email", (req, res, next) => {
  let { email, subject, message } = req.body;
  res.render("message", { email, subject, message });
});

router.get("/main", (req, res, next) => {
  console.log(req.user);
  let mapboxAPIKey = process.env.MAPBOXTOKEN;
  Cafe.find().then(coffee => {
    let coffeeLocation = coffee.map(coffee => {
      return coffee.location.coordinates;
    });
    let coffeeName = coffee.map(coffee => {
      return coffee.name;
    });
    let coffeeId = coffee.map(coffee => {
      return coffee._id;
    });
    
    console.log(coffeeLocation);
    res.render("main", { mapboxAPIKey, coffeeLocation, coffeeName, coffeeId });
  });
});

router.post("/main", (req, res, next) => {
  let searchInput = req.body.search;
  res.render("message", { searchInput });
});

router.get("/cafe/:id", (req, res, next) => {
  let id = req.params.id;
  let mapboxAPIKey = process.env.MAPBOXTOKEN;

  Cafe.findById(id)
    //  .populate({
    //    path: "comments",
    //    populate: {path: "_creator"}
    //  })
    .populate("comments._creator")
    .then(cafe => {
      let coffeeComments = cafe.comments.reverse();
      let coffeeLocation = cafe.location.coordinates;
      res.render("cafe", { cafe, mapboxAPIKey, coffeeLocation, coffeeComments });
    });
});

router.get(
  "/auth/cafe/:id/add-comment",
  ensureAuthenticated,
  (req, res, next) => {
  let mapboxAPIKey = process.env.MAPBOXTOKEN;
    let id = req.params.id;
    Cafe.findById(id).then(cafe => {
      let coffeeLocation = cafe.location.coordinates;
      res.render("add-comment", { cafe, coffeeLocation, mapboxAPIKey });
    });
  }
);

router.post("/cafe/:id", (req, res, next) => {
  let id = req.params.id;
  console.log("Test", req.body.comment);
  let comment = req.body.comment;
  Cafe.findByIdAndUpdate(id, {
    $push: {
      comments: {
        content: comment,
        _creator: req.user._id,
        createdAt: Date.now()
      }
    }
  })
  .then(cafe => {
    res.redirect("/cafe/" + id);
  });
});

router.get("/cafe/:id/edit-cafe", ensureAuthenticated, (req, res, next) => {
  let mapboxAPIKey = process.env.MAPBOXTOKEN;
  let id = req.params.id;

  Cafe.findById(id).then(cafe => {
    let coffeeLocationLat = cafe.location.coordinates[0]
    let coffeeLocationLng = cafe.location.coordinates[1]
    console.log("Loc", coffeeLocationLat)
    res.render("auth/edit-cafe", { cafe, mapboxAPIKey, coffeeLocationLat, coffeeLocationLng });
  });
});

router.post(
  "/cafe/:id/edit",
  ensureAuthenticated,
  uploadCloud.single("photo"),
  (req, res, next) => {
    let id = req.params.id;
    let mapboxAPIKey = process.env.MAPBOXTOKEN;
    let openingHours = [req.body.start, req.body.end];
    let address = req.body.address;
    let file;

    
    // Cafe.findById(id).then(cafe => {
    //   if (!req.file && !cafe.imgPath)
    //   console.log("Test 1")
    //   res.render("auth/edit-cafe", {
    //     error: "Fill out all forms",
    //     mapboxAPIKey,
    //     cafe
    //   })
    //   return;
    // })
    if (!req.file) {file = req.user.imgPath} else {file = req.file.url}


    if (
      req.body.name === "" ||
      req.body.latitude === "" ||
      req.body.longitude === ""
    ) {
      Cafe.findById(id).then(cafe => {
      console.log(req.body.latitude)

        res.render("auth/edit-cafe", {
          error: "Fill out all forms",
          mapboxAPIKey,
          cafe
        });
      });
    } else {
      let location = {
        type: "Point",
        coordinates: [req.body.latitude, req.body.longitude]
      };
      console.log(address)

      if (req.body.wifi === undefined) req.body.wifi = false;
      else req.body.wifi = true;
      if (req.body.powerSocket === undefined) req.body.powerSocket = false;
      else req.body.powerSocket = true;

      Cafe.findByIdAndUpdate(id, {
        address: address,
        location: location,
        openingHours: openingHours,
        Wifi: req.body.wifi,
        powerSockets: req.body.powerSocket,
        imgPath: file,
        name: req.body.name
      })
      .then(cafe => {
      console.log("Test 5")

        res.redirect("/cafe/" + id);
      });
    }
  }
);

module.exports = router;
