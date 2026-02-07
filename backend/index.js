const express = require('express');
const multer = require('multer');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const pageRoutes = require('./pageRoutes');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
dotenv.config();
const port = process.env.PORT || 3000; // Use environment variable or default to 3000


// Express app setup
const app = express();
app.use(express.json());
app.use(cors());
app.use('/api', pageRoutes); // use the page routes under /api
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'earist',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Save files with a timestamp to avoid duplicates
  },
});

const upload = multer({ storage }); // Use storage configuration

// Get company settings
app.get('/api/settings', (req, res) => {
  db.query('SELECT * FROM company_settings WHERE id = 1', (err, result) => {
    if (err) {
      console.error('Error fetching settings:', err);
      return res.status(500).json({ error: 'Failed to fetch settings' });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'No settings found' });
    }

    res.json(result[0]);
  });
});

// Helper function to delete old logo
const deleteOldLogo = (logoUrl) => {
  if (!logoUrl) return;

  const logoPath = path.join(__dirname, logoUrl); // Full path to the logo file
  fs.unlink(logoPath, (err) => {
    if (err) {
      console.error(`Error deleting old logo at ${logoPath}: ${err.message}`);
    } else {
      console.log(`Old logo at ${logoPath} deleted successfully.`);
    }
  });
};

// Update company settings
app.post('/api/settings', upload.single('logo'), (req, res) => {
  const companyName = req.body.company_name || '';
  const headerColor = req.body.header_color || '#ffffff';
  const footerText = req.body.footer_text || '';
  const footerColor = req.body.footer_color || '#ffffff';
  const logoUrl = req.file ? `/uploads/${req.file.filename}` : null;

  // Check if company settings already exist
  db.query('SELECT * FROM company_settings WHERE id = 1', (err, result) => {
    if (err) {
      console.error('Error fetching settings:', err);
      return res.status(500).json({ error: 'Failed to fetch settings' });
    }

    if (result.length > 0) {
      // Update existing settings
      const oldLogoUrl = result[0].logo_url; // Save old logo URL for deletion
      const query = `
        UPDATE company_settings 
        SET company_name = ?, header_color = ?, footer_text = ?, footer_color = ? ${logoUrl ? ', logo_url = ?' : ''}
        WHERE id = 1
      `;
      const params = [companyName, headerColor, footerText, footerColor];
      if (logoUrl) params.push(logoUrl);

      db.query(query, params, (err) => {
        if (err) {
          console.error('Error updating settings:', err);
          return res.status(500).json({ error: 'Failed to update settings' });
        }

        // Delete old logo if a new one is uploaded
        if (logoUrl && oldLogoUrl) {
          deleteOldLogo(oldLogoUrl);
        }

        // Send updated data back
        db.query('SELECT * FROM company_settings WHERE id = 1', (err, updatedResult) => {
          if (err) {
            console.error('Error fetching updated settings:', err);
            return res.status(500).json({ error: 'Failed to fetch updated settings' });
          }
          res.json(updatedResult[0]);
        });
      });
    } else {
      // Insert new settings
      const query = `
        INSERT INTO company_settings (company_name, header_color, footer_text, footer_color, logo_url)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.query(query, [companyName, headerColor, footerText, footerColor, logoUrl], (err) => {
        if (err) {
          console.error('Error inserting new settings:', err);
          return res.status(500).json({ error: 'Failed to insert settings' });
        }

        // Send inserted data back
        db.query('SELECT * FROM company_settings WHERE id = 1', (err, insertedResult) => {
          if (err) {
            console.error('Error fetching inserted settings:', err);
            return res.status(500).json({ error: 'Failed to fetch inserted settings' });
          }
          res.json(insertedResult[0]);
        });
      });
    }
  });
});


// insert here the app for crud in the handout

// Register
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Validate input fields
  if (!username || !email || !password) {
    return res.status(400).send({ message: 'All fields are required' });
  }

  try {
    // Check if email already exists
    const checkQuery = `SELECT * FROM users_table WHERE email = ?`;
    db.query(checkQuery, [email], async (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.length > 0) return res.status(400).send({ message: 'Email already registered' });

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user into the database
      const query = `INSERT INTO users_table (username, email, password) VALUES (?,?,?)`;
      db.query(query, [username, email, hashedPassword], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ message: 'User Registered Successfully' });
      });
    });
  } catch (err) {
    res.status(500).send({ message: 'Error registering user', error: err });
  }
});


// Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Validate input fields
  if (!email || !password) {
    return res.status(400).send({ message: 'Email and password are required' });
  }

  const query = `SELECT * FROM users_table WHERE email = ?`;
  db.query(query, [email], async (err, result) => {
    if (err) return res.status(500).send({ message: 'Error fetching user', error: err });
    if (result.length === 0) return res.status(400).send({ message: 'User not found' });

    const user = result[0];

    try {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).send({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user.id, accessLevel: user.access_level }, 'secret', { expiresIn: 86400 });
      res.status(200).send({ token, userId: user.id });
    } catch (err) {
      res.status(500).send({ message: 'Error comparing passwords', error: err });
    }
  });
});

// ----------------------Start College Table--------------------

// Read (Get All Colleges)
app.get('/colleges', (req, res) => {
  const query = 'SELECT * FROM college_table';
  db.query(query, (err, result) => {
    if (err) return res.status(500).send({ message: 'Internal Server Error' });
    res.status(200).send(result);
  });
});

// Create (Add New College Entry)
app.post('/colleges', (req, res) => {
  const {
    collegeNameOfSchool,
    collegeDegree,
    collegePeriodFrom,
    collegePeriodTo,
    collegeHighestAttained,
    collegeYearGraduated,
    collegeScholarshipAcademicHonorsReceived,
    person_id
  } = req.body;

  const query = `
    INSERT INTO college_table (
      collegeNameOfSchool,
      collegeDegree,
      collegePeriodFrom,
      collegePeriodTo,
      collegeHighestAttained,
      collegeYearGraduated,
      collegeScholarshipAcademicHonorsReceived,
      person_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [
    collegeNameOfSchool,
    collegeDegree,
    collegePeriodFrom,
    collegePeriodTo,
    collegeHighestAttained,
    collegeYearGraduated,
    collegeScholarshipAcademicHonorsReceived,
    person_id
  ], (err, result) => {
    if (err) return res.status(500).send({ message: 'Internal Server Error' });
    res.status(201).send({ message: 'College entry created', id: result.insertId });
  });
});

// Update College Entry
app.put('/colleges/:id', (req, res) => {
  const {
    collegeNameOfSchool,
    collegeDegree,
    collegePeriodFrom,
    collegePeriodTo,
    collegeHighestAttained,
    collegeYearGraduated,
    collegeScholarshipAcademicHonorsReceived,
    person_id
  } = req.body;

  const { id } = req.params;
  const query = `
    UPDATE college_table SET
      collegeNameOfSchool = ?,
      collegeDegree = ?,
      collegePeriodFrom = ?,
      collegePeriodTo = ?,
      collegeHighestAttained = ?,
      collegeYearGraduated = ?,
      collegeScholarshipAcademicHonorsReceived = ?,
      person_id = ?
    WHERE id = ?`;

  db.query(query, [
    collegeNameOfSchool,
    collegeDegree,
    collegePeriodFrom,
    collegePeriodTo,
    collegeHighestAttained,
    collegeYearGraduated,
    collegeScholarshipAcademicHonorsReceived,
    person_id,
    id
  ], (err, result) => {
    if (err) return res.status(500).send({ message: 'Internal Server Error' });
    res.status(200).send({ message: 'College entry updated' });
  });
});

// Delete College Entry
app.delete('/colleges/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM college_table WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).send({ message: 'Internal Server Error' });
    res.status(200).send({ message: 'College entry deleted' });
  });
});


