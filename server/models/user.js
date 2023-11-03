let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const userSchema = new Schema({
  
  email: {
    type: String,
    required: [true, "email required"],
    unique: [true, "email already registered"],
  },

  name: {
    type: String,
    required: [true, "name required"]
  },
  
  profilePhoto: String,
  
  password: String,

  lastVisited: {
    type: Date,
    default: new Date(),
  },
});

var userModel = mongoose.model("User", userSchema, "User");

module.exports = userModel;