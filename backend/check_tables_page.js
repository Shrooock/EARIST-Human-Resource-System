const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'earist',
});

db.connect((err) => {
    if (err) throw err;

    db.query("SHOW TABLES LIKE 'page%'", (err, results) => {
        if (err) console.error(err);
        else console.log(JSON.stringify(results, null, 2));
        db.end();
    });
});
