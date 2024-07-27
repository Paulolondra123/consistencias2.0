
/*****************conection 1*********************/

//consultas para obtener datos de base de la db
const { connectToMssql, disconnectFromMssql} = require("../../infrastructure/database/db");
//const { connectToPostgres, disconnectFromPostgres } = require('../config/index');
const mssql = require('mssql');

class Usersmodel {
  // Método para obtener todas las medidas
  static async getAll(servicio, item, gestion, distrito) {
    try {
      
      const pool = await connectToMssql();
      if (!pool) {
        throw new Error("Error al conectar con PostgreSQL");
      }

      let query = '';

      if (distrito === 700) {
        query = `
            SELECT 
                RTRIM(B.MES) MES,
                (RTRIM(s.cod_dis) + ' - ' + RTRIM(s.descripcion)) AS DISTRITO_EDUCATIVO, 
                (RTRIM(r.cod_ue) + ' - ' + RTRIM(r.des_ue)) AS UNIDAD_EDUCATIVA,
                rtrim(b.paterno) AS ESTADO_PLANILLA,
                (RTRIM(B.Cargo) + ' - ' + RTRIM(c.Descripcion)) AS CARGO, 
                (RTRIM(SUBSTRING(b.servicio, 4, 5)) + ' - ' + RTRIM(b.item)) AS SERVICIO_ITEM, 
                RTRIM(b.horas) AS HORAS
            FROM 
                b_planilla b 
            INNER JOIN
                b_rue r ON b.cod_ue = r.cod_ue 
            INNER JOIN
                b_distrito s ON b.cod_dis = s.cod_dis 
            INNER JOIN
                b_cargo c ON b.cargo = c.cargo 			 
            WHERE 
                b.gestion = ${gestion} 
                AND SUBSTRING(b.servicio, 4, 5) = ${servicio} 
                AND b.item = ${item} 
                AND b.carnet = 00000000 
                AND b.cod_dep = 7 
            ORDER BY 
                    B.MES, s.cod_dis, b.servicio, b.item;
      `
      } else {
        query = `
            SELECT 
                RTRIM(B.MES) MES,
                (RTRIM(s.cod_dis) + ' - ' + RTRIM(s.descripcion)) AS DISTRITO_EDUCATIVO, 
                (RTRIM(r.cod_ue) + ' - ' + RTRIM(r.des_ue)) AS UNIDAD_EDUCATIVA,
                rtrim(b.paterno) AS ESTADO_PLANILLA,
                (RTRIM(B.Cargo) + ' - ' + RTRIM(c.Descripcion)) AS CARGO, 
                (RTRIM(SUBSTRING(b.servicio, 4, 5)) + ' - ' + RTRIM(b.item)) AS SERVICIO_ITEM, 
                RTRIM(b.horas) AS HORAS
            FROM 
                b_planilla b 
            INNER JOIN
                b_rue r ON b.cod_ue = r.cod_ue 
            INNER JOIN
                b_distrito s ON b.cod_dis = s.cod_dis 
            INNER JOIN
                b_cargo c ON b.cargo = c.cargo 			 
            WHERE 
                b.gestion = ${gestion} 
                AND SUBSTRING(b.servicio, 4, 5) = ${servicio} 
                AND b.item = ${item} 
                AND b.carnet = 00000000 
                AND b.cod_dep = 7 
                AND B.COD_DIS = ${distrito}
            ORDER BY 
                    B.MES, s.cod_dis, b.servicio, b.item;
      `
      }
      ;
      
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