import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, Container, Typography, Box, CircularProgress, Paper, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const College = () => {

// -------------- Page Access Upper-Start ---------------

const [hasAccess, setHasAccess] = useState(null); // Updated to null to show loading state


    useEffect(() => {
        // Retrieve userId from localStorage (make sure this exists and is correct)
        const userId = localStorage.getItem('userId');
        const pageId = 11; // The page ID for the Profile


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



// -------------- College Table Start ---------------

  const [data, setData] = useState([]);
  const [newCollege, setNewCollege] = useState({});
  const [editCollege, setEditCollege] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [severity, setSeverity] = useState('info'); // Add state for severity of the snackbar
  const navigate = useNavigate();

  // Fetch all colleges on mount
  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const response = await axios.get('http://localhost:5000/colleges');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    }
  };
  
  const addCollege = async () => {
    if (!newCollege.collegeNameOfSchool) {
      setMessage('College Name is required.');
      setSeverity('warning'); // Set severity to warning if validation fails
      setSnackbarOpen(true);
      return;
    }
    try {
      await axios.post('http://localhost:5000/colleges', newCollege);
      setNewCollege({});
      fetchColleges();
      setMessage('College added successfully.');
      setSeverity('success'); // Set severity to success if the operation is successful
      setSnackbarOpen(true);
    } catch (error) {
      setMessage('Failed to add college.');
      setSeverity('error'); // Set severity to error if the operation fails
      setSnackbarOpen(true);
    }
  };

  const updateCollege = async () => {
    if (!editCollege || !editCollege.collegeNameOfSchool) {
      setMessage('College Name is required.');
      setSeverity('warning');
      setSnackbarOpen(true);
      return;
    }
    try {
      await axios.put(`http://localhost:5000/colleges/${editCollege.id}`, editCollege);
      setEditCollege(null);
      fetchColleges();
      setMessage('College updated successfully.');
      setSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      setMessage('Failed to update college.');
      setSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const deleteCollege = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/colleges/${id}`);
      fetchColleges();
      setMessage('College deleted successfully.');
      setSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      setMessage('Failed to delete college.');
      setSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!file) {
      setMessage('Please select a file to upload.');
      setSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/upload-xls', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(response.data.message || 'File uploaded successfully.');
      setSeverity('success');
      setSnackbarOpen(true);
      setFile(null);
      fetchColleges(); // Optional: Refresh the college list after upload
    } catch (error) {
      console.error('Error during file upload:', error);
      setMessage('File upload failed.');
      setSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // -------------- College Table End ---------------


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
      <Typography variant="h4" gutterBottom align="center" style={{ fontWeight: 'bold', marginTop: '20px' }}>
      College</Typography>


      {/* Snackbar with different severity */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000} // Snackbar disappears after 4 seconds
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={severity}>
          {message}
        </Alert>
      </Snackbar>

      {/* Add College Form */}
      <Box component={Paper} padding={3} mb={4}>
        <Typography variant="h6" gutterBottom>
          Add New College
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={2}>
          <TextField
            label="College Name"
            value={newCollege.collegeNameOfSchool || ''}
            onChange={(e) => setNewCollege({ ...newCollege, collegeNameOfSchool: e.target.value })}
          />
          <TextField
            label="Degree"
            value={newCollege.collegeDegree || ''}
            onChange={(e) => setNewCollege({ ...newCollege, collegeDegree: e.target.value })}
          />
          <TextField
            label="Period From"
            value={newCollege.collegePeriodFrom || ''}
            onChange={(e) => setNewCollege({ ...newCollege, collegePeriodFrom: e.target.value })}
          />
          <TextField
            label="Period To"
            value={newCollege.collegePeriodTo || ''}
            onChange={(e) => setNewCollege({ ...newCollege, collegePeriodTo: e.target.value })}
          />
          <TextField
            label="Highest Attained"
            value={newCollege.collegeHighestAttained || ''}
            onChange={(e) => setNewCollege({ ...newCollege, collegeHighestAttained: e.target.value })}
          />
          <TextField
            label="Year Graduated"
            value={newCollege.collegeYearGraduated || ''}
            onChange={(e) => setNewCollege({ ...newCollege, collegeYearGraduated: e.target.value })}
          />
          <TextField
            label="Honors Received"
            value={newCollege.collegeScholarshipAcademicHonorsReceived || ''}
            onChange={(e) => setNewCollege({ ...newCollege, collegeScholarshipAcademicHonorsReceived: e.target.value })}
          />
          <TextField
            label="Person ID"
            value={newCollege.person_id || ''}
            onChange={(e) => setNewCollege({ ...newCollege, person_id: e.target.value })}
          />
          <Button onClick={addCollege} variant="outlined" color="primary" style={{ marginLeft: '10px' }}>
            Add
          </Button>
        </Box>
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


      {/* Colleges Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>College Name</TableCell>
            <TableCell>Degree</TableCell>
            <TableCell>Period From</TableCell>
            <TableCell>Period To</TableCell>
            <TableCell>Highest Attained</TableCell>
            <TableCell>Year Graduated</TableCell>
            <TableCell>Honors Received</TableCell>
            <TableCell>Person ID</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((college) => (
            <TableRow key={college.id}>
              <TableCell>{college.id}</TableCell>
              <TableCell>
                {editCollege?.id === college.id ? (
                  <TextField
                    value={editCollege.collegeNameOfSchool || ''}
                    onChange={(e) =>
                      setEditCollege({ ...editCollege, collegeNameOfSchool: e.target.value })
                    }
                  />
                ) : (
                  college.collegeNameOfSchool
                )}
              </TableCell>
              <TableCell>
                {editCollege?.id === college.id ? (
                  <TextField
                    value={editCollege.collegeDegree || ''}
                    onChange={(e) =>
                      setEditCollege({ ...editCollege, collegeDegree: e.target.value })
                    }
                  />
                ) : (
                  college.collegeDegree
                )}
              </TableCell>
              <TableCell>
                {editCollege?.id === college.id ? (
                  <TextField
                    value={editCollege.collegePeriodFrom || ''}
                    onChange={(e) =>
                      setEditCollege({ ...editCollege, collegePeriodFrom: e.target.value })
                    }
                  />
                ) : (
                  college.collegePeriodFrom
                )}
              </TableCell>
              <TableCell>
                {editCollege?.id === college.id ? (
                  <TextField
                    value={editCollege.collegePeriodTo || ''}
                    onChange={(e) =>
                      setEditCollege({ ...editCollege, collegePeriodTo: e.target.value })
                    }
                  />
                ) : (
                  college.collegePeriodTo
                )}
              </TableCell>
              <TableCell>
                {editCollege?.id === college.id ? (
                  <TextField
                    value={editCollege.collegeHighestAttained || ''}
                    onChange={(e) =>
                      setEditCollege({ ...editCollege, collegeHighestAttained: e.target.value })
                    }
                  />
                ) : (
                  college.collegeHighestAttained
                )}
              </TableCell>
              <TableCell>
                {editCollege?.id === college.id ? (
                  <TextField
                    value={editCollege.collegeYearGraduated || ''}
                    onChange={(e) =>
                      setEditCollege({ ...editCollege, collegeYearGraduated: e.target.value })
                    }
                  />
                ) : (
                  college.collegeYearGraduated
                )}
              </TableCell>
              <TableCell>
                {editCollege?.id === college.id ? (
                  <TextField
                    value={editCollege.collegeScholarshipAcademicHonorsReceived || ''}
                    onChange={(e) =>
                      setEditCollege({ ...editCollege, collegeScholarshipAcademicHonorsReceived: e.target.value })
                    }
                  />
                ) : (
                  college.collegeScholarshipAcademicHonorsReceived
                )}
              </TableCell>
              <TableCell>
                {editCollege?.id === college.id ? (
                  <TextField
                    value={editCollege.person_id || ''}
                    onChange={(e) =>
                      setEditCollege({ ...editCollege, person_id: e.target.value })
                    }
                  />
                ) : (
                  college.person_id
                )}
              </TableCell>
              <TableCell>
  {editCollege?.id === college.id ? (
    <Button
      onClick={updateCollege}
      variant="outlined"
      color="primary"
    >
      Save
    </Button>
  ) : (
    <Button
      onClick={() => setEditCollege(college)}
      variant="outlined"
      color="primary"
    >
      Edit
    </Button>
  )}
  <Button
    onClick={() => deleteCollege(college.id)}
    variant="outlined"
    color="secondary"
  >
    Delete
  </Button>
</TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default College;
