const express = require('express');
const router = express.Router();


// Ruta de inicio
router.get('/', (req, res) => {
    res.render('departamental/index',{title: 'Inicio'});
});

// Ruta de nueva venta
router.get('/CyD', (req, res) => {
    res.render('departamental/cyd',{title: 'Consistencias⛺'});
});

// Ruta de venta
router.get('/Perfil', (req, res) => {
    res.render('departamental/perfil',{title: 'Perfil🔑'});
});

// Ruta de clientes
router.get('/Bonozona', (req, res) => {
    res.render('departamental/bonozona',{title: 'Bono zona🙍‍♂️'});
});

// Ruta de nueva venta
router.get('/Servicioitem', (req, res) => {
    res.render('departamental/servicioitem',{title: 'Servicio Item 💰'});
});

// Ruta de X carnet
router.get('/Xcarnet', (req, res) => {
    res.render('departamental/xcarnet',{title: 'X Carnet 💰'});
});

// Ruta de X nombre
router.get('/Xnombre', (req, res) => {
    res.render('departamental/xnombre',{title: 'X Nombre🙍‍♂️'});
});

// Ruta de nueva venta
router.get('/Acefalias', (req, res) => {
    res.render('departamental/acefalias',{title: 'Acefalias 💰'});
});

// Ruta de Acefalias
router.get('/MostrarAcefalias', (req, res) => {
    res.render('epartamental/mostraracefalias',{title: 'Mostrar Acefalias⛺'});
});

module.exports = router;
