const CarritosDaoSQL =  require("./CarritosDaoSQL.js")
const config = require('../../config.js')

class CarritosDaoSQLite3 extends CarritosDaoSQL {

    constructor() {
        super(config.sqlite3, config.sqlite3)
    }
}

module.exports = CarritosDaoSQLite3