//--------------------------End of Crud-------------------------


// Route to handle XLS file upload
app.post('/upload-xls', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }


  try {
    // Read the uploaded XLS file
    const workbook = xlsx.readFile(req.file.path);
    const sheet_name = workbook.SheetNames[0];
    const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name]);


    // Log the uploaded data for troubleshooting
    console.log('Uploaded sheet data:', sheet);


    // Insert data into MySQL for college_table
    sheet.forEach(row => {
      const {
        collegeNameOfSchool,
        collegeDegree,
        collegePeriodFrom,
        collegePeriodTo,
        collegeHighestAttained,
        collegeYearGraduated,
        collegeScholarshipAcademicHonorsReceived,
        person_id
      } = row; // Destructure to get the values from the row

      console.log(`
    College Name: ${collegeNameOfSchool}, 
    Degree: ${collegeDegree}, 
    Period From: ${collegePeriodFrom}, 
    Period To: ${collegePeriodTo}, 
    Highest Attained: ${collegeHighestAttained}, 
    Year Graduated: ${collegeYearGraduated}, 
    Honors Received: ${collegeScholarshipAcademicHonorsReceived}, 
    Person ID: ${person_id}
  `);

      const sql = `INSERT INTO college_table (collegeNameOfSchool, collegeDegree, collegePeriodFrom, collegePeriodTo, collegeHighestAttained, collegeYearGraduated, collegeScholarshipAcademicHonorsReceived, person_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      db.query(sql, [
        collegeNameOfSchool,
        collegeDegree,
        collegePeriodFrom,
        collegePeriodTo,
        collegeHighestAttained,
        collegeYearGraduated,
        collegeScholarshipAcademicHonorsReceived,
        person_id
      ], (err, result) => {
        if (err) {
          console.error('Error inserting data into college_table:', err);
          return;
        }
        console.log('Data inserted successfully into college_table:', result);
      });
    });

    // Send response after insertion
    res.json({ message: 'File uploaded and data inserted successfully' });


  } catch (error) {
    console.error('Error processing XLS file:', error);
    res.status(500).json({ error: 'Error processing XLS file' });
  } finally {
    // Delete the uploaded file to save space on the server
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error('Error deleting uploaded file:', err);
      } else {
        console.log('Uploaded file deleted');
      }
    });
  }
});


//--------------------------End of College Table-------------------------

//---------------------- DEPARTMENT ROUTES -------------------------------//
// Get all departments
app.get('/department', (req, res) => {
  const query = 'SELECT * FROM department';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching department records:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    res.status(200).json(result);
  });
});

// Add a new department
app.post(
  '/department',
  [
    check('department_name').notEmpty().withMessage('Department name is required'),
    check('department_code').notEmpty().withMessage('Department code is required'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { department_name, department_code } = req.body;
    const query = 'INSERT INTO department (department_name, department_code) VALUES (?, ?)';

    db.query(query, [department_name, department_code], (err, result) => {
      if (err) {
        console.error('Error inserting new department:', err);
        // Handle duplicate department code error (unique constraint violation)
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'Department code must be unique' });
        }
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      res.status(201).json({ message: 'Department created', id: result.insertId });
    });
  }
);

// Update a department
app.put(
  '/department/:id',
  [
    check('department_name').optional().notEmpty().withMessage('Invalid department name'),
    check('department_code').optional().notEmpty().withMessage('Invalid department code'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { department_name, department_code } = req.body;
    const { id } = req.params;
    const query = 'UPDATE department SET department_name = ?, department_code = ? WHERE id = ?';

    db.query(query, [department_name, department_code, id], (err, result) => {
      if (err) {
        console.error('Error updating department:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Department not found' });
      }
      res.status(200).json({ message: 'Department updated' });
    });
  }
);

// Delete a department
app.delete('/department/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM department WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting department:', err);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(200).json({ message: 'Department deleted' });
  });
});

// Upload Excel for departments
app.post('/upload-department', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheet_name = workbook.SheetNames[0];
    const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name]);

    console.log('Uploaded department data:', sheet);

    // Check if required columns exist in the sheet
    if (!sheet.every((row) => row.department_name && row.department_code)) {
      return res.status(400).json({ error: 'Invalid data in Excel file. Missing required columns.' });
    }

    const insertPromises = sheet.map((row) => {
      const departmentName = row.department_name;
      const departmentCode = row.department_code;

      return new Promise((resolve, reject) => {
        // Check for duplicate department_code before inserting
        db.query('SELECT * FROM department WHERE department_code = ?', [departmentCode], (err, result) => {
          if (err) {
            console.error('Error checking duplicate department code:', err);
            return reject(err);
          }
          if (result.length > 0) {
            return reject('Duplicate department code');
          }

          const sql = 'INSERT INTO department (department_name, department_code) VALUES (?, ?)';
          db.query(sql, [departmentName, departmentCode], (err, result) => {
            if (err) {
              console.error('Error inserting data into department:', err);
              return reject(err);
            }
            resolve(result);
          });
        });
      });
    });

    await Promise.all(insertPromises);
    res.json({ message: 'Department file uploaded and data inserted successfully' });
  } catch (error) {
    console.error('Error processing department XLS file:', error);
    res.status(500).json({ error: 'Error processing department XLS file' });
  } finally {
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting temporary file:', err);
    });
  }
});

//--------------------- Department   Endpoints -----------------------//


//--------------------- Department Assignment Starting point -----------------------//

// Create (Add New Department Assignment)
app.post('/department-assignment', (req, res) => {
  const { department_id, person_id } = req.body;

  const query = 'INSERT INTO department_assignment (department_id, person_id) VALUES (?, ?)';
  db.query(query, [department_id, person_id], (err, result) => {
    if (err) {
      console.error('Error inserting new department assignment:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    res.status(201).json({ message: 'Department assignment created', id: result.insertId });
  });
});

// Update Department Assignment
app.put('/department-assignment/:id', (req, res) => {
  const { id } = req.params;
  const { department_id, person_id } = req.body;

  const query = 'UPDATE department_assignment SET department_id = ?, person_id = ? WHERE id = ?';
  db.query(query, [department_id, person_id, id], (err, result) => {
    if (err) {
      console.error('Error updating department assignment:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Department assignment not found' });
    }
    res.status(200).json({ message: 'Department assignment updated' });
  });
});

// Delete Department Assignment
app.delete('/department-assignment/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM department_assignment WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting department assignment:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Department assignment not found' });
    }
    res.status(200).json({ message: 'Department assignment deleted' });
  });
});

// Fetch all department assignments
app.get('/department-assignment', (req, res) => {
  const query = 'SELECT * FROM department_assignment';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching department assignments:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    res.status(200).json(result); // Sending the data back to frontend
  });
});

// Fetch department assignments
const fetchDepartmentAssignments = async () => {
  setLoading(true);
  try {
    const response = await axios.get('http://localhost:5000/department-assignment');  // Check this URL
    setData(response.data);  // Update state with fetched data
  } catch (error) {
    showSnackbar('Failed to fetch department assignments.', 'error');
  } finally {
    setLoading(false);
  }
};


//--------------------- Excel File Upload Endpoint -----------------------//

app.post('/upload-department-assignment', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Read the uploaded Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (sheetData.length === 0) {
      return res.status(400).json({ error: 'Uploaded file is empty or invalid.' });
    }

    console.log('Parsed department assignment data:', sheetData);

    // Insert data into the database
    const insertPromises = sheetData.map((row) => {
      const { department_id: departmentId, person_id: personId } = row;

      if (!departmentId || !personId) {
        console.error('Invalid row data:', row);
        return Promise.reject(new Error('Row is missing required fields.'));
      }

      const query = 'INSERT INTO department_assignment (department_id, person_id) VALUES (?, ?)';
      return new Promise((resolve, reject) => {
        db.query(query, [departmentId, personId], (err, result) => {
          if (err) {
            console.error('Error inserting data into department_assignment:', err);
            return reject(err);
          }
          resolve(result);
        });
      });
    });

    await Promise.all(insertPromises);

    res.json({
      message: 'Department assignment file uploaded and data inserted successfully.',
    });
  } catch (error) {
    console.error('Error processing department assignment file:', error);
    res.status(500).json({ error: 'Error processing department assignment file.' });
  } finally {
    // Delete temporary uploaded file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting temporary file:', err);
    });
  }
});
//-------------------------end department assignment------------------------//


// ----------------------ITEMS ROUTES----------------------------------//

// Fetch all items
app.get('/items', (req, res) => {
  const query = 'SELECT * FROM item_table';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching items:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    res.status(200).json(result);
  });
});

// Add a new item
app.post('/items', (req, res) => {
  const { item_name, item_code, employee_id } = req.body;

  console.log('Received data:', req.body); // Debugging log

  if (!item_name || !item_code || !employee_id) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = 'INSERT INTO item_table (item_name, item_code, employee_id) VALUES (?, ?, ?)';
  db.query(query, [item_name, item_code, employee_id], (err, result) => {
    if (err) {
      console.error('Error inserting new item:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    res.status(201).json({ message: 'Item created', id: result.insertId });
  });
});

// Update an item
app.put('/items/:id', (req, res) => {
  const { item_name, item_code, employee_id } = req.body;
  const { id } = req.params;

  console.log('Updating item:', { id, item_name, item_code, employee_id }); // Debugging log

  if (!item_name || !item_code || !employee_id) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = 'UPDATE item_table SET item_name = ?, item_code = ?, employee_id = ? WHERE id = ?';
  db.query(query, [item_name, item_code, employee_id, id], (err, result) => {
    if (err) {
      console.error('Error updating item:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item updated' });
  });
});

// Delete an item
app.delete('/items/:id', (req, res) => {
  const { id } = req.params;

  console.log('Deleting item with ID:', id); // Debugging log

  const query = 'DELETE FROM item_table WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting item:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted' });
  });
});

// Upload items from Excel file
app.post('/upload-items', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const insertPromises = sheet.map((row) => {
      const { item_name, item_code, employee_id } = row;

      if (!item_name || !item_code || !employee_id) {
        return Promise.reject(new Error('Invalid data format in Excel file'));
      }

      const query = 'INSERT INTO item_table (item_name, item_code, employee_id) VALUES (?, ?, ?)';
      return new Promise((resolve, reject) => {
        db.query(query, [item_name, item_code, employee_id], (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });
    });

    await Promise.all(insertPromises);

    res.json({ message: 'Items uploaded and inserted successfully' });
  } catch (error) {
    console.error('Error processing Excel file:', error);
    res.status(500).json({ error: 'Error processing Excel file' });
  } finally {
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting temporary file:', err);
    });
  }
});

// ------------------END ITEMS ROUTES----------------------------//



// ------------------ Vocational Data Starting ----------------------------

// Get vocational records by name of school
app.get('/vocational-records/school/:schoolName', (req, res) => {
  const { schoolName } = req.params;

  console.log('Searching for school:', schoolName);

  if (!schoolName) {
    return res.status(400).send({ message: 'School name is required' });
  }

  const query = 'SELECT * FROM vocational_table WHERE vocationalNameOfSchool LIKE ?';
  console.log('Query:', query, [`%${schoolName}%`]);

  db.query(query, [`%${schoolName}%`], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send({ message: 'Error fetching records' });
    }
    if (result.length === 0) {
      console.log('No records found for school:', schoolName);
      return res.status(404).send({ message: 'No records found' });
    }

    console.log('Found records:', result);
    res.status(200).send(result);
  });
});


// ----------------- End Vocational Data ----------------------------

// ----------------- Starting Vocational_table ----------------------------

// CRUD for vocational_table
app.get('/vocational', (req, res) => {
  const query = 'SELECT * FROM vocational_table';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
    res.status(200).send(result);
  });
});

app.post('/vocational', (req, res) => {
  const { vocationalNameOfSchool, vocationalDegree, vocationalPeriodFrom, vocationalPeriodTo, vocationalHighestAttained, vocationalYearGraduated } = req.body;

  // Check if all required fields are present
  if (!vocationalNameOfSchool || !vocationalDegree || !vocationalPeriodFrom || !vocationalPeriodTo || !vocationalHighestAttained || !vocationalYearGraduated) {
    return res.status(400).send({ message: 'All fields are required' });
  }

  const query = 'INSERT INTO vocational_table (vocationalNameOfSchool, vocationalDegree, vocationalPeriodFrom, vocationalPeriodTo, vocationalHighestAttained, vocationalYearGraduated) VALUES (?, ?, ?, ?, ?, ?)';

  db.query(query, [vocationalNameOfSchool, vocationalDegree, vocationalPeriodFrom, vocationalPeriodTo, vocationalHighestAttained, vocationalYearGraduated], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
    res.status(201).send({ message: 'Vocational record created', id: result.insertId });
  });
});

app.put('/vocational/:id', (req, res) => {
  const { id } = req.params;
  const { vocationalNameOfSchool, vocationalDegree, vocationalPeriodFrom, vocationalPeriodTo, vocationalHighestAttained, vocationalYearGraduated } = req.body;

  // Check if all required fields are present
  if (!vocationalNameOfSchool || !vocationalDegree || !vocationalPeriodFrom || !vocationalPeriodTo || !vocationalHighestAttained || !vocationalYearGraduated) {
    return res.status(400).send({ message: 'All fields are required' });
  }

  const query = 'UPDATE vocational_table SET vocationalNameOfSchool = ?, vocationalDegree = ?, vocationalPeriodFrom = ?, vocationalPeriodTo = ?, vocationalHighestAttained = ?, vocationalYearGraduated = ? WHERE id = ?';

  db.query(query, [vocationalNameOfSchool, vocationalDegree, vocationalPeriodFrom, vocationalPeriodTo, vocationalHighestAttained, vocationalYearGraduated, id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Vocational record not found' });
    }
    res.status(200).send({ message: 'Vocational record updated' });
  });
});

app.delete('/vocational/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM vocational_table WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Vocational record not found' });
    }
    res.status(200).send({ message: 'Vocational record deleted' });
  });
});

//-------------------------File Upload Vocational--------------------------
app.post('/upload-vocational', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Read the uploaded XLS file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!sheet.length) {
      return res.status(400).json({ error: 'Uploaded file is empty' });
    }

    console.log('Uploaded sheet data:', sheet);

    // Insert data into MySQL
    const insertPromises = sheet.map(row => {
      const { vocationalNameOfSchool, vocationalDegree, vocationalPeriodFrom, vocationalPeriodTo, vocationalHighestAttained, vocationalYearGraduated } = row;

      const sql = 'INSERT INTO vocational_table (vocationalNameOfSchool, vocationalDegree, vocationalPeriodFrom, vocationalPeriodTo, vocationalHighestAttained, vocationalYearGraduated) VALUES (?, ?, ?, ?, ?, ?)';
      return new Promise((resolve, reject) => {
        db.query(sql, [vocationalNameOfSchool, vocationalDegree, vocationalPeriodFrom, vocationalPeriodTo, vocationalHighestAttained, vocationalYearGraduated], (err) => {
          if (err) {
            console.error('Error inserting data:', err);
            return reject(err);
          }
          console.log('Data inserted successfully for:', vocationalNameOfSchool);
          resolve();
        });
      });
    });

    await Promise.all(insertPromises);
    res.json({ message: 'File uploaded and data inserted successfully' });

  } catch (error) {
    console.error('Error processing XLS file:', error);
    res.status(500).json({ error: 'Error processing XLS file' });
  } finally {
    // Delete the uploaded file to save space on the server
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error('Error deleting uploaded file:', err);
      } else {
        console.log('Uploaded file deleted');
      }
    });
  }
});


// ----------------- End Vocational_table ----------------------------


// ----------------- Voluntary Work Records Starting ----------------------------

// CRUD routes (e.g., Create, Read, Update, Delete)

// Get all voluntary works
app.get('/voluntary-work', (req, res) => {
  const query = 'SELECT * FROM voluntary_work_table';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Error fetching data from database');
    }
    res.json(results);  // Send all records as JSON response
  });
});

// Add new voluntary work
app.post('/voluntary-work', (req, res) => {
  const { nameAndAddress, dateFrom, dateTo, numberOfHours, numberOfWorks } = req.body;
  const query = 'INSERT INTO voluntary_work_table (nameAndAddress, dateFrom, dateTo, numberOfHours, numberOfWorks) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [nameAndAddress, dateFrom, dateTo, numberOfHours, numberOfWorks], (err, results) => {
    if (err) {
      return res.status(500).send('Error adding item to database');
    }
    res.status(201).send('Item added successfully');  // Successfully added the record
  });
});

// Update voluntary work
app.put('/voluntary-work/:id', (req, res) => {
  const { id } = req.params;
  const { nameAndAddress, dateFrom, dateTo, numberOfHours, numberOfWorks } = req.body;
  const query = 'UPDATE voluntary_work_table SET nameAndAddress = ?, dateFrom = ?, dateTo = ?, numberOfHours = ?, numberOfWorks = ? WHERE id = ?';
  db.query(query, [nameAndAddress, dateFrom, dateTo, numberOfHours, numberOfWorks, id], (err, results) => {
    if (err) {
      return res.status(500).send('Error updating item in database');
    }
    res.send('Item updated successfully');
  });
});

// Delete voluntary work
app.delete('/voluntary-work/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM voluntary_work_table WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).send('Error deleting item from database');
    }
    res.send('Item deleted successfully');
  });
});

// Fetch all voluntary work records
app.get('/voluntary-work', (req, res) => {
  const query = 'SELECT * FROM voluntary_work_table';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching records', error: err });
    }
    res.json(results);
  });
});

// Search voluntary works by name or address
app.get('/voluntary-work/search', (req, res) => {
  const searchTerm = req.query.searchTerm;

  if (!searchTerm) {
    return res.status(400).json({ message: 'Search term is required' });
  }

  const query = 'SELECT * FROM voluntary_work_table WHERE nameAndAddress LIKE ?';

  db.query(query, [`%${searchTerm}%`], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error searching records', error: err });
    }
    res.json(results);
  });
});

// Add a new voluntary work record
app.post('/voluntary-work', (req, res) => {
  const { nameAndAddress, dateFrom, dateTo, numberOfHours, numberOfWorks } = req.body;

  if (!nameAndAddress || !dateFrom || !dateTo || !numberOfHours || !numberOfWorks) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = `INSERT INTO voluntary_work_table (nameAndAddress, dateFrom, dateTo, numberOfHours, numberOfWorks)
                 VALUES (?, ?, ?, ?, ?)`;

  db.query(query, [nameAndAddress, dateFrom, dateTo, numberOfHours, numberOfWorks], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error adding record', error: err });
    }
    res.status(201).json({ message: 'Record added successfully', id: result.insertId });
  });
});

// Update a voluntary work record
app.put('/voluntary-work/:id', (req, res) => {
  const { id } = req.params;
  const { nameAndAddress, dateFrom, dateTo, numberOfHours, numberOfWorks } = req.body;

  if (!nameAndAddress || !dateFrom || !dateTo || !numberOfHours || !numberOfWorks) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = `UPDATE voluntary_work_table 
                 SET nameAndAddress = ?, dateFrom = ?, dateTo = ?, numberOfHours = ?, numberOfWorks = ?
                 WHERE id = ?`;

  db.query(query, [nameAndAddress, dateFrom, dateTo, numberOfHours, numberOfWorks, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating record', error: err });
    }
    res.json({ message: 'Record updated successfully' });
  });
});

// Delete a voluntary work record
app.delete('/voluntary-work/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM voluntary_work_table WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting record', error: err });
    }
    res.json({ message: 'Record deleted successfully' });
  });
});


// Route to upload and process Excel file
app.post('/voluntary-work/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    // Read the Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Convert Excel data to an array of values for bulk insertion
    const values = data.map((row) => [
      row.nameAndAddress,
      row.dateFrom,
      row.dateTo,
      row.numberOfHours,
      row.numberOfWorks,
    ]);

    // SQL query for bulk insertion
    const query = `
      INSERT INTO voluntary_work_table (nameAndAddress, dateFrom, dateTo, numberOfHours, numberOfWorks)
      VALUES ?
    `;

    // Execute bulk insertion
    db.query(query, [values], (err) => {
      if (err) {
        console.error('Error inserting data:', err);
        return res.status(500).json({ message: 'Error inserting data into database', error: err });
      }

      res.json({ message: 'Data imported successfully!' });
    });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ message: 'Error processing file', error });
  }
});

// ----------------- End Voluntary Work Record ----------------------------

// ----------------- Start Eligiblity ----------------------------


// Get specific eligibility record by ID
app.get('/eligibility-records/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM eligibility_table WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error fetching record:', err);
      return res.status(500).json({ message: 'Database query error' });
    }
    if (result.length === 0) return res.status(404).json({ message: 'Record not found' });

    res.status(200).json(result[0]); // Return single record
  });
});


// Get all eligibility data
app.get('/eligibility', (req, res) => {
  const query = 'SELECT * FROM eligibility_table';

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching records:', err);
      return res.status(500).json({ message: 'Database query error' });
    }
    res.status(200).json(result);
  });
});

// Add new eligibility record
app.post('/eligibility', (req, res) => {
  const { eligibilityName, eligibilityRating, eligibilityDateOfExam, eligibilityPlaceOfExam, licenseNumber, DateOfValidity } = req.body;
  const query = `
    INSERT INTO eligibility_table 
    (eligibilityName, eligibilityRating, eligibilityDateOfExam, eligibilityPlaceOfExam, licenseNumber, DateOfValidity) 
    VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(
    query,
    [eligibilityName, eligibilityRating, eligibilityDateOfExam, eligibilityPlaceOfExam, licenseNumber, DateOfValidity],
    (err, result) => {
      if (err) {
        console.error('Error adding eligibility:', err);
        return res.status(500).json({ message: 'Database insertion error' });
      }
      res.status(201).json({ message: 'Eligibility created', id: result.insertId });
    }
  );
});

