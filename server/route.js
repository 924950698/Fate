let heroContr = require('./controllers/hero.js')
let Token = require('./controllers/token.js')

module.exports = (app) => {
    app.get('/hero', (req, res) => {
        res.send('GGGGGG')
    })
    app.get('/getAllHeros', heroContr.getAllHeros)
    app.get('/rollMyHeros', heroContr.rollMyHeros)
    app.get('/recallAllHeros', heroContr.recallAllHeros)
    app.get('/deleteAllexHerosLog', heroContr._deleteCalledheros)
    app.get('/gettoken', Token.generateToken)
}
