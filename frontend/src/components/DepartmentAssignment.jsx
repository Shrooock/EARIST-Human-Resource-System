import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {Button,Table,TableBody,TableCell,TableHead,TableRow,TextField,Container,Snackbar,CircularProgress,Alert,} from '@mui/material';

const DepartmentAssignment = () => {

 // -------------- Page Access Upper-Start ---------------

 const [hasAccess, setHasAccess] = useState(null); // Updated to null to show loading state


 useEffect(() => {
     // Retrieve userId from localStorage (make sure this exists and is correct)
     const userId = localStorage.getItem('userId');
     const pageId = 13; // The page ID for the Profile
 
 
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


// -------------- Department Assignment Table Start ---------------
  // State variables
  const [data, setData] = useState([]);
  const [departmentId, setDepartmentId] = useState('');
  const [personId, setPersonId] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [file, setFile] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchDepartmentAssignments();
  }, []);

  // Fetch department assignments from the server
  const fetchDepartmentAssignments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/department-assignment');
      setData(response.data);
    } catch (error) {
      showSnackbar('Failed to fetch department assignments.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Add a new department assignment
  const addDepartmentAssignment = async () => {
    if (!departmentId || !personId) {
      showSnackbar('Both fields are required.', 'warning');
      return;
    }

    try {
      await axios.post('http://localhost:5000/department-assignment', {
        department_id: departmentId,
        person_id: personId,
      });
      setDepartmentId('');
      setPersonId('');
      fetchDepartmentAssignments();
      showSnackbar('Department assignment added successfully.', 'success');
    } catch (error) {
      showSnackbar('Failed to add department assignment.', 'error');
    }
  };

  // Update an existing department assignment
  const updateDepartmentAssignment = async () => {
    if (!editItem) return;

    try {
      await axios.put(`http://localhost:5000/department-assignment/${editItem.id}`, {
        department_id: editItem.department_id,
        person_id: editItem.person_id,
      });
      setEditItem(null);
      fetchDepartmentAssignments();
      showSnackbar('Department assignment updated successfully.', 'success');
    } catch (error) {
      showSnackbar('Failed to update department assignment.', 'error');
    }
  };

  // Delete a department assignment
  const deleteDepartmentAssignment = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/department-assignment/${id}`);
      fetchDepartmentAssignments();
      showSnackbar('Department assignment deleted successfully.', 'success');
    } catch (error) {
      showSnackbar('Failed to delete department assignment.', 'error');
    }
  };

  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Handle file upload
  const uploadFile = async () => {
    if (!file) {
      showSnackbar('Please select a file to upload.', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:5000/upload-department-assignment', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFile(null);
      fetchDepartmentAssignments();
      showSnackbar('File uploaded successfully.', 'success');
    } catch (error) {
      showSnackbar('Failed to upload file.', 'error');
    }
  };

  // Snackbar functions
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

// -------------- Department Assignment Table End ---------------

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


  // Render component
  return (
    <Container>
      <h1>Department Assignment</h1>

      {/* Add New Assignment */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
        <TextField
          label="Department ID"
          variant="outlined"
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <TextField
          label="Person ID"
          variant="outlined"
          value={personId}
          onChange={(e) => setPersonId(e.target.value)}
        />
        <Button
          variant="outlined"
          color="primary"
          onClick={addDepartmentAssignment}
          style={{ marginLeft: '10px' }}
        >
          Add
        </Button>
      </div>

      {/* File Upload */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="file-upload">
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
          onClick={uploadFile}
          disabled={!file}
          style={{ marginLeft: '10px' }}
        >
          Upload
        </Button>
      </div>

      {/* Data Table */}
      {loading ? (
        <CircularProgress />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Department ID</TableCell>
              <TableCell>Person ID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>
                  {editItem?.id === item.id ? (
                    <TextField
                      value={editItem.department_id}
                      onChange={(e) =>
                        setEditItem({ ...editItem, department_id: e.target.value })
                      }
                    />
                  ) : (
                    item.department_id
                  )}
                </TableCell>
                <TableCell>
                  {editItem?.id === item.id ? (
                    <TextField
                      value={editItem.person_id}
                      onChange={(e) =>
                        setEditItem({ ...editItem, person_id: e.target.value })
                      }
                    />
                  ) : (
                    item.person_id
                  )}
                </TableCell>
                <TableCell>
                  {editItem?.id === item.id ? (
                    <>
                      <Button onClick={updateDepartmentAssignment} variant="outlined" color="primary">
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditItem(null)}
                        variant="outlined"
                        color="secondary"
                        style={{ marginLeft: '10px' }}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={() => setEditItem(item)} variant="outlined" color="primary">
                        Edit
                      </Button>
                      <Button
                        onClick={() => deleteDepartmentAssignment(item.id)}
                        variant="outlined"
                        color="secondary"
                        style={{ marginLeft: '10px' }}
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

export default DepartmentAssignment;