// Update eligibility record
app.put('/eligibility/:id', (req, res) => {
  const { id } = req.params;
  const { eligibilityName, eligibilityRating, eligibilityDateOfExam, eligibilityPlaceOfExam, licenseNumber, DateOfValidity } = req.body;
  const query = `
    UPDATE eligibility_table 
    SET eligibilityName = ?, eligibilityRating = ?, eligibilityDateOfExam = ?, eligibilityPlaceOfExam = ?, licenseNumber = ?, DateOfValidity = ? 
    WHERE id = ?`;

  db.query(
    query,
    [eligibilityName, eligibilityRating, eligibilityDateOfExam, eligibilityPlaceOfExam, licenseNumber, DateOfValidity, id],
    (err, result) => {
      if (err) {
        console.error('Error updating eligibility:', err);
        return res.status(500).json({ message: 'Database update error' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Record not found' });
      }
      res.status(200).json({ message: 'Eligibility record updated' });
    }
  );
});

// Delete eligibility record
app.delete('/eligibility/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM eligibility_table WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting eligibility:', err);
      return res.status(500).json({ message: 'Database deletion error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.status(200).json({ message: 'Eligibility record deleted' });
  });
});


//--------------------Eligibility Excel Upload------------------

app.post('/upload-eligibility', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Read the uploaded XLS file
    const workbook = xlsx.readFile(req.file.path);
    const sheet_name = workbook.SheetNames[0];
    const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name]);

    if (!sheet.length) {
      return res.status(400).json({ error: 'Uploaded file is empty' });
    }

    console.log('Uploaded sheet data:', sheet);

    // Insert data into MySQL
    const insertPromises = sheet.map(row => {
      const { eligibilityName, eligibilityRating, eligibilityDateOfExam, eligibilityPlaceOfExam, licenseNumber, DateOfValidity } = row;

      const sql = 'INSERT INTO eligibility_table (eligibilityName, eligibilityRating, eligibilityDateOfExam, eligibilityPlaceOfExam, licenseNumber, DateOfValidity) VALUES (?, ?, ?, ?, ?, ?)';
      return new Promise((resolve, reject) => {
        db.query(sql, [eligibilityName, eligibilityRating, eligibilityDateOfExam, eligibilityPlaceOfExam, licenseNumber, DateOfValidity], (err) => {
          if (err) {
            console.error('Error inserting data:', err);
            return reject(err);
          }
          console.log('Data inserted successfully for:', eligibilityName);
          resolve();
        });
      });
    });

    await Promise.all(insertPromises);
    res.json({ message: 'File uploaded and data inserted successfully' });

  } catch (error) {
    console.error('Error processing XLS file:', error);
    res.status(500).json({ error: 'Error processing XLS file' });
  } finally {
    // Delete the uploaded file to save space on the server
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error('Error deleting uploaded file:', err);
      } else {
        console.log('Uploaded file deleted');
      }
    });
  }
});


