const mongoose = require("mongoose");
const bcrypt=require("bcrypt");
const passportLocalMongoose = require("passport-local-mongoose");
const UserSchema = new mongoose.Schema({
     username:{
        type: String,
         unique: true,
         required: true,
         trim: true},
     password:{
         type: String,
         required: true},
     email:{
         type: String,
         unique: true,
         required: true,
         trim: true},
     phone:{
         type: Number,
         unique: true,
         required: true,
        },
    address:{
        type: String,
    
}) ;


// UserSchema.pre('save', function (next) {
//     var user = this;
//     bcrypt.hash(user.password, 10, function (err, hash) {
//       if (err) {
//         return next(err);
//       }
//       user.password = hash;
//       next();
//     })
//   });

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",UserSchema);
