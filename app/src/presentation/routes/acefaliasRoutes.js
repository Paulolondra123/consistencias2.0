/*****************conection 3*********************/

const express = require('express')
const router = express.Router()
const Users = require('../controllers/acefalias_controller')


// Ruta para obtener todas las medidas
router.post('/acefalias', Users.getAll)
 
// Ruta para obtener todas las medidas
router.post('/mostraracefalias', Users.acefa)
 
module.exports = router 