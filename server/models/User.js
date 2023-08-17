const mongoose = require("mongoose");
const passportlocalmongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    default: null,
  },
  username: {
    type: String,
    default: null,
  },
  lastName: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    unique: true,
    default: null,
  },
  phone: {
    type: String,
    unique: true,
    default: null,
  },
  pic:{
    type:String,
    default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  },
  password: {
    type: String,
    default: null,
  },
  googleId: {
    type: Number,
    default: null,
  },
  facebookId: {
    type: Number,
    default: null,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  saved : Array,
});

UserSchema.plugin(passportlocalmongoose);
UserSchema.plugin(findOrCreate);

UserSchema.methods.addsaveddata = async function (saves) {
  try {
    this.saved = this.saved.concat(saves);
    await this.save();
    return this.saved;
  } catch (error) {
    console.log(error + "error at the time of saved addition");
  }
};

// const User = mongoose.model("users", UserSchema);
const User = mongoose.model("User", UserSchema);
module.exports = User;