const axios = require('axios');
const mongoose = require('mongoose');
const Habitacion = require(__dirname + "/models/habitacion");
const Limpieza = require(__dirname + "/models/limpieza");
const Usuario = require(__dirname + "/models/usuario");

mongoose.connect('mongodb://127.0.0.1:27017/hotel');

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    }
});

/*************** Funciones auxiliares ****************/

// Configuración del token de autenticación para las siguientes solicitudes
const setToken = (token) => {
    if (token) {
        axiosInstance.defaults.headers.common['authorization'] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common['authorization'];
    }
};

const borrarDatos = async() => {

    console.log("Borrando colección de habitaciones");
    await mongoose.connection.collections['habitaciones'].drop();
    console.log("Borrando colección de limpiezas");
    await mongoose.connection.collections['limpiezas'].drop();
    console.log("Borrando colección de usuarios");
    await mongoose.connection.collections['usuarios'].drop();

}

// Cargar datos de inicio
const cargarDatos = async() => {
    
    let habitaciones = [
        new Habitacion({
            _id: "1a1a1a1a1a1a1a1a1a1a1a1a",
            numero: 1,
            tipo: "doble",
            descripcion: "Habitación doble, cama XL, terraza con vistas al mar",
            ultimaLimpieza: new Date("2023-09-20T11:24:00Z"),
            precio: 59.90,
            incidencias: [
                {_id: "10011a1a1a1a1a1a1a1a1a1a",
                 descripcion: "No funciona el aire acondicionado",
                 fechaInicio: new Date("2023-09-19T18:12:54Z")},
                {_id: "10021a1a1a1a1a1a1a1a1a1a",
                 descripcion: "No funciona el interruptor del aseo",
                 fechaInicio: new Date("2023-09-20T10:15:06Z")}
            ]
        }),
        new Habitacion({
            _id: "2b2b2b2b2b2b2b2b2b2b2b2b",
            numero: 2,
            tipo: "familiar",
            descripcion: "Habitación familiar, cama XL y literas, aseo con bañera",
            ultimaLimpieza: new Date("2023-08-02T10:35:15Z"),
            precio: 65.45
        }),
        new Habitacion({
            _id: "3c3c3c3c3c3c3c3c3c3c3c3c",
            numero: 3,
            tipo: "familiar",
            descripcion: "Habitación familiar, cama XL y sofá cama, cocina con nevera",
            precio: 69.15
        }),
        new Habitacion({
            _id: "4d4d4d4d4d4d4d4d4d4d4d4d",
            numero: 4,
            tipo: "suite",
            descripcion: "Habitación con dos camas XL, terraza y vistas al mar",
            ultimaLimpieza: new Date("2023-10-10T12:05:10Z"),
            precio: 110.20,
            incidencias: [
                {_id: "10014d4d4d4d4d4d4d4d4d4d",
                 descripcion: "No funciona el jacuzzi",
                 fechaInicio: new Date("2023-10-08T19:24:43Z")}
            ]
        }),
        new Habitacion({
            _id: "5e5e5e5e5e5e5e5e5e5e5e5e",
            numero: 5,
            tipo: "individual",
            descripcion: "Habitación simple, cama 150",
            precio: 34.65
        })
    ];
    
    let limpiezas = [
        new Limpieza({
            _id: "20011a1a1a1a1a1a1a1a1a1a",
            idHabitacion: "1a1a1a1a1a1a1a1a1a1a1a1a",
            fechaHora: new Date("2023-09-18T10:59:12Z"),
            observaciones: "Dejan toallas para cambiar"
        }),
        new Limpieza({
            _id: "20021a1a1a1a1a1a1a1a1a1a",        
            idHabitacion: "1a1a1a1a1a1a1a1a1a1a1a1a",
            fechaHora: new Date("2023-09-20T11:24:00Z")
        }),
        new Limpieza({
            _id: "20012b2b2b2b2b2b2b2b2b2b",
            idHabitacion: "2b2b2b2b2b2b2b2b2b2b2b2b",
            fechaHora: new Date("2023-08-02T10:35:15Z"),
            observaciones: "Desperfectos en puerta del aseo"
        }),
        new Limpieza({
            _id: "20013c3c3c3c3c3c3c3c3c3c",
            idHabitacion: "3c3c3c3c3c3c3c3c3c3c3c3c"
        }),
        new Limpieza({
            _id: "20014d4d4d4d4d4d4d4d4d4d",
            idHabitacion: "4d4d4d4d4d4d4d4d4d4d4d4d",
            fechaHora: new Date("2023-10-09T11:00:25Z")
        }),
        new Limpieza({
            _id: "20024d4d4d4d4d4d4d4d4d4d",
            idHabitacion: "4d4d4d4d4d4d4d4d4d4d4d4d",
            fechaHora: new Date("2023-10-10T12:05:10Z")
        }),
        new Limpieza({
            _id: "20015e5e5e5e5e5e5e5e5e5e",
            idHabitacion: "5e5e5e5e5e5e5e5e5e5e5e5e"
        }),
    ]
    
    let usuarios = [
        new Usuario({login:"usuario1", password: "password1"}),
        new Usuario({login:"admin", password:"12345678"})
    ];
    
    for(let i = 0; i < habitaciones.length; i++)
        await habitaciones[i].save();
    for(let i = 0; i < limpiezas.length; i++)
        await limpiezas[i].save();
    for(let i = 0; i < usuarios.length; i++)
        await usuarios[i].save();
}

