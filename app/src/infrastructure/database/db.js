const mssql = require('mssql');
require('dotenv').config();

// Configuración de la conexión a SQL Server
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST, // Puedes cambiar esto por la dirección de tu servidor SQL Server
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10),
  options: {
      encrypt: false, // Si estás usando una conexión encriptada, por ejemplo, con Azure
      trustServerCertificate: true,
      connectTimeout: 120000, // 2 minutos
      requestTimeout: 120000 //  2 minutos
  }
};

async function connectToMssql() {
  try {
    const pool = await mssql.connect(config);
    console.log('Conectado a SQL Server');
    return pool;
  } catch (error) {
    console.error('Error al conectar a SQL Server:', error);
  }
}

async function disconnectFromMssql(pool) {
  try {
    await mssql.close();
    console.log('Desconectado de SQL Server');
  } catch (error) {
    console.error('Error al desconectar de SQL Server:', error);
  }
}

module.exports = { connectToMssql, disconnectFromMssql };
