const ContenedorMemoria = require("../../contenedores/ContenedorMemoria.js")

class CarritosDaoMem extends ContenedorMemoria {

    async guardar(carrito = { productos: [] }) {
        return super.guardar(carrito)
    }
}

module.exports = CarritosDaoMem