// Función principal de ejecución de pruebas
const ejecutarPruebas = async() => {

    console.log("Borrando datos...");
    await borrarDatos();

    await obtenerHabitacionesIncorrecta();

    console.log("Cargando datos...");
    await cargarDatos();

    console.log("\nPRUEBAS BÁSICAS");
    console.log("===============");
    await obtenerHabitaciones();
    await habitacionIncorrecta();
    await loginIncorrecto();
    await insercionNoPermitida();
    let token = await loginCorrecto();
    let id = await insertarHabitacion(token);
    await fichaHabitacion(id);
    await actualizarHabitacion(token, id);
    await borrarHabitacion(token, id);
    await obtenerLimpiezas();

    console.log("\n\nPRUEBAS COMPLEMENTARIAS");
    console.log("=======================");
    await obtenerEstadoSinLimpiar("1a1a1a1a1a1a1a1a1a1a1a1a");
    let habitacionLimpia = await limpiarHabitacion(token);
    await obtenerEstadoLimpia();

    let incidencia = await nuevaIncidencia(token);
    await actualizarIncidencia(incidencia, token);
    await actualizarUltimaLimpieza(habitacionLimpia, token);      
    await actualizarTodasUltimasLimpiezas();
    await insertarHabitacionNumeroIncorrecto(token);

    await actualizarHabitacionDatosIncorrectos(token,id);

    mongoose.disconnect();
}

// Obtener cantidad de incidencias de una habitación
const obtenerCantidadIncidencias = async (id) => {
    try {
        const respuesta = await axiosInstance.get(`/habitaciones/${id}`);
        if(respuesta.status == 200)
        {
            return respuesta.data.resultado.incidencias.length;
        }
        else
            throw new Error();
    } catch (error) {
        return -1;
    }
};

/*************** Tests 1 ****************/

// Prueba de listado de habitaciones
const obtenerHabitaciones = async () => {
    try {
        const respuesta = await axiosInstance.get('/habitaciones');
        if(respuesta.status == 200 && respuesta.data.resultado.length >= 0)
            console.log("OK - Listado habitaciones");
        else
            throw new Error();
    } catch (error) {
        console.log("ERROR - Listado habitaciones");
    }
};

// Prueba de listado de habitaciones
const habitacionIncorrecta = async () => {
    try {
        const respuesta = await axiosInstance.get('/habitaciones/000000000000000000000000');
        console.log("ERROR - Habitación incorrecta");
    } catch (error) {
        if(error.response.status == 400)
            console.log("OK - Habitación incorrecta");
        else
            console.log("ERROR - Habitación incorrecta");
    }
};

// Prueba de inserción sin autenticación
const insercionNoPermitida = async () => {
    const hab1 = {
        numero: 20, 
        tipo: "individual", 
        descripcion: "Habitación No Permitida", 
        precio: 75
    };

    try {
        const respuesta = await axiosInstance.post('/habitaciones', hab1);
        console.log("ERROR - Habitación no permitida");
    } catch(error) {
        if(error.response.status == 403)
            console.log("OK - Habitación no permitida");
        else
            console.log("ERROR - Habitación no permitida");
    }
}


// Prueba de login incorrecto
const loginIncorrecto = async () => {
    try {
        const respuesta = await axiosInstance.post('/auth/login', {
            login: 'aa',  
            password: 'bb'
        });
        console.log("ERROR - Login incorrecto");
    } catch (error) {
        if (error.response.status == 401)
            console.log("OK - Login incorrecto");
        else
            console.log("ERROR - Login incorrecto");
    }
};

// Prueba de login correcto
const loginCorrecto = async () => {
    try {
        const respuesta = await axiosInstance.post('/auth/login', {
            login: 'usuario1',    
            password: 'password1' 
        });
        if (respuesta.status == 200)
        {
            console.log("OK - Login");
            return respuesta.data.resultado;  // Devolvemos el token del resultado
        }
        else
            throw new Error();
    } catch (error) {
        console.log(error);
        console.log("Error - Login");
        return null;
    }
};

