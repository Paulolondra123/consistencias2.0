const { connectToMssql, disconnectFromMssql } = require("../../infrastructure/database/db");
const bcrypt = require("bcryptjs");

class UsersModel {
    // Método para encontrar un usuario por ID
    static async findById(userId) {
        const pool = await connectToMssql();
        
        const result = await pool.request().query(`SELECT * FROM usuario WHERE id_usuario = ${userId}`);
        
        await disconnectFromMssql(pool);
        return result.recordset[0];
    }

    // Método para actualizar la contraseña de un usuario
    static async updatePassword(userId, nuevaContraseña, contraseñaActual) {
        let pool;
        try {

            pool = await connectToMssql();
            if (!pool) {
                throw new Error('Error al conectar con PostgreSQL');
            }

            // Buscar el usuario por ID
            const userResult = await pool.request().query(`SELECT * FROM usuario WHERE id_usuario = ${userId}`);
            
            const user = userResult.recordset[0];

            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            // Verificar la contraseña actual
            const isMatch = await bcrypt.compare(contraseñaActual, user.contraseña);
            if (!isMatch) {
                throw new Error('Contraseña actual incorrecta');
            }

            // Encriptar la nueva contraseña
            const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);

            // Actualizar la contraseña en la base de datos
            const query = `
                UPDATE usuario SET contraseña = ${hashedPassword} WHERE id_usuario = ${userId};
            `;

            const result = await pool.request().query(query);

            if (result.recordset.length === 0) {
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

module.exports = UsersModel;
