const express = require('express');
//const AuthController = require('../controllers/authController');
const router = express.Router();
const departamentalRoutes = require('./departamentalRoutes'); // Importa las rutas del vendedor
const distritalRoutes = require('./distritalRoutes'); // Importa las rutas del vendedor

// Ruta de inicio
router.get('/', (req, res) => {
    res.render('index',{title: 'Inicio'});
});

// Ruta de login
router.get('/login', (req, res) => {
    res.render('login',{title: 'Login🔑'});
});

// Ruta de perfil
router.get('/Perfil', (req, res) => {
    res.render('perfil',{title: 'Perfil🔑'});
});
  
// Ruta de usuarios
router.get('/Usuarios', (req, res) => {
    res.render('usuarios',{title: 'Usuarios 👩‍🎨'});
});
  
// Ruta de medidas
router.get('/Cyd', (req, res) => {
    res.render('cyd',{title: 'Consistencias ⚙'});
});

// Ruta de categorias
router.get('/Bonozona', (req, res) => {
    res.render('bonozona',{title: 'Bono zona 💰'});
});

// Ruta de Servicio item
router.get('/Servicioitem', (req, res) => {
    res.render('servicioitem',{title: 'Servicio Item📦'});
});

// Ruta de X carnet
router.get('/Xcarnet', (req, res) => {
    res.render('xcarnet',{title: 'X Carnet🙍‍♂️'});
});

// Ruta de Acefalias
router.get('/Acefalias', (req, res) => {
    res.render('acefalias',{title: 'Acefalias⛺'});
});

// Ruta de Acefalias
router.get('/MostrarAcefalias', (req, res) => {
    res.render('mostraracefalias',{title: 'Mostrar Acefalias⛺'});
});

// Ruta de Informacion UE CEA CEE    
router.get('/InformacionUE', (req, res) => {
    res.render('informacion_ue_cea_cee',{title: 'Informacion⛺⛺⛺'});
});


// Ruta de proveedores
/*router.get('/Proveedores', (req, res) => {
    res.render('proveedores',{title: 'Proveedores🚚'});
});

// Ruta de nueva compra
router.get('/Nueva-compra', (req, res) => {
    res.render('nueva_compra',{title: 'Nueva compra📝'});
});
 */
// Ruta de compras
/* router.get('/Compras', (req, res) => {
    res.render('compras',{title: 'Compras📝'});
}); */

// Usa las rutas específicas para el departamental
router.use('/departamental', departamentalRoutes);

// Usa las rutas específicas para el vendedor
router.use('/distrital', distritalRoutes);

module.exports = router;
