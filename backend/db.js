const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "Passer123",
    database: "gestionObjets",
    host:"localhost",
    port: 5432,
});

module.exports = pool;