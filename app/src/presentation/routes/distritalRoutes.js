const express = require('express');
const router = express.Router();

// Ruta de inicio
router.get('/', (req, res) => {
    res.render('distrital/index',{title: 'Inicio'});
});

// Ruta de nueva venta
router.get('/CyD', (req, res) => {
    res.render('distrital/cyd',{title: 'Consistencias ⚙'});
});

// Ruta de venta
router.get('/Perfil', (req, res) => {
    res.render('distrital/perfil',{title: 'Perfil🔑'});
});

// Ruta de nueva venta
router.get('/Bonozona', (req, res) => {
    res.render('distrital/bonozona',{title: 'Bono zona 💰'});
});

// Ruta de nueva venta
router.get('/Servicioitem', (req, res) => {
    res.render('distrital/servicioitem',{title: 'Servicio Item 💰'});
});

// Ruta de nueva venta
router.get('/Xcarnet', (req, res) => {
    res.render('distrital/xcarnet',{title: 'X Carnet 💰'});
});

// Ruta de nueva venta
router.get('/Acefalias', (req, res) => {
    res.render('distrital/acefalias',{title: 'Acefalias 💰'});
});

// Ruta de Acefalias
router.get('/MostrarAcefalias', (req, res) => {
    res.render('distrital/mostraracefalias',{title: 'Mostrar Acefalias⛺'});
});
 
module.exports = router;