// ----------------- End Eligiblity ----------------------------




// ----------------- Start Children ----------------------------


// Get all children
app.get('/children', (req, res) => {
  const query = 'SELECT * FROM children_table';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching children:', err);
      return res.status(500).send({ message: 'Error fetching children', error: err });
    }
    res.status(200).send(results);
  });
});

// Add new child
app.post('/children', (req, res) => {
  const { childrenFirstName, childrenMiddleName, childrenLastName, childrenNameExtension, dateOfBirth, person_id } = req.body;

  // Validate the incoming data
  if (!childrenFirstName || !childrenLastName || !dateOfBirth || !person_id) {
    return res.status(400).send({ message: 'Please fill in all required fields.' });
  }

  if (isNaN(person_id)) {
    return res.status(400).send({ message: 'Person ID must be a valid number.' });
  }

  const query = 'INSERT INTO children_table (childrenFirstName, childrenMiddleName, childrenLastName, childrenNameExtension, dateOfBirth, person_id) VALUES (?, ?, ?, ?, ?, ?)';

  console.log('Executing Query: ', query, [childrenFirstName, childrenMiddleName, childrenLastName, childrenNameExtension, dateOfBirth, person_id]);

  db.query(query, [childrenFirstName, childrenMiddleName, childrenLastName, childrenNameExtension, dateOfBirth, person_id], (err, result) => {
    if (err) {
      console.error('Error inserting child:', err);
      return res.status(500).send({ message: 'Error inserting child', error: err.message });
    }

    // Successfully inserted child
    res.status(201).send({ message: 'Child created', id: result.insertId });
  });
});

