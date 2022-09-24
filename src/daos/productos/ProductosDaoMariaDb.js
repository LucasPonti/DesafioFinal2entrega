const ContenedorSQL = require("../../contenedores/ContenedorSQL.js")
const config = require('../../config.js')

class ProductosDaoMariaDb extends ContenedorSQL {

    constructor() {
        super(config.mariaDb, 'productos')
    }
}

module.exports = ProductosDaoMariaDb