// Prueba de inserción con token de autorización
const insertarHabitacion = async (token) => {
    // Usamos la función anterior para guardar el token
    setToken(token);
    const hab1 = {
        numero: 11, 
        tipo: "individual", 
        descripcion: "Habitación Axios", 
        precio: 101
    };

    try {
        const respuesta = await axiosInstance.post('/habitaciones', hab1);
        if(respuesta.status == 200) 
        {
            console.log("OK - Insertar habitación");
            return respuesta.data.resultado._id;
        }
        else
            throw new Error();
    } catch(error) {
        console.log("ERROR - Insertar habitación");
        return -1;
    }
}

// Prueba de ficha de habitacion
const fichaHabitacion = async (id) => {
    try {
        const respuesta = await axiosInstance.get(`/habitaciones/${id}`);
        if(respuesta.status == 200 && respuesta.data.resultado)
            console.log("OK - Ficha habitación");
        else
            throw new Error();
    } catch (error) {
        console.log("ERROR - Ficha habitación");
    }
};

// Prueba de actualizar habitación con token de autorización
const actualizarHabitacion = async (token, id) => {
    // Usamos la función anterior para guardar el token
    setToken(token);
    const datos = {
        numero: 11, 
        tipo: "individual", 
        descripcion: "Habitación Axios modificada", 
        precio: 102
    };

    try {
        const respuesta = await axiosInstance.put(`/habitaciones/${id}`, datos);
        if(respuesta.status == 200) 
            console.log("OK - Actualizar habitación");
        else
            throw new Error();
    } catch(error) {
        console.log("ERROR - Actualizar habitación");
    }
}

// Prueba de borrar habitación con token de autorización
const borrarHabitacion = async (token, id) => {
    // Usamos la función anterior para guardar el token
    setToken(token);

    try {
        const respuesta = await axiosInstance.delete(`/habitaciones/${id}`);
        if(respuesta.status == 200) 
            console.log("OK - Borrar habitación");
        else
            throw new Error();
    } catch(error) {
        console.log("ERROR - Borrar habitación");
    }
}

// Prueba para obtener las limpiezas de una habitación
const obtenerLimpiezas = async () => {
    try {
        const respuesta = await axiosInstance.get('/limpiezas/1a1a1a1a1a1a1a1a1a1a1a1a');
        if(respuesta.status == 200 && respuesta.data.resultado.length >= 0)
            console.log("OK - Listado limpiezas");
        else
            throw new Error();
    } catch (error) {
        console.log("ERROR - Listado limpiezas");
    }
};

/*************** Tests 2 ****************/

// Prueba de actualizar habitación con datos incorrectos y token de autorización
const actualizarHabitacionDatosIncorrectos = async (token, id) => {
    // Usamos la función anterior para guardar el token
    setToken(token);
    const datos = {
        numero: 1000, 
        tipo: "individual", 
        descripcion: "Habitación Axios modificada", 
        precio: 102
    };

    try {
        const respuesta = await axiosInstance.put(`/habitaciones/${id}`, datos);
        console.log("ERROR - Actualizar habitación con datos incorrectos");        
    } catch(error) {
        if (error.response.status == 400)
            console.log("OK - Actualizar habitación con datos incorrectos");
        else            
            console.log("ERROR - Actualizar habitación con datos incorrectos");
    }
}


// Prueba de inserción campo 'numero' incorrecto con token de autorización
const insertarHabitacionNumeroIncorrecto = async (token) => {
    // Usamos la función anterior para guardar el token
    setToken(token);
    const hab1 = {
        numero: 1000, 
        tipo: "individual", 
        descripcion: "Habitación Axios", 
        precio: 101
    };

    try {
        const respuesta = await axiosInstance.post('/habitaciones', hab1);
        console.log("ERROR - Insertar habitación con número incorrecto");                
    } catch(error) {
        if (error.response.status == 400)
            console.log("OK - Insertar habitación con número incorrecto");
        else
            console.log("ERROR - Insertar habitación con número incorrecto");        
    }
}

// Prueba de listado de habitaciones sin habitaciones registradas
const obtenerHabitacionesIncorrecta = async () => {
    try {
        const respuesta = await axiosInstance.get('/habitaciones'); 
        console.log("ERROR - No hay habitaciones registradas");       
    } catch (error) {
        if (error.response.status == 500)
            console.log("OK - No hay habitaciones registradas");
        else
            conmsole.log("ERROR - No hay habitaciones registradas");
    }
};

