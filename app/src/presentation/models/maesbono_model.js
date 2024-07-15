/*****************conection 1*********************/

//consultas para obtener datos de base de la db
const { connectToMssql, disconnectFromMssql} = require("../../infrastructure/database/db");
//const { connectToPostgres, disconnectFromPostgres } = require('../config/index');
const mssql = require('mssql');


class Usersmodel {
  // Método para obtener todas las medidas
  static async getAll( gestion, mes, coddis) {
    try {
      const pool = await connectToMssql();
      if (!pool) {
        throw new Error("Error al conectar con PostgreSQL");
      }

      let query = 
      `
      select     RDA.cod_rda RDA, (RTRIM(b.carnet)+' - '+RTRIM(b.paterno)+' '+RTRIM(b.materno)+' '+RTRIM(b.nombre1)+' '+RTRIM(b.nombre2)) MAESTRO_A,  (RTRIM(B.Cargo)+' - '+RTRIM(c.Descripcion))CARGO, (RTRIM(substring(b.servicio, 4, 5))+' - '+RTRIM(b.item)) SERVICIO_ITEM
        FROM	 b_planilla b INNER JOIN
              b_rue r on b.cod_ue = r.cod_ue inner join
              b_distrito s on b.cod_dis = s.cod_dis inner join
              b_cargo c on b.cargo=c.cargo inner join 
              B_rda	rda on b.carnet=rda.carnet
        where     (b.gestion = ${gestion}) and (b.mes = ${mes}) AND B.COD_DEP=7 AND B.CARNET<>'00000000' AND B.bonozona>0  AND SUBSTRING(B.servicio, 8, 1) IN (1,2,3,4,5,6,7,8) AND B.COD_UE=${coddis} 
         ORDER BY B.SERVICIO, B.ITEM
      `;

      const result = await pool.request().query(query);
      await disconnectFromMssql(pool);
      //console.log(result.recordset) 
      if (result.recordset.length === 0) {
        return {
          data: null,
          error: true,
          message: "No hay registros",
        };
      }
      return { data: result.recordset, error: false };
    } catch (error) {
      return { data: null, error: true, message: error.message };
    }
  }
}

module.exports = Usersmodel;