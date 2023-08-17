const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  owner: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
  ownername:String,
  img_path: String,
  title: String,
  address: String,
  placetype: String,
  photos: [String],
  description: String,
  perks: [String],
  extraInfo: String,
  checkIn: Number,
  checkOut: Number,
  maxGuests: Number,
  price: Number,
  isbooked: {type:Boolean,default:false},
  latitude:{type: Number,default:25.4500},
  longitude:{type: Number,default:81.8400},
});

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;