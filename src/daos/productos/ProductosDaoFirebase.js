const ContenedorFirebase = require("../../contenedores/ContenedorFirebase.js")

class ProductosDaoFirebase extends ContenedorFirebase {

    constructor() {
        super('productos')
    }
}

module.exports = ProductosDaoFirebase