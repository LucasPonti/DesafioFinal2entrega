import mongoose from 'mongoose';
import config from '../config.js';

 await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options)


class ContenedorMongoDb {

    constructor(nombreColeccion, esquema) {
        this.coleccion = mongoose.model(nombreColeccion, esquema)
    }

    async getById(id) {
      try {
       const elemById = await this.collection.findOne({id: id});
       return elemById;
      } catch (error) {
        console.log('Hubo un error en MongoGetByID')
      }  
    }

    async getAll() {
        try {
            const allElements = await this.collection.find()
            console.log(allElements);
            return allElements;
        } catch (error) {
          console.log('Hubo un error en MongoGetAll')
        }  
    }

    async save(nuevoElem) {
        try {
          await this.collection.insertOne(nuevoElem) 
        } catch (error) {
          console.log('Hubo un error en MongoSave')
        }  
    }

    async update(nuevoElem, id) {
        try {
            await this.collection.updateOne(
                {id: id},
                {$set: {nuevoElem}}
                )
        } catch (error) {
          console.log('Hubo un error en MongoUpdate')
        }  
    }

    async delete(id) {
        try {
            this.collection.deleteOne({id:id});
        } catch (error) {
          console.log('Hubo un error en MongoDelete')
        }  
    }

    async deleteAll() {
        try {
            this.collection.deleteMany({})
        } catch (error) {
          console.log('Hubo un error en MongoDeleteAll')
        }  
    }
}

export default ContenedorMongoDb