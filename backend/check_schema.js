const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'earist',
});

db.connect((err) => {
    if (err) throw err;

    db.query('DESCRIBE page_accessble', (err, results) => {
        if (err) {
            console.error(err);
        } else {
            console.log(results);
        }
        db.end();
    });
});
