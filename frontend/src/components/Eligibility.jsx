import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, Container, Grid, Paper, Typography, Box } from '@mui/material';

const Eligibility = () => {

// -------------- Page Access Upper-Start ---------------

const [hasAccess, setHasAccess] = useState(null); // Updated to null to show loading state


    useEffect(() => {
        // Retrieve userId from localStorage (make sure this exists and is correct)
        const userId = localStorage.getItem('userId');
        const pageId = 10; // The page ID for the Profile


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



// -------------- Eligibility Table Start ---------------

  const [data, setData] = useState([]); // To hold eligibility data
  const [newEligibility, setNewEligibility] = useState({
    eligibilityName: '',
    eligibilityRating: '',
    eligibilityDateOfExam: '',
    eligibilityPlaceOfExam: '',
    licenseNumber: '',
    DateOfValidity: '',
  }); // To hold input for new eligibility
  const [editEligibility, setEditEligibility] = useState(null); // To hold eligibility being edited
  const [file, setFile] = useState(null); // To manage the selected file

  // Fetch all eligibility records on component mount
  useEffect(() => {
    fetchEligibility();
  }, []);

  const fetchEligibility = async () => {
    try {
      const response = await axios.get('http://localhost:5000/eligibility');
      // Format dates to remove time component
      const formattedData = response.data.map((item) => ({
        ...item,
        eligibilityDateOfExam: item.eligibilityDateOfExam ? item.eligibilityDateOfExam.split('T')[0] : '',
        DateOfValidity: item.DateOfValidity ? item.DateOfValidity.split('T')[0] : '',
      }));
      setData(formattedData);
    } catch (error) {
      console.error('Error fetching eligibility:', error);
    }
  };

  // Add new eligibility
  const addEligibility = async () => {
    try {
      await axios.post('http://localhost:5000/eligibility', newEligibility);
      setNewEligibility({
        eligibilityName: '',
        eligibilityRating: '',
        eligibilityDateOfExam: '',
        eligibilityPlaceOfExam: '',
        licenseNumber: '',
        DateOfValidity: '',
      });
      fetchEligibility(); // Refresh the eligibility data
    } catch (error) {
      console.error('Error adding eligibility:', error);
    }
  };

  // Update eligibility
  const updateEligibility = async () => {
    if (!editEligibility) return;
    try {
      await axios.put(`http://localhost:5000/eligibility/${editEligibility.id}`, editEligibility);
      setEditEligibility(null); // Clear edit mode after saving
      fetchEligibility(); // Refresh the data
    } catch (error) {
      console.error('Error updating eligibility:', error);
    }
  };

  // Delete eligibility
  const deleteEligibility = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/eligibility/${id}`);
      fetchEligibility(); // Refresh the data
    } catch (error) {
      console.error('Error deleting eligibility:', error);
    }
  };

  // Handle file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!file) return alert('Please select a file first.');

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:5000/upload-eligibility', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded successfully!');
      fetchEligibility(); // Fetch the updated eligibility data after the file upload
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file.');
    }
  };

  // -------------- Eligibility Table End ---------------


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
        Eligibility
      </Typography>

      {/* Add New Eligibility */}
      <Paper elevation={3} style={{ padding: '16px', marginBottom: '20px' }}>
        <Typography variant="h6" gutterBottom>
          Add New Eligibility
        </Typography>
        <Grid container spacing={2}>
          {Object.keys(newEligibility).map((key) => (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <TextField
                label={key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                value={newEligibility[key]}
                onChange={(e) => setNewEligibility({ ...newEligibility, [key]: e.target.value })}
                type={key.includes('Date') ? 'date' : 'text'}
                InputLabelProps={key.includes('Date') ? { shrink: true } : {}}
                fullWidth
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button onClick={addEligibility} variant="outlined" color="primary" size="small">
              Add
            </Button>
          </Grid>
        </Grid>
      </Paper>

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

      {/* Eligibility Table */}
      <Paper elevation={3} style={{ padding: '16px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Eligibility Name</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Date of Exam</TableCell>
              <TableCell>Place of Exam</TableCell>
              <TableCell>License Number</TableCell>
              <TableCell>Date of Validity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((eligibility) => (
              <TableRow key={eligibility.id}>
                <TableCell>{eligibility.id}</TableCell>
                {Object.keys(eligibility).slice(1, -1).map((key) => (
                  <TableCell key={key}>
                    {editEligibility && editEligibility.id === eligibility.id ? (
                      <TextField
                        value={editEligibility[key]}
                        onChange={(e) => setEditEligibility({ ...editEligibility, [key]: e.target.value })}
                        type={key.includes('Date') ? 'date' : 'text'}
                        InputLabelProps={key.includes('Date') ? { shrink: true } : {}}
                        fullWidth
                      />
                    ) : (
                      eligibility[key]
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  {editEligibility && editEligibility.id === eligibility.id ? (
                    <>
                      <Button onClick={updateEligibility} variant="contained" color="primary" size="small">
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditEligibility(null)}
                        variant="outlined"
                        color="secondary"
                        style={{ marginLeft: '10px' }}
                        size="small"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => setEditEligibility(eligibility)}
                        variant="outlined"
                        color="primary"
                        size="small"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => deleteEligibility(eligibility.id)}
                        variant="outlined"
                        color="secondary"
                        style={{ marginLeft: '10px' }}
                        size="small"
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
      </Paper>
    </Container>
  );
};

export default Eligibility;
