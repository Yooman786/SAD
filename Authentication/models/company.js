var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var CompanySchema = new mongoose.Schema({
    name: String,
    branch: String,
    cpi: Number,
    date: Date
})
CompanySchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Companies", CompanySchema);