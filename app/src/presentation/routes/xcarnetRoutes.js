/*****************conection 3*********************/

const express = require('express')
const router = express.Router()
const Users = require('../controllers/xcarnet_controller')


// Ruta para obtener todas las medidas
router.post('/xcarnet', Users.getAll)
 
module.exports = router 