// Update child
app.put('/children/:id', (req, res) => {
  const { childrenFirstName, childrenMiddleName, childrenLastName, childrenNameExtension, dateOfBirth } = req.body;
  const { id } = req.params;

  // Ensure that the required fields are provided
  if (!childrenFirstName || !childrenLastName || !dateOfBirth) {
    return res.status(400).send({ message: 'Please fill in all required fields.' });
  }

  // Query to check if the child exists before updating
  const checkChildQuery = 'SELECT * FROM children_table WHERE id = ?';
  db.query(checkChildQuery, [id], (err, result) => {
    if (err) {
      console.error('Error checking child existence:', err);
      return res.status(500).send({ message: 'Error checking child existence', error: err });
    }

    if (result.length === 0) {
      return res.status(404).send({ message: 'Child not found' });
    }

    // If the child exists, proceed with the update
    const query = `
      UPDATE children_table 
      SET 
        childrenFirstName = ?, 
        childrenMiddleName = ?, 
        childrenLastName = ?, 
        childrenNameExtension = ?, 
        dateOfBirth = ? 
      WHERE id = ?
    `;

    console.log('Executing Update Query:', query, [
      childrenFirstName,
      childrenMiddleName,
      childrenLastName,
      childrenNameExtension,
      dateOfBirth,
      id
    ]);

    db.query(query, [
      childrenFirstName,
      childrenMiddleName,
      childrenLastName,
      childrenNameExtension,
      dateOfBirth,
      id
    ], (err, result) => {
      if (err) {
        console.error('Error updating child:', err);
        return res.status(500).send({ message: 'Error updating child', error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).send({ message: 'Child not found' });
      }

      res.status(200).send({ message: 'Child updated successfully' });
    });
  });
});

// Delete child
app.delete('/children/:id', (req, res) => {
  const { id } = req.params;

  // Query to check if the child exists
  const checkChildQuery = 'SELECT * FROM children_table WHERE id = ?';
  db.query(checkChildQuery, [id], (err, result) => {
    if (err) {
      console.error('Error checking child existence:', err);
      return res.status(500).send({ message: 'Error checking child existence', error: err });
    }

    if (result.length === 0) {
      return res.status(404).send({ message: 'Child not found' });
    }

    // Proceed to delete the child
    const query = 'DELETE FROM children_table WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Error deleting child:', err);
        return res.status(500).send({ message: 'Error deleting child', error: err });
      }
      res.status(200).send({ message: 'Child deleted successfully' });
    });
  });
});


