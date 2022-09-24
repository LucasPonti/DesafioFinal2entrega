const CarritosDaoSQL = require("./CarritosDaoSQL.js")
const config = require('../../config.js')

class CarritosDaoMariaDb extends CarritosDaoSQL {

    constructor() {
        super(config.mariaDb, config.mariaDb)
    }
}

module.exports = CarritosDaoMariaDb