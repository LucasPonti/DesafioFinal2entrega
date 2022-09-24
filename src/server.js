import express from 'express';
import {Server as HttpServer} from 'http';
import {Server as IOServer} from 'socket.io';
const { Router } = express; 
import { productosDao as productosApi, carritosDao as carritosApi } from './daos/index.js';


//--------------------------------------------
// instancio servidor y persistencia
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.static('public'));

//--------------------------------------------
// permisos de administrador

const esAdmin = true;

function crearErrorNoEsAdmin(ruta, metodo) {
    const error = {
        error: -1,
    }
    if (ruta && metodo) {
        error.descripcion = `ruta '${ruta}' metodo '${metodo}' no autorizado`
    } else {
        error.descripcion = 'no autorizado'
    }
    return error
}

function soloAdmins(req, res, next) {
    if (!esAdmin) {
        res.json(crearErrorNoEsAdmin())
        console.log('No es posible modificar si no es admin');
    } else {
        next()
    }
}


//--------------------------------------------
//Inicializo  Sokets
io.on('connection', async socket => {
    console.log('Nuevo cliente conectado');
    const productos = await productosApi.getAll();
    const carrito = await carritosApi.getAll();
    //socket de productos
    socket.emit('productos' , await productosApi.getAll());

    socket.on('new-producto', async producto => {
        productos.push(producto);
        await productosApi.save(producto); 
        io.sockets.emit('productos', await productosApi.getAll());
    })

    //------------------------------------------
    //socket de carrito
    // socket.emit('carrito', carrito);

    socket.on('new-carrito', async carrito => {
        // await carritosApi.save(carrito);
        carrito.push(carrito);
        io.sockets.emit('carrito', carrito);
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

productosRouter.get('/productos', soloAdmins,async  (req, res) => {
    try {
        const prod = await productosApi.getAll();
        res.send(prod);
    } catch (error) {
        console.log(error);
    }
});

productosRouter.get('/productos/:id',soloAdmins ,existe, async (req, res) => {
    const id = req.params.id;
    const prod = await productosApi.getById(id)
    res.json(prod);
});

productosRouter.post('/productos',soloAdmins, async (req, res) => {
    try {
        const prod = req.body;
        prod.timestamp = Date.now();
        // await prod.save(prod);
        await productosApi.save(prod);
        res.json(req.body);
    } catch (error) {
        console.log(error);
    }
});

productosRouter.put('/productos/:id',soloAdmins ,existe, async(req, res)=> {
    try {
        await productosApi.update(req.body, req.params.id);
        // await productosDaoApi.update(req.body, req.params.id);
        res.send(await productosApi.getAll());
    } catch (error) {
        console.log(error);
    }
});

productosRouter.delete('/productos/:id', existe, async(req, res) => {
    try {
        const id = req.params.id;
        await productosApi.deleteById(id);
        // await productosDaoApi.deleteById(id);
        res.json(await prod.getAll());
    } catch (error) {
        console.log(error);
    }
})


//--------------------------------------------
//configuro router de carritos

const carritosRouter = new Router()
carritosRouter.use(express.json())
carritosRouter.use(express.urlencoded({extended: true}));

carritosRouter.post('/carrito', async (req, res) => {
    try {
       const carrito = {};
       carrito.timestamp = Date.now();
       carrito.productos = []; 
       res.json(await carritosApi.save(carrito));
    } catch (error) {
      console.log(error);  
    }
})

carritosRouter.delete('/carrito/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await carritosApi.deleteById(id);
        res.json(await carritosApi.getAll());
    } catch (error) {
        console.log(error);
    }
})

carritosRouter.get('/carrito/:id/productos', async (req, res) => {
    try {
        const id = req.params.id;
        const carrito = await carritosApi.getById(id);
        res.json(carrito.productos); 
    } catch (error) {
        console.log(error);
    }
   
})

carritosRouter.get('/carrito', async (req, res) => {
    try {
        const carritos = await carritosApi.getAll();
        res.json(carritos);
    } catch (error) {
       console.log(error); 
    }
})

carritosRouter.get('/carrito/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const carritos = await carritosApi.getById(id);
        res.json(carritos);
    } catch (error) {
       console.log(error); 
    }
})

carritosRouter.post('/carrito/:id/productos', async (req, res) => {
  try {
    const id = req.params.id;
    const prod = req.body.id;
    const miprod = await productosApi.getById(prod);
    const carritos = await carritosApi.getById(id);
    carritos.productos.push(miprod);
    ContenedorArchivoCarr.update(carritos, id);
    res.redirect('/carrito');
    res.json(carritos);
  } catch (error) {
    console.log(error)
  }
})

carritosRouter.delete('/carrito/:id/productos/:id_prod',async  (req, res) => {
    try {
        const id = req.params.id;
        const idProd = req.params.id_prod;
        const carrito = await carritosApi.getById(id);
        console.log('AQUI CARRITO', carrito);
        const prod = carrito.productos.filter(p => p.id != idProd);
        carrito.productos = prod;
        // carritosApi.update(carrito, id);
        res.json(carrito);
    } catch (error) {
        console.log(error);
    }
    
})

carritosRouter.delete('/carrito', async (req, res) => {
    try {
        await carritosApi.deleteAll();
    } catch (error) {
        console.log(error)
    }
})
// --------------------------------------------
// configuro el servidor

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use('/api', productosRouter);
app.use('/api', carritosRouter);

export default  httpServer;
