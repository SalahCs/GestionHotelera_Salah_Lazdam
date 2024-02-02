/* Librerías */
const express = require('express');
const { autenticacion } = require('../utils/auth');
const auth = require(__dirname + '/../auth/auth.js');

const Limpieza = require(__dirname + "/../models/limpieza.js");
const Habitacion = require(__dirname + "/../models/habitacion.js");

const router = express.Router();

/* Limpiezas de una habitación */
router.get('/:id', async (req, res) => {
  try {
    const limpiezas = await Limpieza.find({ idHabitacion: req.params.id }).sort({ fechaHora: -1 });
    const habitacion = await Habitacion.findById(req.params.id);
    res.render('limpieza_listado', { limpiezas: limpiezas, habitacion: habitacion });
  } catch (error) {            
    return res.render('error', { error: 'No hay limpiezas registradas para esa habitación' });
  }    
}); 

/* Actualizar limpieza */
router.post('/:id', (req, res) => {
  if(req.params.id){
      let nuevaLimpieza = new Limpieza({
          idHabitacion: req.params.id,
          fechaHora: req.body.fecha_limpieza,
      });

      if(req.body.observaciones){
          nuevaLimpieza.observaciones = req.body.observaciones;
      }

      nuevaLimpieza.save().then(resultado => {
          if(resultado){
              Habitacion.findById(req.params.id).then(habitacion => {
                  Limpieza.find({idHabitacion: habitacion.id}).sort({fechaHora: -1}).then(resultadoLimpieza => {
                      habitacion.ultimaLimpieza = resultadoLimpieza[0].fechaHora;
                      habitacion.save().then(()=>{
                          res.render('limpieza_listado', {limpiezas: resultadoLimpieza, habitacion: habitacion});
                      });
                  }).catch(error => {
                      res.render('error', {error: 'Error actualizando limpieza.'});
                  });
              }).catch(error => {
                  res.render('error', {error: 'Error actualizando limpieza.'});
              });
          }
      }).catch(error => {
          res.render('error', {error: 'Error actualizando limpieza.'});
      });
  }
  else{
      res.render('error', {error: 'Error actualizando limpieza.'});
  }
});


router.get('/nueva/:id', autenticacion, (req, res) => {
  Habitacion.findById(req.params.id).then(habitacion => {
      let fechaActual = new Date();
      let anyo = fechaActual.getFullYear();
      let mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
      let dia = fechaActual.getDate();
      res.render('limpiezas_nueva', {habitacion: habitacion, anyo: anyo, mes: mes, dia: dia});
  }).catch(error => {
      res.render('error', {error: 'No se ha encontrado la habitación solicitada.'});
  });
});

module.exports = router;