
/*****************conection 1*********************/

//consultas para obtener datos de base de la db
const { connectToMssql, disconnectFromMssql} = require("../../infrastructure/database/db");
//const { connectToPostgres, disconnectFromPostgres } = require('../config/index');
const mssql = require('mssql');

class Usersmodel {
  // Método para obtener todas las medidas
  static async getAll(nombres, apellidopa, apellidoma) {
    try {
      
      const pool = await connectToMssql();
      if (!pool) {
        throw new Error("Error al conectar con PostgreSQL");
      }

      let baseQuery = `
        SELECT   
            rda.carnet,
            (RTRIM(rda.paterno) + ' ' + RTRIM(rda.materno) + ' ' + RTRIM(rda.nombre1) + ' ' + RTRIM(rda.nombre2)) MAESTRO_A
        FROM   
            b_rda rda
        WHERE
            1 = 1
      `;

      // Condicionalmente añadir las partes de la consulta basadas en los parámetros proporcionados
      if (apellidopa) {
        baseQuery += ` AND rda.paterno LIKE '%${apellidopa}%'`;
      }
      if (apellidoma) {
        baseQuery += ` AND rda.materno LIKE '%${apellidoma}%'`;
      }
      if (nombres) {
        baseQuery += ` AND (RTRIM(rda.nombre1) + ' ' + RTRIM(rda.nombre2)) LIKE '%${nombres}%'`;
      }

      baseQuery += `
        ORDER BY rda.carnet
      `;

      
      const result = await pool.request().query(baseQuery);
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

  static async carnet(carnet) {
    try {

      const pool = await connectToMssql();
      if (!pool) {
        throw new Error("Error al conectar con PostgreSQL");
      }
      let query = `
      select  
            RTRIM(B.MES) MES, 
            (RTRIM(s.cod_dis)+' - '+ RTRIM(s.descripcion)) DISTRITO_EDUCATIVO, 
            (RTRIM(r.cod_ue)+' - '+ RTRIM(r.des_ue)) UNIDAD_EDUCATIVA, 
            (RTRIM(b.paterno)+' '+RTRIM(b.materno)+' '+RTRIM(b.nombre1)+' '+RTRIM(b.nombre2)) MAESTRO_A,
            (RTRIM(B.Cargo)+' - '+RTRIM(c.Descripcion))CARGO, 
            (RTRIM(substring(b.servicio, 4, 5))+' - '+RTRIM(b.item)) SERVICIO_ITEM, 
            RTRIM(b.horas) HORAS, RTRIM(B.SUMAHAB) TOTAL_GANADO
      from   b_planilla b inner join
            b_rue r on b.cod_ue = r.cod_ue inner join
            b_distrito s on b.cod_dis = s.cod_dis inner join
            b_cargo c on b.cargo=c.cargo 			 
      where  (b.gestion = 2024) AND B.CARNET=${carnet} ORDER BY B.MES,S.cod_dis, B.servicio, B.ITEM 

      `
      
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