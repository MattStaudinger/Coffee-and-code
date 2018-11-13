const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const cafeSchema = new Schema({
  name: String, 
  address: String,
  openingHours: String,
  Wifi: Boolean,
  powerSockets: Boolean,
  imgPath: String,
  comments: [{
    content: String,
    _creator: {type: Schema.Types.ObjectId, ref: "User"},
    createdAt: { type: Date, default: Date.now()}
  }],
  _creator: {type: Schema.Types.ObjectId, ref: "User"},
  location: {
    type: {type:String},
    coordinates: [Number]
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Cafe = mongoose.model('Cafe', cafeSchema);
module.exports = Cafe;
