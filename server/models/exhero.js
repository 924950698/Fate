let mongoose = require('mongoose')
let Schema = mongoose.Schema

let ExHeroSchema = new Schema({
    id: Number,
    cardid: {type: String, required: true},
    master: {type: Number, required: true},
    servant: {type: Number, required: true},
    dep: {type: String, required: true},
    name: {type: String, required: true}
})

module.exports = mongoose.model('ExHero', ExHeroSchema)
