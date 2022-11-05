
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');


class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        //Concectar a BBDD
        this.conectarDB();

        //Middleware
        this.middlewares();
        
        //Rutas de la aplicación
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        //Cors
        this.app.use(cors())

        //lectura y parseo del body
        this.app.use( express.json() );

        //directorio público
        this.app.use( express.static('public'))
    }

    routes() {
        this.app.use( this.usuariosPath, require('../routes/usuarios'))
    }

    listen(){
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto ', this.port)
        })
    }

}


module.exports = Server;