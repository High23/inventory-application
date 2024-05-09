const mongoose = require("mongoose");


const Schema = mongoose.Schema;

const GameSchema = new Schema({
    name: {type: String, required: true, minLength: 3, maxLength: 100}, 
    company: {type: Schema.Types.ObjectId, ref: "Company", required: false, minLength: 3, maxLength: 100}, 
    description: {type: Array, required: false, default: undefined}, 
    category: [{type: Schema.Types.ObjectId, ref: "Category", required: false}], 
    price: {type: Number, required: true}, 
    numberInStock: {type: String, required: true} 
})

module.exports = mongoose.model("Item", GameSchema)