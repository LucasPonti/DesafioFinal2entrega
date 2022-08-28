// //--------------------------------------------
// // permisos de administrador

// const esAdmin = true

// function crearErrorNoEsAdmin(ruta, metodo) {
//     const error = {
//         error: -1,
//     }
//     if (ruta && metodo) {
//         error.descripcion = `ruta '${ruta}' metodo '${metodo}' no autorizado`
//     } else {
//         error.descripcion = 'no autorizado'
//     }
//     return error
// }

// function soloAdmins(req, res, next) {
//     if (!esAdmin) {
//         res.json(crearErrorNoEsAdmin())
//     } else {
//         next()
//     }
// }







const express = require('express');
const {Server: HttpServer} = require('http');
const {Server: IOServer} = require('socket.io');
const { Router } = express; 

const ContenedorArchivo = require('./contenedores/ContenedorArchivo.js');


//--------------------------------------------
// instancio servidor y persistencia
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const productosApi = new ContenedorArchivo('dbProductos');
const carritosApi = new ContenedorArchivo('dbCarritos');

app.use(express.static('public'));

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado');
    const productos = await productosApi.getAll();

    socket.emit('productos' , productos);
    console.log(productos);

    socket.on('new-producto', async producto => {
        productos.push(producto);
        // await productosApi.save(producto); 
        io.sockets.emit('productos', productos);
    })

});

// //--------------------------------------------
// //Middleware
const existe = async (req, res, next) => {
    const id = req.params.id;
    if(! await productosApi.getById(id)){
        res.status(500).json({error: 'Producto no encontrado'});
        console.log('no econtrado')
    }
    next();
}


//--------------------------------------------
// configuro router de productos

const productosRouter = new Router()
productosRouter.use(express.json())
productosRouter.use(express.urlencoded({extended: true}));

productosRouter.get('/productos',async  (req, res) => {
    try {
        const prod = await productosApi.getAll();
        res.json(prod);
    } catch (error) {
        console.log(error);
    }
});

productosRouter.get('/productos/:id', existe, async (req, res) => {
    const id = req.params.id;
    const prod = await productosApi.getById(id)
    console.log('aca probamos el id ' + id);
    res.json(prod);
});

productosRouter.post('/productos', (req, res) => {
    try {
        productosApi.save(req.body);
        res.json(req.body);
    } catch (error) {
        console.log(error);
    }
});

productosRouter.put('/productos/:id', existe,(req, res)=> {
    try {
        console.log(req.body, req.params.id);
        productosApi.update(req.body, req.params.id);
        res.send(productosApi.getAll());
    } catch (error) {
        console.log(error);
    }
});

productosRouter.delete('/productos/:id', existe, (req, res) => {
    try {
        const id = req.params.id;
        productosApi.deleteById(id);
        res.json(productosApi.getAll());
    } catch (error) {
        console.log(error);
    }
})


// productosRouter.post('/', soloAdmins, async (req, res) => {
    
// });


//--------------------------------------------
//configuro router de carritos

const carritosRouter = new Router()

carritosRouter.post('/carrito', async (req, res) => {
    try {
       await carritosApi.save() 
    } catch (error) {
      console.log(error);  
    }
})

carritosRouter.delete('/carrito/:id', (req, res) => {

})

carritosRouter.get('/carrito/:id/productos', (req, res) => {
    
})

carritosRouter.post('/carrito/:id/productos', (req, res) => {
    
})

carritosRouter.delete('/carrito/:id/productos/:id_prod', (req, res) => {
    
})

// --------------------------------------------
// configuro el servidor

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use('/api', productosRouter);
app.use('/api', carritosRouter);

module.exports = httpServer;