// ----------------Excel upload endpoint-------------------
app.post('/upload-children', upload.single('file'), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send({ message: 'No file uploaded.' });
  }

  // Read the uploaded Excel file
  const filePath = path.join(__dirname, file.path);
  const workbook = xlsx.readFile(filePath);

  // Assuming the data is in the first sheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convert sheet to JSON (assumes the Excel file has column headers in the first row)
  const data = xlsx.utils.sheet_to_json(worksheet);

  // Clean up uploaded file
  fs.unlinkSync(filePath);

  // Process each row of data and insert into the database
  const insertPromises = data.map((row) => {
    const {
      childrenFirstName,
      childrenMiddleName,
      childrenLastName,
      childrenNameExtension,
      dateOfBirth,
      person_id,
    } = row;

    // Basic validation for required fields
    if (!childrenFirstName || !childrenLastName || !dateOfBirth || !person_id) {
      return Promise.reject('Missing required fields');
    }

    const query = `
      INSERT INTO children_table 
      (childrenFirstName, childrenMiddleName, childrenLastName, childrenNameExtension, dateOfBirth, person_id) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
      db.query(query, [
        childrenFirstName,
        childrenMiddleName,
        childrenLastName,
        childrenNameExtension,
        dateOfBirth,
        person_id,
      ], (err, result) => {
        if (err) {
          console.error('Error inserting child:', err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  });

  // Wait for all insertions to complete
  Promise.all(insertPromises)
    .then(() => res.status(200).send({ message: 'Children data uploaded successfully.' }))
    .catch((err) => res.status(500).send({ message: 'Error processing file', error: err }));
});

// ----------------- End ----------------------------

// ----------------- Work Experience Start ----------------------------

// Get all item for work experience
app.get("/work-experience", (req, res) => {
  const query = "SELECT * FROM work_experience_table";
  db.query(query, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(result);
  });
});

// Add item for work experience
app.post("/work-experience", (req, res) => {
  const {
    workDateFrom,
    workDateTo,
    workPositionTitle,
    workCompany,
    workMonthlySalary,
    salaryJobOrPayGrade,
    statusOfAppointment,
    isGovtService,
  } = req.body;
  const query =
    "INSERT INTO work_experience_table (workDateFrom, workDateTo, workPositionTitle, workCompany, workMonthlySalary, salaryJobOrPayGrade, statusOfAppointment, isGovtService) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(
    query,
    [
      workDateFrom,
      workDateTo,
      workPositionTitle,
      workCompany,
      workMonthlySalary,
      salaryJobOrPayGrade,
      statusOfAppointment,
      isGovtService,
    ],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(201).send({ message: "Item created", id: result.insertId });
    }
  );
});

// Update item for work experience
app.put("/work-experience/:id", (req, res) => {
  const {
    workDateFrom,
    workDateTo,
    workPositionTitle,
    workCompany,
    workMonthlySalary,
    salaryJobOrPayGrade,
    statusOfAppointment,
    isGovtService,
  } = req.body;
  const { id } = req.params;
  const query =
    "UPDATE work_experience_table SET workDateFrom = ?, workDateTo = ?, workPositionTitle = ?, workCompany = ?, workMonthlySalary = ?, salaryJobOrPayGrade = ?, statusOfAppointment = ?, isGovtService = ?  WHERE id = ?";
  db.query(
    query,
    [
      workDateFrom,
      workDateTo,
      workPositionTitle,
      workCompany,
      workMonthlySalary,
      salaryJobOrPayGrade,
      statusOfAppointment,
      isGovtService,
      id,
    ],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(200).send({ message: "Item updated" });
    }
  );
});

// Delete item for work experience
app.delete("/work-experience/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM work_experience_table WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send({ message: "Item deleted" });
  });
});
// ----------------- Work Experience end ----------------------------

// ----------------- Learning and Development start ----------------------------

//data
app.get('/data', (req, res) => {
  const query = `SELECT * FROM learning_and_development_table`;
  db.query(query, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(result);
  });
});

//Read
app.get('/learning_and_development_table', (req, res) => {
  const query = 'SELECT * FROM learning_and_development_table';
  db.query(query, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(result);
  });
});

//Add
app.post('/learning_and_development_table', (req, res) => {
  const { titleOfProgram, dateFrom, dateTo, numberOfHours, typeOfLearningDevelopment, conductedSponsored } = req.body;
  const query = 'INSERT INTO learning_and_development_table (titleOfProgram, dateFrom, dateTo, numberOfHours, typeOfLearningDevelopment, conductedSponsored) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [titleOfProgram, dateFrom, dateTo, numberOfHours, typeOfLearningDevelopment, conductedSponsored], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ message: 'Item created', id: result.insertId });
  });
});

//Update
app.put('/learning_and_development_table/:id', (req, res) => {
  const { titleOfProgram, dateFrom, dateTo, numberOfHours, typeOfLearningDevelopment, conductedSponsored } = req.body;
  const { id } = req.params;
  const query = 'UPDATE learning_and_development_table SET titleOfProgram = ?, dateFrom = ?, dateTo = ?, numberOfHours = ?, typeOfLearningDevelopment = ?, conductedSponsored = ? WHERE id = ?';
  db.query(query, [titleOfProgram, dateFrom, dateTo, numberOfHours, typeOfLearningDevelopment, conductedSponsored, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send({ message: 'Item updated' });
  });
});

//delete
app.delete('/learning_and_development_table/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM learning_and_development_table WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send({ message: 'Item deleted' });
  });
});

app.post('/upload_learning_and_development_table', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Read the uploaded XLS file
    const workbook = xlsx.readFile(req.file.path);
    const sheet_name = workbook.SheetNames[0];
    const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name]);

    // Log the uploaded data for troubleshooting
    console.log('Uploaded employee info data:', sheet);

    // Insert data into MySQL
    sheet.forEach(row => {
      const titleOfProgram = row.titleOfProgram;
      const dateFrom = excelDateToJSDate(row.dateFrom);
      const formattedDateFrom = moment(dateFrom).format('YYYY-MM-DD HH:mm:ss');
      const dateTo = excelDateToJSDate(row.dateTo);
      const formattedDateTo = moment(dateTo).format('YYYY-MM-DD HH:mm:ss');
      const numberOfHours = row.numberOfHours;
      const typeOfLearningDevelopment = row.typeOfLearningDevelopment;
      const conductedSponsored = row.conductedSponsored;

      const query = 'INSERT INTO learning_and_development_table (titleOfProgram, dateFrom, dateTo, numberOfHours, typeOfLearningDevelopment, conductedSponsored) VALUES (?, ?, ?, ?, ?, ?)';
      db.query(query, [titleOfProgram, formattedDateFrom, formattedDateTo, numberOfHours, typeOfLearningDevelopment, conductedSponsored], (err, result) => {
        if (err) {
          console.error('Error inserting data into the table', err);
          return;
        }
        console.log('Data inserted into the table successfully:', result);
      });
    });

    // Send response after insertion
    res.json({ message: 'Excel file uploaded and data inserted successfully' });

  } catch (error) {
    console.error('Error processing uploaded XLS file:', error);
    res.status(500).json({ error: 'Error processing uploaded XLS file' });
  } finally {
    // Delete the uploaded file to save space on the server
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error('Error deleting uploaded file:', err);
      } else {
        console.log('Uploaded excel file deleted');
      }
    });
  }
});
// ----------------- Learning and Development end ----------------------------

// ----------------- Academic Year start ----------------------------
// Read (Get All ACADEMIC YEAR)
app.get('/academic-year', (req, res) => {
  const query = 'SELECT * FROM academic_year';
  db.query(query, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(result);
  });
});


// Create (Add New academic_year)
app.post('/academic-year', (req, res) => {
  const { description } = req.body;  // Get both name and description from the request body
  const query = 'INSERT INTO academic_year (description) VALUES (?)';
  db.query(query, [description], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ message: 'Academic Year created', id: result.insertId });
  });
});


// Update academic_year
app.put('/academic-year/:id', (req, res) => {
  const { description } = req.body;  // Get both name and description from the request body
  const { id } = req.params;
  const query = 'UPDATE academic_year SET description = ? WHERE id = ?';
  db.query(query, [description, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send({ message: 'Academic Year Updated' });
  });
});


// Delete academic_year
app.delete('/academic-year/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM academic_year WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send({ message: 'Academic Year Deleted' });
  });
});
// end









//START
// Read (Get All TERM )
app.get('/term-table', (req, res) => {
  const query = 'SELECT * FROM term_table';
  db.query(query, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(result);
  });
});


app.get('/term-table', (req, res) => {
  const query = 'SELECT * FROM term_table';
  db.query(query, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(result);
  });
});


// Create (Add New term_table)
app.post('/term-table', (req, res) => {
  const { term_name } = req.body;  // Get both name and description from the request body
  const query = 'INSERT INTO term_table (term_name) VALUES (?)';
  db.query(query, [term_name], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ message: 'Term Table created', id: result.insertId });
  });
});


// Update term_table
app.put('/term-table/:id', (req, res) => {
  const { term_name } = req.body;  // Get both name and description from the request body
  const { id } = req.params;
  const query = 'UPDATE term_table SET term_name = ? WHERE id = ?';
  db.query(query, [term_name, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send({ message: 'Term Table Updated' });
  });
});


// Delete term_table
app.delete('/term-table/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM term_table WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send({ message: 'Term Table Deleted' });
  });
});
// end





//Read (Get All Active Academic Years)
app.get('/active-academic-year', (req, res) => {
  const query = 'SELECT * FROM active_academic_year';
  db.query(query, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(result);
  });
});

// Create (Add New Active Academic Year)
app.post('/active-academic-year', (req, res) => {
  const { academic_year_id, term_id, status } = req.body;  // Get academic year ID, term ID, and status from the request body
  const query = 'INSERT INTO active_academic_year (academic_year_id, term_id, status) VALUES (?, ?, ?)';
  db.query(query, [academic_year_id, term_id, status], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ message: 'Active Academic Year created', id: result.insertId });
  });
});

// Update Active Academic Year
app.put('/active-academic-year/:id', (req, res) => {
  const { academic_year_id, term_id, status } = req.body;  // Get academic year ID, term ID, and status from the request body
  const { id } = req.params;
  const query = 'UPDATE active_academic_year SET academic_year_id = ?, term_id = ?, status = ? WHERE id = ?';
  db.query(query, [academic_year_id, term_id, status, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send({ message: 'Active Academic Year Updated' });
  });
});

// Delete Active Academic Year
app.delete('/active-academic-year/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM active_academic_year WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send({ message: 'Active Academic Year Deleted' });
  });
});
// ----------------- Academic Year End ----------------------------


// ----------------- Official Time Start ----------------------------

// CRUD Routes for citizenship_table
app.route('/citizenship_table')
  // GET: Retrieve all records
  .get((req, res) => {
    db.query('SELECT * FROM citizenship_table', (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(result);
    });
  })
  // POST: Create a new record
  .post((req, res) => {
    const { citizenship_description, citizenshipType, countryName, person_id } = req.body;


    // Ensure person_id is a string before trimming
    const processedPersonId = person_id !== undefined && person_id !== null ? String(person_id).trim() : null;


    const query = 'INSERT INTO citizenship_table (citizenship_description, citizenshipType, countryName, person_id) VALUES (?, ?, ?, ?)';
    db.query(query, [citizenship_description, citizenshipType, countryName, processedPersonId], (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(201).send({ message: 'Item created', id: result.insertId });
    });
  });


// Routes for a specific citizenship table entry based on ID
app.route('/citizenship_table/:id')
  // PUT: Update a specific record
  .put((req, res) => {
    const { citizenship_description, citizenshipType, countryName, person_id } = req.body;
    const { id } = req.params;


    // Ensure person_id is a string before trimming
    const processedPersonId = person_id !== undefined && person_id !== null ? String(person_id).trim() : null;


    const query = 'UPDATE citizenship_table SET citizenship_description = ?, citizenshipType = ?, countryName = ?, person_id = ? WHERE id = ?';
    db.query(query, [citizenship_description, citizenshipType, countryName, processedPersonId, id], (err) => {
      if (err) return res.status(500).send(err);
      res.status(200).send({ message: 'Item updated' });
    });
  })
  // DELETE: Delete a specific record
  .delete((req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM citizenship_table WHERE id = ?';
    db.query(query, [id], (err) => {
      if (err) return res.status(500).send(err);
      res.status(200).send({ message: 'Item deleted' });
    });
  });


// Function to update an item in the citizenship table
const updateCitizenshipItem = (editItem) => {
  // Ensure person_id is a string before trimming
  const processedPersonId = typeof editItem.person_id === 'string' ? editItem.person_id.trim() : String(editItem.person_id);


  // Prepare the data for the update
  const updatedData = {
    ...editItem,
    person_id: processedPersonId, // Use the processed person_id
  };


  // Call the API to update the citizenship item
  fetch(`/api/citizenship_table/${editItem.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  })
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      console.log('Citizenship item updated successfully:', data);
    })
    .catch(error => {
      console.error('Error updating citizenship item:', error);
    });
};
// ----------------- Citizenship end------------------------

