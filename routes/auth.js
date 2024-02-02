/* Enrutador para usuarios */

const express = require("express");
const Usuario = require(__dirname + "/../models/usuario.js");
let router = express.Router();

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/habitaciones');
});

router.post('/login', (req, res) => {
    let login = req.body.login;
    let password = req.body.password;
    Usuario.findOne({ login: login, password: password }).then(resultado => {
        if(resultado) {
            req.session.usuario = resultado.login;
            res.redirect('/habitaciones');
        } else
            res.render('login', {error: 'Usuario o contraseña incorrectos. Inténtelo de nuevo.'});
    }).catch(error => {
        res.render('login', {error: 'Usuario o contraseña incorrectos. Inténtelo de nuevo.'});
    });
});

module.exports = router;