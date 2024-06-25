const express = require('express');
const router = express.Router();

// Ruta de nueva venta
router.get('/CyD', (req, res) => {
    res.render('distrital/cyd',{title: 'Consistencias⛺'});
});

// Ruta de venta
router.get('/Perfil', (req, res) => {
    res.render('distrital/perfil',{title: 'Perfil🔑'});
});

// Ruta de nueva venta
router.get('/Bonozona', (req, res) => {
    res.render('distrital/bonozona',{title: 'Bono zona⛺'});
});

 
module.exports = router;
