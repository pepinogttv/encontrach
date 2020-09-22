'use strict'

//Cargar modulos de node para crear el servidor
var express = require('express')
var bodyParser = require('body-parser');
var path = require('path');
//Ejecutar express para pdoer trabajar con HTTP
var app = express();

//Cargamos ficheros y rutas
var emprendimiento_routes = require('./routes/emprendimientoRoutes')

//Cargarmos middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// CORS (para permitir peticiones desde el fronend)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
//Añadir prefijos o rutas / Cargar rutas

app.use('/api', emprendimiento_routes)
//rutas en modo produccion
app.use('/', express.static('client', {redirect: false}));
app.get('*', function(req, res ,next){
	res.sendFile(path.resolve('client/index.html'));
});

//Exportar modulo (fichero actual)
module.exports = app; 