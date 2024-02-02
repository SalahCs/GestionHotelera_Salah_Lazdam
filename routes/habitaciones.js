/* Librerías */
const express = require("express");
const { autenticacion } = require("../utils/auth");
const auth = require(__dirname + '/../auth/auth.js');
const Habitacion = require(__dirname + "/../models/habitacion.js");
const Limpieza = require(__dirname + "/../models/limpieza.js");
const upload = require(__dirname + "/../utils/uploads.js");
const upload2 = require(__dirname + "/../utils/uploads.js");


let router = express.Router();

/* Listado de todas las habitaciones */
router.get('/', async (req, res) => {
  try {
    const resultado = await Habitacion.find();
    if (!resultado || resultado.length == 0) 
      res.render({ error: resultado });    
    else 
      res.render('habitaciones_listado', {habitaciones: resultado});
  } catch (err) {
    res.render({ error: resultado });
  }
});

router.get('/nueva', autenticacion, (req, res) => {
  res.render('habitaciones_nueva');
});

/* Obtener detalles de una habitación concreta */
router.get('/:id', async (req, res) => {
  try {
    const resultado = await Habitacion.findById(req.params.id);

    if (resultado) {
      return res.render('habitaciones_ficha', {habitacion: resultado});
    }
    else{
      return res.render({ error: 'Habitación no encontrada' });
    }

  } catch (error) {
    res.render('error', { error: error });
  }
});

/* Insertar una habitación */
router.post('/', upload.upload.single('imagen_habitacion'), (req, res) => {
  const nuevaHabitacion = new Habitacion({
    numero: req.body.numero_habitacion,
    tipo: req.body.tipo_habitacion,
    descripcion: req.body.descripcion_habitacion,
    ultimaLimpieza: Date.now(),
    precio: req.body.precio_noche
  });

  if(req.file){
    nuevaHabitacion.imagen = req.file.filename;
  }

  nuevaHabitacion.save().then(resultado => {
    res.redirect(req.baseUrl);
  }).catch(err => {      
    let error = {
      errorBase: 'Error insertando la habitación',
    }

    if(err.errors.numero){
      error.numero = err.errors.numero;
    }
    if(err.errors.descripcion){
      error.descripcion = err.errors.descripcion;
    }
    if(err.errors.precio){
      error.precio = err.errors.precio;
    }

    res.render('habitaciones_nueva', {errores: error});

  })  
});

/* Actualizar TODAS las últimas limpiezas */
router.put('/ultimaLimpieza', async (req, res) => {
  try {
    const habitaciones = await Habitacion.find();

    habitaciones.forEach(async habitacion => {
      const ultimaLimpieza = await Limpieza.findOne({idHabitacion: habitacion._id}).sort({ fechaHora: -1 });

      if (ultimaLimpieza) {
        habitacion.ultimaLimpieza = ultimaLimpieza.fechaHora;
        await habitacion.save();
      }
    });
    
    res.status(200).send({ resultado: 'Se han actualizado las ultimas limpiezas realizadas'});

  } catch (error) {
    res.status(400).send({ error: 'Error actualizando limpiezas' });
  } 
});

/* Eliminar una habitación */
router.delete('/:id', autenticacion ,async (req, res) => {
  try {
    const resultado = await Habitacion.findByIdAndDelete(req.params.id);
    if (!resultado) {
        return res.render('error', { error: 'Habitación no borrada' });
    }

    const limpiezas = await Limpieza.deleteMany({idHabitacion: req.params.id});
    res.redirect(req.baseUrl);
  } catch (error) {    
    return res.render('error', { error: 'Habitación no borrada' });
  }
});
  
/* Añadir una incidencia a una habitación */
router.post('/:id/incidencias', upload2.upload2.single('imagen'), autenticacion, async (req, res) => {
  try {
    const habitacion = await Habitacion.findById(req.params.id);
    const incidencia = { descripcion: req.body.descripcion, fechaInicio: new Date() };
    console.log(incidencia);

    if(req.file){
      incidencia.imagen = req.file.filename;
    }

    habitacion.incidencias.push(incidencia);

    const habitacionActualizada = await habitacion.save();
    res.redirect(req.baseUrl+'/'+req.params.id);
  } catch (error) {
    return res.render('error', { error: 'Habitación no encontrada' });
  }
});

router.get('/editar/:id', autenticacion, async (req, res) => {
  try{
    const habitacion = await Habitacion.findById(req.params.id);
    if(habitacion){
      res.render('habitaciones_edicion', {habitacion: habitacion});
    }
  }catch{
    res.render('error', { error: 'Error actualizando la habitación' });
  }
})

router.post('/editar/:id', upload.upload.single('imagen_habitacion'), autenticacion, async (req, res) => {

  try{
    const habitacion = await Habitacion.findById(req.params.id);
    if(habitacion){
      habitacion.numero = req.body.numero_habitacion;
      habitacion.tipo = req.body.tipo_habitacion;
      habitacion.descripcion = req.body.descripcion_habitacion;
      habitacion.precio = req.body.precio_noche;
  
      if(req.file){
        habitacion.imagen = req.file.filename;
      }
      
      const respuesta = await habitacion.save();

      res.redirect(req.baseUrl+'/'+req.params.id);
    }
    else{
      res.render('error', { error: 'Error actualizando la habitación' });
    }
    
  }catch{
    res.render('error', { error: 'Error actualizando la habitación' });
  }
  
});

/* Actualizar el estado de una incidencia de una habitación */
router.put('/:idH/incidencias/:idI', autenticacion, async (req, res) => {
  try {
    const habitacion = await Habitacion.findById(req.params.idH);
    if (!habitacion) {
      return res.render('error', { error: 'Habitación no encontrada' });
    }
    
    const incidencia = habitacion.incidencias.id(req.params.idI);

    if (!incidencia) {
      return res.render('error', { error: 'Incidencia no encontrada' });
    }

    incidencia.fechaFin = new Date();
    const habitacionActualizada = await habitacion.save();
    res.redirect(req.baseUrl+'/'+req.params.idH);
  } catch (error) {
    res.render('error', { error: 'Error en la actualización de la incidencia' });
  }
});

module.exports = router;
