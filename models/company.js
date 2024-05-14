const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CompanySchema = new Schema({
    name: {type: String, required: true, minLength: 1, maxLength: 100}
})

CompanySchema.virtual("url").get(function () {
    return `/company/${this._id}`;
})

module.exports = mongoose.model("Company", CompanySchema)