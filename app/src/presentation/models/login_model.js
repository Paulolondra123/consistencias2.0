const { connectToMssql, disconnectFromMssql } = require('../../infrastructure/database/db');
const mssql = require('mssql')
const bcrypt = require('bcryptjs');

/* class User {
    static async findByUsername(username) {
      let client;
      try {
        client = await connectToPostgres();
        const query = 'SELECT * FROM usuario WHERE usuario = $1';
        const result = await client.query(query, [username]);
        return result.rows[0];
      } catch (error) {
        console.error('Error al buscar usuario:', error);
        throw error;
      } finally {
        if (client) await disconnectFromPostgres(client);
      }
    }
  
    static async verifyPassword(plainTextPassword, hashedPassword) {
      return await bcrypt.compare(plainTextPassword, hashedPassword);
    }
  }
  
  module.exports = User; */

  class buscarusers {
    static async getUsuario(username, password) {
        let pool;
        let response = { data: null, error: null };

        try {
            // Conectarse a la base de datos
            pool = await connectToMssql();
            if (!pool) {
                throw new Error('Error al conectar con PostgreSQL');
            }

            // Consultar la base de datos para obtener el usuario
            const query = `
                SELECT id_usuario, nombres, apellidos, perfil, usuario, contraseña, estado, fecha_registro, primerlogin 
                FROM usuario WHERE usuario = '${username}';
            `;
            // Ejecutar la consulta con parámetros
            const request = await pool.request()
            request.input('usuario', mssql.NVarChar, username);
            const result = await request.query(query);
            

            // Verificar si se encontró un usuario
            if (result.recordset.length > 0) {
                const usuario = result.recordset[0];
                // Verificar la contraseña
                const passwordMatch = await bcrypt.compare(password, usuario.contraseña);
                
                if (!passwordMatch) {
                    response.error = 'Contraseña incorrecta';
                } else if (!usuario.estado) {
                    response.error = 'Usuario está deshabilitado';
                } else {
                    // Devolver solo los datos necesarios del usuario
                    response.data = {
                        id: usuario.id_usuario,
                        nombres: usuario.nombres,
                        apellidos: usuario.apellidos,
                        usuario: usuario.usuario,
                        perfil: usuario.perfil,
                        fecha_registro: usuario.fecha_registro,
                        primerlogin: usuario.primerlogin,
                        estado: usuario.estado,
                    };
                }
            } else {
                response.error = 'Usuario no encontrado';
            }
        } catch (error) {
            response.error = error.message;
        } finally {
            // Desconectar de la base de datos
            if (pool) {
                await disconnectFromMssql(pool);
            }
            return response;
        }
    }   

    // Método para actualizar la contraseña de un usuario
    static async updatePassword(userId, nuevaContraseña) {
        let pool;
        try {

            pool = await connectToMssql();
            if (!pool) {
                throw new Error('Error al conectar con PostgreSQL');
            }

            // Buscar el usuario por ID
            const userResult = `SELECT * FROM usuario WHERE id_usuario = ${userId}`;
            
            const resul = await pool.request().query(userResult);

            const user = resul.recordset[0];

            if (!user) {
                throw new Error('Usuario no encontrado');
            }


            // Encriptar la nueva contraseña
            const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);

            // Actualizar la contraseña en la base de datos
            const query = `
                UPDATE usuario 
                SET contraseña = '${hashedPassword}' , primerlogin = 0 
                WHERE id_usuario = ${userId};
            `;

            const result = await pool.request().query(query);

            if (result.recordset === 0) {
                throw new Error('No se pudo actualizar la contraseña');
            }

            return true;
        } catch (error) {
            console.error('Error al cambiar contraseña:', error);
            throw error;
        } finally {
            if (pool) {
                await disconnectFromMssql(pool);
            }
        }
    }
}

module.exports = buscarusers;
