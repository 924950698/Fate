let Q = require('q')
let HeroModel = require('./models/hero.js')
let ExHeroModel = require('./models/exhero.js')
let allHeros = require('./json/herolist.js')

let log = require('./log.js').log

let deleteAllHeros = () => {
    let deferred = Q.defer()
    HeroModel.remove({}, (err, heroNumber) => {
        if(heroNumber) {
            console.log('delete : ' + heroNumber)
        }
        deferred.resolve(heroNumber)
    })
    return deferred.promise
}

let createAllheros = () => {
    let heroObj
    let deferred = Q.defer()
    let add = 0
    for (let i = 0; i < allHeros.length; i++) {
        let heroObj = allHeros[i];
        (function(heroObj) {
            HeroModel.findOne({cardid: heroObj.cardid}, (err, hero) => {
                if(hero === null) {
                    let newHero = new HeroModel(heroObj)
                    newHero.save()
                    add++
                    if(i === allHeros.length - 1)
                        deferred.resolve(add)
                }
            })
        })(heroObj)
    }
    return deferred.promise
}


module.exports = () => {
    deleteAllHeros().done((heroNumber) => {
        createAllheros().then(add => {
            console.log("add new: ", add)
            log('./server/log/add.txt', '-------------------------------------------', '重置总库数据')
            log('./server/log/add.txt', `deleteAllHeros:${heroNumber} - createAllheros:${add}`, 'initData')
        })
    })
}
