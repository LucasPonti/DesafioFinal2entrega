import {promises as fs} from 'fs';

class ContenedorArchivo{
    constructor(nombreArchivo){
        this.nombreArchivo = nombreArchivo; 
        this.productos = [],
        this.id=1
    }

    async save(obj){
        try {
            // const producto = await fs.readFile('./'+this.nombreArchivo+'.json', 'utf-8');
            obj.id = this.id;
            this.productos = [...this.productos, obj];
            await fs.writeFile('./'+this.nombreArchivo+'.json', JSON.stringify(this.productos)+'\n');
            this.id ++; 
        } catch (error) {
            console.log('Hubo un error en Save');
        }
    }
    
    async getById(id){
        try {
           const producto = await this.getAll();
           const productsById = producto.find(p => p.id == id);
           return productsById;  
        } catch (error) {
            console.log('Hubo un error en getById')
        }
    }

    async getAll(){
        try {
            const productos = await fs.readFile('./dbProductos.json', 'utf8');
            return JSON.parse(productos);
        } catch (error) {
            console.log('Hubo un error en GetAll');
        }
    }

    async update(prod, id){
        try {
            prod.id = id;
            this.productos[id - 1] = prod;
            await fs.writeFile('./'+this.nombreArchivo+'.json', JSON.stringify(this.productos));
        } catch (error) {
            console.log('Hubo un error en update');
        }
    }

    async deleteById(id){
        try {
          const producto = await this.getAll();
          const productsById = producto.filter(p => p.id != id);
          this.productos = productsById
          await fs.writeFile('./'+this.nombreArchivo+'.json', JSON.stringify(this.productos));  
        } catch (error) {
           console.log('Hubo un error en deleteById'); 
        }
    }
    
    async deleteAll(){
        this.productos = [];
        this.id = 1;
        await fs.writeFile('./'+this.nombreArchivo+'.json', JSON.stringify(this.productos));
    }
}

export default ContenedorArchivo;