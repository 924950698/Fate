let fs = require('fs')

let generateToken = (req, res) => {
    let key = Date.now()
    try{
        fs.writeFileSync('./server/token.txt', key)
    }catch(err) {
        key = Date.now()
        es.json({
            errno: -1,
            status: 'write token error',
            data: ''
        })
        console.log('token err', err)
    }

    res.json({
        errno: 0,
        status: '',
        data: key
    })
}

module.exports = {
    generateToken: generateToken
}
