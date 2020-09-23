'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');
var Emprendimiento = require('../models/emprendimientoModel');
const nodemailer = require('nodemailer');

//objeto literal con los metodos que ejecutamos en las rutas emprendimientosRoutes.js
var controller = {

	datosPrueba: (req, res)=>{

	return res.status(200).send({
		name: 'simon',
		author: 'pepinogalactico',
		url:'pepinogtvv'
	  });
	},

	test:(req, res)=>{
		return res.status(200).send({
			message: 'Soy la accion test de mi controlador'
		});
	},

	//metodo para crear nuevos emprendimientos:

	save: (req, res)=>{

		//recoger parametros por post
		  var params = req.body;
		//validar datos (validator)
		try{
		  var validate_section = !validator.isEmpty(params.section);
		  var validate_name = !validator.isEmpty(params.name);
		  var validate_title = !validator.isEmpty(params.title);
		  var validate_logo = !validator.isEmpty(params.logo);
		  var validate_texto = !validator.isEmpty(params.texto);
		  var validate_cel = !validator.isEmpty(params.cel);	  
		  var validate_destacado = !validator.isEmpty(params.destacado)

		}catch(err){

			return res.status(200).send({
				status:'error',
				message:'Faltan datos por enviar!'
			});

		}

		if(validate_title && 
		   validate_texto &&
		   validate_logo && 
		   validate_cel &&
		   validate_section &&
		   validate_name &&
		   validate_destacado){

			//Crear el objeto a guardar
			var emprendimiento = new Emprendimiento()
			
			//Asignar valores
			emprendimiento.section = params.section
			emprendimiento.title = params.title
			emprendimiento.texto = params.texto
			emprendimiento.logo = params.logo
			emprendimiento.imgFolder = params.imgFolder
			emprendimiento.cantidadImg = params.cantidadImg
			emprendimiento.cel = params.cel
			emprendimiento.ig = params.ig
			emprendimiento.name = params.name
			emprendimiento.destacado = params.destacado

			//Guardar el emprendimiento
			emprendimiento.save((err, emprendimientoStored)=>{

				if(err || !emprendimientoStored){
					return res.status(500).send({
						status:'error',
						message:'El emprendimiento no se ha guardado!'
					});
				}
				return res.status(200).send({
					status: 'succes',
					emprendimiento: emprendimientoStored
				});

			});

		}else{
			return res.status(500).send({
				status:'error',
				message:'Los datos no son validos!'
			});
		}
	},
	getEmprendimientos: (req, res)=>{

		var query = Emprendimiento.find({});//find para sacar todos los emprendimientos
		var last = req.params.last;

		if(last || last != undefined ){
			query.limit(5);
		}

		query.sort('-_id').exec((err, emprendimientos)=>{
			
			if(err){

				return res.status(500).send({
					status:'error',
					message:'Error al devolver los emprendimientos'
				});

			}
			if(!emprendimientos){
				return res.status(404).send({
					status:'error',
					message:'No hay emprendimientos para mostrar!'
				});
			}
			return res.status(200).send({
				status:'acces',
				emprendimientos
			});
		});

	},
	getEmprendimiento: (req, res)=>{
		//Recoger el id de la url
		var emprendimientoId = req.params.id;
		//Comprobar que existe
		if(!emprendimientoId || emprendimientoId == null){
			return res.status(404).send({
				status:'error',
				message:'No existe el emprendimiento!'
			});
		}
		//Buscar el emprendimiento
		Emprendimiento.findById(emprendimientoId,(err, emprendimiento)=>{

			if(err || !emprendimiento){
				return res.status(404).send({
					status:'error',
					message:'No existe el emprendimiento!'
				});
			}
			return res.status(200).send({
				status:'succes',
				emprendimiento
			});
		});
		//Devolver en json

	},
	update: (req, res)=>{
		//recoger el id del emprendimiento que viene por la url

		var emprendimientoId = req.params.id;
		var params = req.body;
		var imgToDelete = params.imgToDelete;
		console.log(imgToDelete)
		//validar datos
		try{
			  var validate_section = !validator.isEmpty(params.section);
			  var validate_name = !validator.isEmpty(params.name);
			  var validate_title = !validator.isEmpty(params.title);
			  var validate_logo = !validator.isEmpty(params.logo);
			  var validate_texto = !validator.isEmpty(params.texto);
			  var validate_cel = !validator.isEmpty(params.cel);	  
			  var validate_destacado = !validator.isEmpty(params.destacado);
		}catch(err){
			return res.status(200).send({
				status:'error',
				message:'Faltan datos por enviar!'
			});
		}
		if(validate_title && 
		   validate_texto &&
		   validate_logo && 
		   validate_cel &&
		   validate_section &&
		   validate_name &&
		   validate_destacado){
			Emprendimiento.findOneAndUpdate({_id: emprendimientoId}, params, {returnOriginal: false}, (err, emprendimientoUpdated) =>{

				if(err){
					return res.status(500).send({
						status:'error',
						message:'Error al actualizar!!!'
					});		
				}
				if (!emprendimientoUpdated){
					return res.status(404).send({
						status:'error',
						message:'No existe el emprendimiento!!!'
					});	
				}
				if (imgToDelete && imgToDelete != ''){

					var deleteArray = imgToDelete.split(',');
					deleteArray.forEach((imgId, index) =>{
						fs.unlink(path.join('upload/emprendimientos/'+imgId), (err)=>{
							if (index == deleteArray.length -1){
								if (err){
									return res.status(500).send({
										status: "error",
										message: "error al borrar las imagenes",
										err
									});
								}else{
									return res.status(200).send({
										status:"succes",
										message: "El emprendimiento se actualizo y las imagenes viejas se borraron correctamente!",
										emprendimiento: emprendimientoUpdated,
									});
								}
							}
						});
					});
				}else{
					return res.status(200).send({
						status:'succes',
						emprendimiento: emprendimientoUpdated
					});
				}

			});
		}else{
			return res.status(500).send({
				status:'error',
				message:'La validacion no es correcta!!!'
			});	
		}

	},
	delete:(req, res)=>{
		//recoger el id de la url
		var emprendimientoId = req.params.id
		//find and delete
		Emprendimiento.findOneAndDelete({_id: emprendimientoId}, (err, emprendimientoRemoved)=>{
			if (err){
			return res.status(500).send({
				status:'error',
				message:'Error al borrar!!!'
			});					
			}if(!emprendimientoRemoved){
			return res.status(404).send({
				status:'error',
				message:'No se ha borrado el emprendimiento, posiblemente no exista!!!'
			});
			}
			return res.status(200).send({
				status:'succes',
				message:'Este emprendimiento se ha borrado correctamente:',
				emprendimiento: emprendimientoRemoved
			});
		});
	},
	upload:(req, res)=>{
		//Configuramos el modulo connect multiparty/router/emprendimiento.js(hecho en routes)

		//Recoger el fichero de la peticion
		var file_name = "imagen no subida...";

		if(!req.files.file0){
			return res.status(404).send({
				status: "error",
				message: imagenes
			});
		}
		//Conseguir el nombre y la extension del archivo
		var file_path = req.files.file0.path
		var file_split = file_path.split("/");

		//EN LINUS O MAC: split('/');

		//Nombre del archivo: 
		var file_name = file_split[2];

		//Extension del fichero
		var extension_split = file_name.split('.');
		var file_ext = extension_split[1];

		//Commprobamos la extension, es decir que puedan ser solo imagenes, y si la extension no es valida borrar el fichero

		if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg'){
			//borrar el archivo subido si no cumple con la condicion
			fs.unlink(file_path, (err)=>{
				return res.status(200).send({
					status: "error",
					message: 'La extension de la imagen no es valida'
				});
			});
		}else{

			var emprendimientoId = req.params.id;
			if (emprendimientoId){

			Emprendimiento.findOneAndUpdate({_id: emprendimientoId}, {logo:file_name}, { returnOriginal: false }, (err, emprendimientoUpdated)=>{

					if (err || !emprendimientoUpdated ){

						return res.status(404).send({
							status: "error",
							message: 'Error al guardar la imagen de el emprendimiento!'
						});

					}else{
						return res.status(200).send({
							status:"succes",
							emprendimiento: emprendimientoUpdated,
							logo:file_name
						});
					}	
			}); 
				
			}else{
				return res.status(200).send({
					status:"succes",
					logo:file_name
				});
			}
		}
	},
	uploadImages:(req, res)=>{

		var imagenes = 'imagenes no subidas...'
		var filesObject = req.files;
		console.log(req.files.params)

		var files = Object.values(filesObject).slice(0);

		if(!files){
			return res.status(404).send({
				status: "error",
				message: "No se detectaron las imagenes!"
			});
		}

		var emprendimientoId = req.params.id;
		var arrayName = [];
		var retorno;

		files.forEach(imagen =>{
			let imagen_split = imagen.path.split("/");
			let imagen_name = imagen_split[2];
			let name_split = imagen_name.split('.');
			let img_ext = name_split[1];
			if (img_ext != 'png' && img_ext != 'jpg' && img_ext != 'jpeg'){
				fs.unlink(imagen.path, (err)=>{
					if (err){
						retorno = false;
					}
				});
			}else{
				retorno = true;
				arrayName.push(imagen_name)
			}
		});

		if (!retorno){
			return res.status(200).send({
				status: "error",
				message: 'La extension de la imagen no es valida'
			});
		}else{
			if (emprendimientoId){
				Emprendimiento.findOneAndUpdate({_id: emprendimientoId}, {imgFolder: arrayName}, { returnOriginal: false }, (err, emprendimientoUpdated)=>{

					if (err || !emprendimientoUpdated){

						return res.status(404).send({
							status: "error",
							message: 'Error al guardar la imagen de el emprendimiento!'
						});

					}else{
						
							return res.status(200).send({
								status:"succes",
								emprendimiento: emprendimientoUpdated,
								imgFolder: arrayName
							});

					}	

				});
			}else{
				return res.status(200).send({
					status:"succes",
					imgFolder: arrayName
				});
			}
		}
		

	},
	getImage:(req, res)=>{
		var file = req.params.imagen;
		var path_file = "./upload/emprendimientos/"+file;

		fs.exists(path_file, (exist)=>{
			if(exist){
				return res.sendFile(path.resolve(path_file))
			}else{
				return res.status(404).send({
					status:"error",
					message: "La imagen no existe!"
				});
			}
		});
	},
	search:(req, res)=>{

		//sacar el string a buscar
		var search_string = req.params.search;

		//find or\
		Emprendimiento.find({ "$or": [
			{"title": {"$regex": search_string, "$options":"i"}},
			{"name": {"$regex": search_string, "$options":"i"}},
			{"section": {"$regex": search_string,"$options":"i"}}
			]})
		    .sort([['date', 'descending']])
		    .exec((err, emprendimientos)=>{
		    	if (err){
		    		return res.status(500).send({
		    			status:"error",
		    			message: "Error en la peticion!!"
		    		});
		    	}
		    	if (!emprendimientos || emprendimientos.length <= 0){
		    		return res.status(404).send({
		    			status:"error",
		    			message: "No hay emprendimientos que coincidan con tu busqueda!!"
		    		});
		    	}
		    	return res.status(200).send({
		    		status:"succes",
		    		emprendimientos
		    	});
		    });
	},
	contacto:(req,res)=>{

		var params = req.body;


		var transporter = nodemailer.createTransport({
			port: 3900,
			service: 'gmail',
			auth:{
				user: 'encontrachacabuco@gmail.com',
				pass: 'encontrala180'
			},
			tls:{
				rejectUnauthorized: false
			}
		});

		const mailOptions ={
			from: `${params.nombre} 👻 ${params.email}`,
			to: `srsandokan03@gmail.com`,
			subject: 'Contacto Encontra Chacabuco',
			html:` 
			<strong>Nombre:</strong> ${params.nombre} <br/>
			<strong>E-mail:</strong> ${params.email} <br/>
			<strong>Mensaje:</strong> ${params.mensaje}
			`
		}

		transporter.sendMail(mailOptions, (err,info)=>{
			if (err){
				return res.status(500).send({
					status:"error",
					message: 'Ocurrio un error al enviar el email!',
					err
				});		
			}else{
				return res.status(200).send({
					status:"succes",
					message:'Email enviado correctamente!',
					info
				});		
			}
		});

	}
                 
} //end controller

//exportamos el controlador 
module.exports = controller; 