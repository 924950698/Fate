let fs = require('fs')
let Q = require('q')
let HeroModel = require('../models/hero.js')
let ExHeroModel = require('../models/exhero.js')
let MagicCircle = require('../../src/magic-circle.js')

let log = require('../log.js').log
let logArray = require('../log.js').logArray


let disableToken = () => {

}

let addExHeros = (heroObj) => {
    // 新增到记录
    ExHeroModel.findOne({cardid: heroObj.cardid}, (err, hero) => {
        if(err) {
            res.json({
                data:'', status: err, errno: -1
            })
            log('./server/log/err.txt', err, 'ExHero.add')
            throw err
        }
        if(hero === null) {
            let oneCalledHero = new ExHeroModel(heroObj)
            oneCalledHero.save()
        }
    })
}

/**
 * 获取目前所有英雄(不包含已经去除了的已选中英雄)
 * 要重置，请调用recallAllHeros
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
let getAllHeros = (req, res) => {
    HeroModel.find({}, (err, herolist) => {
        if(err) {
            res.json({
                data:'', status: err, errno: -1
            })
            log('./server/log/err.txt', err, 'Hero.find')
            throw err
        }
        res.json({
            errno: 0,
            status: 'success',
            data: herolist
        })
    })
}
/**
 * 进行一次选召：
 * 抽奖一次
 *
 * 操作：1. 保存每次操作的记录ExHERO
 * 2. 删除总库中，已经被抽中的人
 * @param {[type]} req {master: 第几组奖, servant: 该组第几次，num：抽几个人，token: token}
 * @param {[type]} res
 */
let rollMyHeros = (req, res) => {
    let master = req.query.master || 1
    let servant = req.query.servant || 1
    let num = req.query.num ? req.query.num : 1
    let rightToken = fs.readFileSync('./server/token.txt')
    console.log('rightToken', rightToken.toString())
    try{
        fs.writeFileSync('./server/token.txt', '')
    }catch(err) {
        console.error('hero.js: ', err)
    }
    if(req.query.token+'' != rightToken.toString()) {
    // if(0) {
        console.log("rollMyHeros token: ", req.query.token)
        res.json({
            data:'', status: 'token is wrong', errno: -2
        })
        log('./server/log/err.txt', `err: ${rightToken.toString()}`, 'Hero.find-TOKEN')
    } else {
        HeroModel.find({}, (err, herolist) => {
            if (err) {
                res.json({
                    data:'', status: err, errno: -1
                })
                log('./server/log/err.txt', err, 'Hero.find')
                throw err
            }
            //核心算法
            let newData = MagicCircle.call(herolist, num)
            // 核心算法结束
            let heroArrayList = []
            for (let i = 0; i < newData.calledHeros.length; i++) {
                let heroObj = {
                    master: Number(master), servant: Number(servant), name: newData.calledHeros[i].name,
                    cardid: newData.calledHeros[i].cardid, dep: newData.calledHeros[i].dep
                }
                heroArrayList.push(heroObj)
                HeroModel.remove({cardid: heroObj.cardid}, (err, heroNumber) => {
                    if(err) {
                        log('./server/log/err.txt', err, 'Hero.remove')
                        throw err
                    }
                    if(heroNumber) {
                        console.log('delete : ' + heroObj.name)
                        addExHeros(heroObj)
                    }
                })
            }
            logArray('./server/log/add.txt', heroArrayList, ['master','servant', 'name', 'cardid'], 'newHero')
            res.json({
                errno: 0,
                status: 'success',
                data: {
                    calledHeros: heroArrayList,
                    newHerosList: newData.newHerosList
                }
            })
        })
    }
}

/**
 * 2. 重置总库（总数变为511）
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
let recallAllHeros = (req, res) => {
    require('../initData.js')()
    res.json({
        data: '',
        status: 'success',
        errno: 0
    })
}

let _deleteCalledheros = (req, res) => {
    let deleteAllEx = () => {
        ExHeroModel.remove({}, (err, heroNumber) => {
            if(err) {
                res.json({
                    data:'', status: err, errno: -1
                })
                log('./server/log/err.txt', '[ERROR] '+ err, '_deleteCalledheros')
                throw err
            }
            heroNumber = heroNumber || 0
            res.json({
                data: heroNumber,
                status: 'success',
                errno: 0
            })
            console.log('delete ex: ' + heroNumber)
            log('./server/log/add.txt', '-------------------------------------------', '清空记录')
            log('./server/log/add.txt', '删除个数：'+heroNumber, '_deleteCalledheros')
        })
    }
    deleteAllEx()
}

module.exports = {
    getAllHeros: getAllHeros,
    rollMyHeros: rollMyHeros,
    recallAllHeros: recallAllHeros,
    _deleteCalledheros: _deleteCalledheros
}