// Prueba de estado sin limpiar de habitaciones
const obtenerEstadoSinLimpiar = async (id) => {
    try {        
        const respuesta = await axiosInstance.get(`/limpiezas/${id}/estadolimpieza`);         
        if(respuesta.status == 200 && respuesta.data.resultado.toLowerCase().trim() == "pendiente de limpieza")
            console.log("OK - Estado sin limpiar");        
        else           
            throw new Error();
    } catch (error) {        
        console.log("ERROR - Estado sin limpiar");
    }
};

// Limpiar una habitación hoy
const limpiarHabitacion = async (token) => {
    // Usamos la función anterior para guardar el token
    setToken(token);
    const limp = {
        observaciones: "Todo correcto"
    };

    try {
        const respuesta = await axiosInstance.post('/limpiezas/2b2b2b2b2b2b2b2b2b2b2b2b', limp);        
        if(respuesta.status == 200 && respuesta.data.resultado.idHabitacion == "2b2b2b2b2b2b2b2b2b2b2b2b") 
        {
            console.log("OK - Limpiar habitación");
            return respuesta.data.resultado;
        }
        else
            throw new Error();
    } catch(error) {
        console.log("ERROR - Limpiar habitación");
        return null;
    }
}

// Prueba de estado limpia de habitaciones
const obtenerEstadoLimpia = async () => {
    try {
        const respuesta = await axiosInstance.get('/limpiezas/2b2b2b2b2b2b2b2b2b2b2b2b/estadolimpieza');         
        if(respuesta.status == 200 && respuesta.data.resultado.toLowerCase().trim() == "limpia")
            console.log("OK - Estado limpia");
        else
            throw new Error();
    } catch (error) {
        console.log("ERROR - Estado limpia");
    }
};

// Añadir incidencia en habitación
const nuevaIncidencia = async (token) => {
    // Usamos la función anterior para guardar el token
    setToken(token);
    const incid = {
        descripcion: "Descripción de prueba"
    };

    try {
        let cantidadPrevia = await obtenerCantidadIncidencias("2b2b2b2b2b2b2b2b2b2b2b2b");
        const respuesta = await axiosInstance.post('/habitaciones/2b2b2b2b2b2b2b2b2b2b2b2b/incidencias', incid);
        let cantidadPosterior = await obtenerCantidadIncidencias("2b2b2b2b2b2b2b2b2b2b2b2b");
        if(respuesta.status == 200 && cantidadPosterior == cantidadPrevia + 1) 
        {
            console.log("OK - Nueva incidencia");
            return respuesta.data.resultado.incidencias[respuesta.data.resultado.incidencias.length-1];
        }
        else
            throw new Error();
    } catch(error) {
        console.log("ERROR - Nueva incidencia");
        return null;
    }
}

// Actualizar incidencia en habitación
const actualizarIncidencia = async (incidencia, token) => {
    // Usamos la función anterior para guardar el token
    setToken(token);

    try {
        const respuesta = await axiosInstance.put(`/habitaciones/2b2b2b2b2b2b2b2b2b2b2b2b/incidencias/${incidencia._id}`);
        let ultimaIncidencia = respuesta.data.resultado.incidencias[respuesta.data.resultado.incidencias.length - 1];
        if(respuesta.status == 200 && ultimaIncidencia.fechaFin) 
        {
            console.log("OK - Actualizar incidencia");
        }
        else
            throw new Error();
    } catch(error) {
        console.log("ERROR - Actualizar incidencia");
    }
}

// Prueba de ultima limpieza de habitación
const actualizarUltimaLimpieza = async (limpieza, token) => {
    setToken(token);
    try {
        const respuesta = await axiosInstance.put(`/habitaciones/${limpieza.idHabitacion}/ultimalimpieza`);
        if(respuesta.status == 200 && respuesta.data.resultado.ultimaLimpieza == limpieza.fechaHora)
            console.log("OK - Actualizar última limpieza");
        else
            throw new Error();
    } catch (error) {
        console.log("ERROR - Actualizar última limpieza");
    }
};

// Prueba para actualizar todas las ultimas limpiezas
const actualizarTodasUltimasLimpiezas = async() => {
    try {
        const respuesta = await axiosInstance.put(`/habitaciones/ultimaLimpieza`);
        if(respuesta.status == 200 && respuesta.data.resultado.length >= 0)
            console.log("OK - Actualizar todas las últimas limpiezas");
        else
            throw new Error();
    } catch(error) {
        console.log("ERROR - Actualizar todas las últimas limpiezas" + error);
    }
};

/*************** Main ****************/
ejecutarPruebas();