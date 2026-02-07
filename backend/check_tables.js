const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'earist',
});

db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }

    db.query('SHOW TABLES', (err, results) => {
        if (err) {
            console.error('Error fetching tables:', err);
        } else {
            results.forEach(row => console.log(Object.values(row)[0]));
        }
        db.end();
    });
});
