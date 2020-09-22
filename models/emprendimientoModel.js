'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmprendimientoSchema = Schema({
	section: String,
	name: String,
	title: String,
	logo: String,
	date: {type: Date, default: Date.now},
	texto: String,
	cel: String,
	imgFolder: Array,
	random: Number,
	destacado: Boolean
});

module.exports = mongoose.model('Emprendimiento', EmprendimientoSchema);

// emprendimientos -> guarda documentos de este tipo y con esta estructura dentro de la coleccion. 