// ----------------- Official Time Start ----------------------------

// CRUD Routes for official_time_table
app.route('/official_time_table')
  .get((req, res) => {
    db.query('SELECT * FROM official_time_table', (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(result);
    });
  })
  .post((req, res) => {
    const { person_id, day, official_time_in, official_break_time_in, official_break_time_out, official_time_out, status } = req.body;


    // Ensure person_id is a string before trimming
    const processedPersonId = person_id !== undefined && person_id !== null ? String(person_id).trim() : null;


    const query = 'INSERT INTO official_time_table (person_id, day, official_time_in, official_break_time_in, official_break_time_out, official_time_out, status) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [processedPersonId, day, official_time_in, official_break_time_in, official_break_time_out, official_time_out, status], (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(201).send({ message: 'Item created', id: result.insertId });
    });
  });


app.route('/official_time_table/:id')
  .put((req, res) => {
    const { person_id, day, official_time_in, official_break_time_in, official_break_time_out, official_time_out, status } = req.body;
    const { id } = req.params;


    // Ensure person_id is a string before trimming
    const processedPersonId = person_id !== undefined && person_id !== null ? String(person_id).trim() : null;


    const query = 'UPDATE official_time_table SET person_id = ?, day = ?, official_time_in = ?, official_break_time_in = ?, official_break_time_out = ?, official_time_out = ?, status = ? WHERE id = ?';
    db.query(query, [processedPersonId, day, official_time_in, official_break_time_in, official_break_time_out, official_time_out, status, id], (err) => {
      if (err) return res.status(500).send(err);
      res.status(200).send({ message: 'Item updated' });
    });
  })
  .delete((req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM official_time_table WHERE id = ?';
    db.query(query, [id], (err) => {
      if (err) return res.status(500).send(err);
      res.status(200).send({ message: 'Item deleted' });
    });
  });


