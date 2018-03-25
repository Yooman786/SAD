var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
// Mongoose/Model config
var Admin = new mongoose.Schema({
    username: String,
    password: String
});

Admin.plugin(passportLocalMongoose);
// Students.create({
//     name: "Harshal",
//     id: 151080021,
//     branch: "IT",
//     cpi: 8.11
// });  

module.exports =  mongoose.model("Admin",Admin);
