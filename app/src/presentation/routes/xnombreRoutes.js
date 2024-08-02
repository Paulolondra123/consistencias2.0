/*****************conection 3*********************/

const express = require('express')
const router = express.Router()
const Users = require('../controllers/xnombre_controller')


// Ruta para obtener todas las medidas
router.post('/xnombre', Users.getAll)

// Ruta para obtener todas las medidas
router.post('/mostrarporcarnet', Users.carnet)
 
module.exports = router 