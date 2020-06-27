// Configuración de la base de datos y clave de JWT

module.exports = {
    database: {
        connectionLimit: 10,
        host: 'localhost',
        user: 'root',
        password: 'admin-leal',
        database: 'db_abc'
    },
    secret: "clave_secreta"
};