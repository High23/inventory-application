const mongoose = require("mongoose");


const Schema = mongoose.Schema;

const GameSchema = new Schema({
    name: {type: String, required: true, minLength: 3, maxLength: 100}, 
    company: {type: Schema.Types.ObjectId, ref: "Company", required: true, minLength: 3, maxLength: 100}, 
    description: {type: Array, required: false, default: undefined}, 
    category: [{type: Schema.Types.ObjectId, ref: "Category", required: true}], 
    price: {type: Number, required: true, min: 0}, 
    numberInStock: {type: String, required: true} 
})

GameSchema.virtual("url").get(function () {
    return `/game/${this._id}`;
})

module.exports = mongoose.model("Game", GameSchema)