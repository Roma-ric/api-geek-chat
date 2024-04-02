const mysql = require('mysql2/promise');

exports.connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "geek_chat",
    socketPath: "/opt/lampp/var/mysql/mysql.sock"
});
