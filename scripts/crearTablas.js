import knex from 'knex'
import config from '../src/config.js'

// opciones SQL: mariaDb, sqlite3

const mariaDbClient = knex(config.mariaDb)
    try {
        //Implementar creación de tabla
         await mariaDbClient.schema.dropTableIfExists('productos');
         await mariaDbClient.schema.createTable('productos' ,  table => {
            table.increments('id').primary();
            table.string('title').notNullable();
            table.float('price');
            table.string('thumbnail');
            table.string('date')
        });
        
        
        console.log('tabla productos en mariaDb creada con éxito')
    } catch (error) {
        console.log('error al crear tabla productos en mariaDb')
        console.log(error)
    } finally {
         await mariaDbClient.destroy();
    }