// Function to update an item in the official time table
const updateOfficialTimeItem = (editItem) => {
  // Ensure person_id is a string before trimming
  const processedPersonId = typeof editItem.person_id === 'string' ? editItem.person_id.trim() : String(editItem.person_id);


  // Prepare the data for the update
  const updatedData = {
    ...editItem,
    person_id: processedPersonId, // Use the processed person_id
  };


  // Call the API to update the official time item
  fetch(`/api/official_time_table/${editItem.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  })
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      console.log('Official time item updated successfully:', data);
    })
    .catch(error => {
      console.error('Error updating official time item:', error);
    });
};

// ----------------- START Page Access and Page Table ----------------------------

// Page access
app.get('/api/page_access/:userId/:pageId', (req, res) => {
  const { userId, pageId } = req.params;

  console.log(`Checking access for User ID: ${userId} Page ID: ${pageId}`); // Log for debugging

  const query = `SELECT page_privilege FROM page_access WHERE user_id = ? AND page_id = ?`;
  db.query(query, [userId, pageId], (err, results) => {
    if (err) {
      console.error('Database error:', err); // Log the error
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length > 0) {
      console.log('Results:', results); // Log the results for debugging
      // Check against the number 1 for access
      return res.json({ hasAccess: results[0].page_privilege === 1 }); // Check against number 1
    } else {
      return res.json({ hasAccess: false });
    }
  });
});
// =====================================
// User Page Access Management
// =====================================

// Search for a user by ID
app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM users_table WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Database error:', err); // Log the error
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });
});

// Fetch all pages
app.get('/api/pages', (req, res) => {
  db.query('SELECT * FROM pages', (err, results) => {
    if (err) {
      console.error('Database error:', err); // Log the error
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Fetch page access for a user
app.get('/api/page_access/:userId', (req, res) => {
  const { userId } = req.params;
  db.query('SELECT * FROM page_access WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Database error:', err); // Log the error
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Insert a new page access record (grant access), but only if no matching user_id and page_id exists
app.post('/api/page_access', (req, res) => {
  const { user_id, page_id, page_privilege } = req.body;

  // Check if the record already exists
  const checkQuery = 'SELECT * FROM page_access WHERE user_id = ? AND page_id = ?';
  db.query(checkQuery, [user_id, page_id], (err, result) => {
    if (err) {
      console.error('Database error:', err); // Log the error
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.length > 0) {
      // If record exists, do not insert again
      return res.status(409).json({ message: 'Page access already exists for this user and page' });
    } else {
      // If no record exists, insert a new one
      const insertQuery = 'INSERT INTO page_access (user_id, page_id, page_privilege) VALUES (?, ?, ?)';
      db.query(insertQuery, [user_id, page_id, page_privilege], (err) => {
        if (err) {
          console.error('Database error:', err); // Log the error
          return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ message: 'Page access created' });
      });
    }
  });
});

// Update an existing page access record
app.put('/api/page_access/:userId/:pageId', (req, res) => {
  const { userId, pageId } = req.params;
  const { page_privilege } = req.body;
  const query = 'UPDATE page_access SET page_privilege = ? WHERE user_id = ? AND page_id = ?';
  db.query(query, [page_privilege, userId, pageId], (err) => {
    if (err) {
      console.error('Database error:', err); // Log the error
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Page access updated' });
  });
});


// ----------------- END Page Access and Page Table ----------------------------
//--------------------- Term Table Routes -----------------------//

// Get all terms
app.get('/term-table', (req, res) => {
  const query = 'SELECT * FROM term_table';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching terms:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    res.status(200).json(result);
  });
});

// Add a new term
app.post('/term-table', (req, res) => {
  const { term_name } = req.body;
  if (!term_name) {
    return res.status(400).json({ message: 'Term name is required' });
  }
  const query = 'INSERT INTO term_table (term_name) VALUES (?)';
  db.query(query, [term_name], (err, result) => {
    if (err) {
      console.error('Error inserting term:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    res.status(201).json({ message: 'Term created', id: result.insertId });
  });
});

// Update a term
app.put('/term-table/:id', (req, res) => {
  const { id } = req.params;
  const { term_name } = req.body;
  if (!term_name) {
    return res.status(400).json({ message: 'Term name is required' });
  }
  const query = 'UPDATE term_table SET term_name = ? WHERE id = ?';
  db.query(query, [term_name, id], (err, result) => {
    if (err) {
      console.error('Error updating term:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Term not found' });
    }
    res.status(200).json({ message: 'Term updated' });
  });
});

// Delete a term
app.delete('/term-table/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM term_table WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting term:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Term not found' });
    }
    res.status(200).json({ message: 'Term deleted' });
  });
});

//--------------------- Academic Year Routes -----------------------//

// Get all academic years
app.get('/academic-year', (req, res) => {
  const query = 'SELECT * FROM academic_year';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching academic years:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    res.status(200).json(result);
  });
});

// Add a new academic year
app.post('/academic-year', (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ message: 'Description is required' });
  }
  const query = 'INSERT INTO academic_year (description) VALUES (?)';
  db.query(query, [description], (err, result) => {
    if (err) {
      console.error('Error inserting academic year:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    res.status(201).json({ message: 'Academic year created', id: result.insertId });
  });
});

// Update an academic year
app.put('/academic-year/:id', (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ message: 'Description is required' });
  }
  const query = 'UPDATE academic_year SET description = ? WHERE id = ?';
  db.query(query, [description, id], (err, result) => {
    if (err) {
      console.error('Error updating academic year:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Academic year not found' });
    }
    res.status(200).json({ message: 'Academic year updated' });
  });
});

// Delete an academic year
app.delete('/academic-year/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM academic_year WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting academic year:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Academic year not found' });
    }
    res.status(200).json({ message: 'Academic year deleted' });
  });
});

//--------------------- Active Academic Year Routes -----------------------//

// Get all active academic years
app.get('/active-academic-year', (req, res) => {
  const query = `
    SELECT 
      aay.id, 
      aay.academic_year_id, 
      ay.description AS academic_year_description, 
      aay.term_id, 
      t.term_name AS term_description, 
      aay.status 
    FROM active_academic_year aay
    LEFT JOIN academic_year ay ON aay.academic_year_id = ay.id
    LEFT JOIN term_table t ON aay.term_id = t.id
  `;
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching active academic years:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    res.status(200).json(result);
  });
});

// Add a new active academic year
app.post('/active-academic-year', (req, res) => {
  const { academic_year_id, term_id, status } = req.body;
  if (!academic_year_id || !term_id || !status) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const query = 'INSERT INTO active_academic_year (academic_year_id, term_id, status) VALUES (?, ?, ?)';
  db.query(query, [academic_year_id, term_id, status], (err, result) => {
    if (err) {
      console.error('Error inserting active academic year:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    res.status(201).json({ message: 'Active academic year created', id: result.insertId });
  });
});

// Update an active academic year
app.put('/active-academic-year/:id', (req, res) => {
  const { id } = req.params;
  const { academic_year_id, term_id, status } = req.body;
  if (!academic_year_id || !term_id || !status) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const query = 'UPDATE active_academic_year SET academic_year_id = ?, term_id = ?, status = ? WHERE id = ?';
  db.query(query, [academic_year_id, term_id, status, id], (err, result) => {
    if (err) {
      console.error('Error updating active academic year:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Active academic year not found' });
    }
    res.status(200).json({ message: 'Active academic year updated' });
  });
});

// Delete an active academic year
app.delete('/active-academic-year/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM active_academic_year WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting active academic year:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Active academic year not found' });
    }
    res.status(200).json({ message: 'Active academic year deleted' });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});