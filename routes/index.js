const express = require('express');
const router  = express.Router();
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

router.get("/main" , (req,res,next) => {
  
})

module.exports = router;
