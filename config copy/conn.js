const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost", // 호스트 주소
    user: "kosuha", // mysql user
    password: "", // mysql password
    database: "no_more_boring_time", // mysql 데이터베이스
});

connection.connect();

module.exports = connection;