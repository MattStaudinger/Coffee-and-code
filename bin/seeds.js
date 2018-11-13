// Seeds file that remove all users and create 2 new users

// To execute this seed, run from the root of the project
// $ node bin/seeds.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Cafe = require("../models/Cafe");

const bcryptSalt = 10;

mongoose
  .connect('mongodb://localhost/coffee-and-code', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });


let cafes = [
  {
    name: 'R/D Coffee and Craft Beer',
    Wifi: true,
    powerSockets: true,
    location: {
      type: 'Point',
      coordinates: ['52.5292892' , '13.3843579']
    }
  },
  {
    name: 'Happy Baristas',
    Wifi: true,
    powerSockets: false,
    location: {
      type: 'Point',
      coordinates: ['52.505255' , '13.4690561']
    }
  },
  {
    name: 'Oslo Kaffebar',
    Wifi: true,
    powerSockets: true,
    location: {
      type: 'Point',
      coordinates: ['52.5310043' , '13.3867872']
    }
  },
  {
    name: 'SPONTΛN',
    Wifi: true,
    powerSockets: false,
    location: {
      type: 'Point',
      coordinates: ['52.52523' , '13.33032']
    }
  },
  {
    name: 'THE BARN at Café Kranzler',
    Wifi: true,
    powerSockets: false,
    location: {
      type: 'Point',
      coordinates: ['52.5042443' , '13.3309765']
    }
  }
]

// User.deleteMany()
// .then(() => {
//   return User.create(users)
// })
// .then(usersCreated => {
//   console.log(`${usersCreated.length} users created with the following id:`);
//   console.log(usersCreated.map(u => u._id));
// })
// .then(() => {
//   // Close properly the connection to Mongoose
//   mongoose.disconnect()
// })
// .catch(err => {
//   mongoose.disconnect()
//   throw err
// })

Cafe.deleteMany()
.then(() => {
  return Cafe.create(cafes)
})
.then(cafesCreated => {
  console.log(`${cafesCreated.length} cafes created with the following id:`);
  console.log(cafesCreated.map(u => u._id));
})
.then(() => {
  // Close properly the connection to Mongoose
  mongoose.disconnect()
})
.catch(err => {
  mongoose.disconnect()
  throw err
})