/* Esquema de las incidencias registradas en las habitaciones */

const mongoose = require("mongoose");

let incidenciaSchema = new mongoose.Schema({
    /* descripción de la incidencia: no funciona el aire acondicinado, etc */
    descripcion: {
        type: String,
        trim: true, 
        required: [true, "La descripción de la incidencia es obligatoria"],
    },
    /* fecha en la que se registra la incidencia */     
    fechaInicio: {
        type: Date,
        required: [true, "La fecha de la incidencia es obligatoria"],
        default: Date.now()
    }, 
    /* fecha en la que se resuelve la incidencia */
    fechaFin: {
        type: Date, 
        required: false
    },
    imagen: {
        type: String, 
        required: false
    }
});

/* Esquema y modelo que representa cada habitación del hotel.*/

let habitacionSchema = new mongoose.Schema({
    /* número de habitación */
    numero: {
        type: Number,
        required: [true, "El número de la habitación es obligatorio"],
        min: [1, "El número de la habitación debe ser mayor a 0"],
        max: [100, "El número de la habitación debe ser menor a 100"],         
    },
    /* tipo de habitación */
    tipo: {
        type: String,
        required: [true, "El tipo de la habitación es obligatorio"],
        enum: ["individual", "doble", "familiar", "suite"]
    },        
    /* descripción de la habitación: número de camas, tipo de cama, si tiene terraza, si tiene vistas, televisor, etc */
    descripcion: {
        type: String,
        required: [true, "La descripción de la habitación es obligatoria"],
        trim: true
    }, 
    /* */
    ultimaLimpieza: {
        type: Date,
        required: [true, "La fecha de la ultima limpieza es obligatoria"],
        default: Date.now()
    },    
    /* precio de la habitación por noche */
    precio: {
        type: Number,
        required: [true, "El precio de la habitación es obligatorio"],
        min: 0,
        max: 250
    },
    imagen: {
        type: String, 
        required: false
    },
    /* Array de incidencias producidas en la habitación */
    incidencias: [incidenciaSchema]
});

let Habitacion = mongoose.model('habitaciones', habitacionSchema);

module.exports = Habitacion;