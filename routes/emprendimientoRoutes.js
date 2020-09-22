'use strict'

var express = require('express');

//requerimos el controlador
var EmprendimientoController = require('../controllers/emprendimientoController')

var router = express.Router()

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './upload/emprendimientos'})

//dependiendo la ruta que le indiquemos se van a ejecutar los metodos de los controladores

//rutas de prueba:
router.get('/datos-prueba', EmprendimientoController.datosPrueba);
router.get('/test-de-controlador', EmprendimientoController.test);

//Rutas para emprendimientos:
router.post('/save', EmprendimientoController.save);
router.get('/emprendimientos/:last?', EmprendimientoController.getEmprendimientos);
router.get('/emprendimiento/:id', EmprendimientoController.getEmprendimiento);
router.put('/emprendimiento/:id', EmprendimientoController.update);
router.delete('/emprendimiento/:id', EmprendimientoController.delete);
router.post('/emprendimiento/upload-image/:id?', md_upload, EmprendimientoController.upload);
router.post('/emprendimiento/upload-imagenes/:id?', md_upload, EmprendimientoController.uploadImages);
router.get('/emprendimiento/get-image/:imagen', EmprendimientoController.getImage);
router.get('/emprendimiento/search/:search', EmprendimientoController.search);
router.post('/contacto', EmprendimientoController.contacto)

//exportamos las rutas para poder usarlas en app.js
module.exports = router; 