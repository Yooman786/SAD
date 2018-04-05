var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var StudentSchema = new mongoose.Schema({
    name: String,
    id: Number,
    branch: String,
    cpi: Number
})
StudentSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Students", StudentSchema);