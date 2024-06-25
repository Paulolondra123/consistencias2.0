const express = require('express');
const router = express.Router();

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


module.exports = router;
