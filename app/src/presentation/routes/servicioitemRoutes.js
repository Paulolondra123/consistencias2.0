/*****************conection 3*********************/

const express = require('express')
const router = express.Router()
const Users = require('../controllers/servicioitem_controller')


// Ruta para obtener todas las medidas
router.post('/servicioitem', Users.getAll)
 
module.exports = router 