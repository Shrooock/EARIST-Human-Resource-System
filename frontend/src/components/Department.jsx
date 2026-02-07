import React, { useEffect, useState } from 'react';
import {
  Button,
  TextField,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
} from '@mui/material';
import axios from 'axios';

const Department = () => {

  // -------------- Page Access Upper-Start ---------------

const [hasAccess, setHasAccess] = useState(null); // Updated to null to show loading state


useEffect(() => {
    // Retrieve userId from localStorage (make sure this exists and is correct)
    const userId = localStorage.getItem('userId');
    const pageId = 12; // The page ID for the Profile


    // If userId is missing, deny access early
    if (!userId) {
        setHasAccess(false);
        return;
    }


    // Function to check if the user has access
    const checkAccess = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/page_access/${userId}/${pageId}`);
            
            // Check if the API response contains the 'hasAccess' field
            if (response.data && typeof response.data.hasAccess === 'boolean') {
                setHasAccess(response.data.hasAccess);
            } else {
                console.error('Unexpected API response format:', response.data);
                setHasAccess(false);
            }
        } catch (error) {
            console.error('Error checking access:', error);
            setHasAccess(false); // No access if there's an error
        }
    };


    checkAccess();
}, []);
// -------------- Page Access Upper-End ---------------


// -------------- Department Table Start ---------------

  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState('');
  const [departmentCode, setDepartmentCode] = useState('');
  const [editDepartment, setEditDepartment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
  const [file, setFile] = useState(null);

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/department');
      setDepartments(response.data); // Ensure this matches your backend response
    } catch (error) {
      showSnackbar('Failed to fetch departments.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addDepartment = async () => {
    if (!departmentName.trim() || !departmentCode.trim()) {
      showSnackbar('Both fields are required.', 'warning');
      return;
    }

    try {
      await axios.post('http://localhost:5000/department', {
        department_name: departmentName,
        department_code: departmentCode,
      });
      setDepartmentName('');
      setDepartmentCode('');
      fetchDepartments();
      showSnackbar('Department added successfully.', 'success');
    } catch (error) {
      showSnackbar('Failed to add department.', 'error');
    }
  };

  const updateDepartment = async () => {
    if (!editDepartment) return;

    const { id, department_name, department_code } = editDepartment;
    if (!department_name.trim() || !department_code.trim()) {
      showSnackbar('Both fields are required.', 'warning');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/department/${id}`, {
        department_name,
        department_code,
      });
      setEditDepartment(null);
      fetchDepartments();
      showSnackbar('Department updated successfully.', 'success');
    } catch (error) {
      showSnackbar('Failed to update department.', 'error');
    }
  };

  const deleteDepartment = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/department/${id}`);
      fetchDepartments();
      showSnackbar('Department deleted successfully.', 'success');
    } catch (error) {
      showSnackbar('Failed to delete department.', 'error');
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      showSnackbar('Please select a file to upload.', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:5000/upload-department', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFile(null);
      fetchDepartments();
      showSnackbar('File uploaded and data inserted successfully.', 'success');
    } catch (error) {
      showSnackbar('Failed to upload file.', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      showSnackbar(`File "${selectedFile.name}" selected.`, 'info');
    }
  };

  // -------------- Department Table End ---------------


  // -------------- Page Access Lower-Start ---------------
// If hasAccess is still null, show a loading state
if (hasAccess === null) {
  return <div>Loading access information...</div>;
}


// Deny access if hasAccess is false
if (!hasAccess) {
  return <div>You do not have access to this page. Contact the administrator to request access.</div>;
}

// -------------- Page Access Lower-End ---------------

  return (
    <Container>
      <h1>Departments</h1>
      {/* Add New Department */}
      <Box mb={3}>
        <TextField
          label="Department Name"
          variant="outlined"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <TextField
          label="Department Code"
          variant="outlined"
          value={departmentCode}
          onChange={(e) => setDepartmentCode(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={addDepartment}
          style={{ marginLeft: '10px' }}
        >
          Add
        </Button>
      </Box>

      {/* File Upload */}
      <Box mb={3}>
        <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
          <Button variant="outlined" component="span">
            {file ? file.name : 'Choose File'}
          </Button>
          <input
            id="file-upload"
            type="file"
            accept=".xls,.xlsx"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </label>
        <Button
          variant="contained"
          color="primary"
          onClick={handleFileUpload}
          disabled={!file}
          style={{ marginLeft: '10px' }}
        >
          Upload File
        </Button>
      </Box>

      {/* Department Table */}
      {loading ? (
        <CircularProgress />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Department Name</TableCell>
              <TableCell>Department Code</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {departments.map((dept) => (
              <TableRow key={dept.id}>
                <TableCell>{dept.id}</TableCell>
                <TableCell>
                  {editDepartment?.id === dept.id ? (
                    <TextField
                      value={editDepartment.department_name}
                      onChange={(e) =>
                        setEditDepartment({ ...editDepartment, department_name: e.target.value })
                      }
                    />
                  ) : (
                    dept.department_name
                  )}
                </TableCell>
                <TableCell>
                  {editDepartment?.id === dept.id ? (
                    <TextField
                      value={editDepartment.department_code}
                      onChange={(e) =>
                        setEditDepartment({ ...editDepartment, department_code: e.target.value })
                      }
                    />
                  ) : (
                    dept.department_code
                  )}
                </TableCell>
                <TableCell>
                  {editDepartment?.id === dept.id ? (
                    <>
                      <Button onClick={updateDepartment} variant="outlined" color="secondary">
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditDepartment(null)}
                        variant="outlined"
                        color="secondary"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => setEditDepartment(dept)}
                        variant="outlined"
                        color="primary"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => deleteDepartment(dept.id)}
                        variant="outlined"
                        color="secondary"
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Department;
