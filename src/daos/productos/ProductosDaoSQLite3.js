const ContenedorSQL = require ("../../contenedores/ContenedorSQL.js")
const config = require('../../config.js')

class ProductosDaoSQLite3 extends ContenedorSQL {

    constructor() {
        super(config.sqlite3, 'productos')
    }
}

module.exports = ProductosDaoSQLite3