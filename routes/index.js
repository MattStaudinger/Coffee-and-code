const express = require("express");
const router = express.Router();


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


router.get('/main', (req, res, next) => {
  Place.find().then(places=> {
    res.render('places/all', {places})
  })
})

router.get('/add', (req, res, next) => {
    res.render('places/add')
})

router.post('/add', (req, res, next) => {
  Place.create({
    name:req.body.name,
    kind:req.body.kind,
    location:{ type: "Point", coordinates: [req.body.lng, req.body.lat]}
  }).then(place => {
    res.redirect('/all')});
})

router.get("/edit/:id", (req, res, next)=> {
  Place.findById(req.params.id).then(place=> {
    console.log("place.location.coordinates[0]",place)
    let name = place.name;
    let lat = "" +place.location.coordinates[0]
    let lng = "" +place.location.coordinates[1]
    res.render('places/edit', {place, name, lat, lng})
  })
})

router.post('/edit/:id',(req, res, next) => {
  Place.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    kind: req.body.kind,
    location: {type: "Point", coordinates:[req.body.lng, req.body.lat]}
  }).then(place => {
    res.redirect('/all')
  })
})

router.get('/delete/:id',(req, res, next) => {
  Place.findByIdAndRemove(req.params.id).then(place => {
    res.redirect('/all')
  })
})

router.get('/api', (req, res, next) => {
	Place.find({}, (error, placesFromDB) => {
		if (error) {
			next(error);
		} else {
			res.json({ places: placesFromDB});
		}
	});
});


module.exports = router;
