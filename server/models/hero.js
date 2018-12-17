let mongoose = require('mongoose')
let Schema = mongoose.Schema

let HeroSchema = new Schema({
    id: Number,
    cardid: {type: String, required: true},
    dep: {type: String, required: true},
    name: {type: String, required: true}
})

module.exports = mongoose.model('Hero', HeroSchema)
