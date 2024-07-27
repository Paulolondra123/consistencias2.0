/*****************conection 2*********************/

const Usersmodel = require("../models/acefalias_model"); // Importa el modelo ProductosModel

class Users {
  // Método para obtener todas las medidas
  static async getAll(req, res) {
    try {
      const { gestion, mes, distrito } = req.body;
      const data = await Usersmodel.getAll( gestion, mes, distrito);

      if (!data) {
        return res.status(404).json({ error: message });
      }
      //console.log(data)
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async acefa(req, res) {
    try {
      const { servicio, item, gestion } = req.body;
      const data = await Usersmodel.acefa( servicio, item, gestion);

      if (!data) {
        return res.status(404).json({ error: message });
      }
      //console.log(data)
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
}

module.exports = Users;
