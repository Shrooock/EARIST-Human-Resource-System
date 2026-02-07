import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, Container, Typography, Grid, Paper, Snackbar, Alert, CircularProgress } from '@mui/material';

const VocationalData = () => {

// -------------- Page Access Upper-Start ---------------

const [hasAccess, setHasAccess] = useState(null); // Updated to null to show loading state


    useEffect(() => {
        // Retrieve userId from localStorage (make sure this exists and is correct)
        const userId = localStorage.getItem('userId');
        const pageId = 16; // The page ID for the Profile


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


// -------------- Vocational Data Table Start ---------------

  const [vocationalData, setVocationalData] = useState([]);
  const [newVocational, setNewVocational] = useState({
    vocationalNameOfSchool: '',
    vocationalDegree: '',
    vocationalPeriodFrom: '',
    vocationalPeriodTo: '',
    vocationalHighestAttained: '',
    vocationalYearGraduated: ''
  });
  const [editVocationalId, setEditVocationalId] = useState(null);
  const [editedRecord, setEditedRecord] = useState({});
  const [file, setFile] = useState(null); // File state for upload
  const [uploadMessage, setUploadMessage] = useState(''); // Message to show file upload status
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVocationalData();
  }, []);

  const fetchVocationalData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/vocational');
      setVocationalData(response.data);
    } catch (error) {
      setSnackbarMessage('Failed to fetch vocational records.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const addVocationalData = async () => {
    try {
      await axios.post('http://localhost:5000/vocational', newVocational);
      setNewVocational({
        vocationalNameOfSchool: '',
        vocationalDegree: '',
        vocationalPeriodFrom: '',
        vocationalPeriodTo: '',
        vocationalHighestAttained: '',
        vocationalYearGraduated: ''
      });
      fetchVocationalData();
      setSnackbarMessage('Vocational record added successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Error adding vocational record!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleFieldChange = (e, field) => {
    const { value } = e.target;
    setEditedRecord(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  const startEdit = (id) => {
    const record = vocationalData.find(item => item.id === id);
    setEditedRecord(record);
    setEditVocationalId(id);
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`http://localhost:5000/vocational/${id}`, editedRecord);
      setEditVocationalId(null);
      fetchVocationalData();
      setSnackbarMessage('Vocational record updated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Error updating vocational record!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const cancelEdit = () => {
    setEditVocationalId(null);
  };

  const deleteVocationalData = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/vocational/${id}`);
      fetchVocationalData();
      setSnackbarMessage('Vocational record deleted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Error deleting vocational record!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Handle file change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!file) {
      setSnackbarMessage('Please select a file to upload');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload-vocational', formData, {  // Assuming "1" is the record ID for file upload
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSnackbarMessage(response.data.message || 'File uploaded successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      fetchVocationalData(); // Refresh data after upload
    } catch (error) {
      console.error('Error uploading file:', error);
      setSnackbarMessage('File upload failed');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };


  // -------------- Vocational Data Table End ---------------

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
<Typography gutterBottom align="center" variant="h4">Vocational Data</Typography>

      {/* Add New Vocational Record Form */}
      <Paper elevation={2} style={{ padding: '16px', marginBottom: '24px' }}>
        <Typography variant="h6" gutterBottom>
          Add Vocational Record
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField 
              label="School" 
              value={newVocational.vocationalNameOfSchool} 
              onChange={(e) => setNewVocational({ ...newVocational, vocationalNameOfSchool: e.target.value })} 
              fullWidth 
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              label="Degree" 
              value={newVocational.vocationalDegree} 
              onChange={(e) => setNewVocational({ ...newVocational, vocationalDegree: e.target.value })} 
              fullWidth 
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              label="From" 
              type="number" 
              value={newVocational.vocationalPeriodFrom} 
              onChange={(e) => setNewVocational({ ...newVocational, vocationalPeriodFrom: e.target.value })} 
              fullWidth 
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              label="To" 
              type="number" 
              value={newVocational.vocationalPeriodTo} 
              onChange={(e) => setNewVocational({ ...newVocational, vocationalPeriodTo: e.target.value })} 
              fullWidth 
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              label="Highest Attained" 
              value={newVocational.vocationalHighestAttained} 
              onChange={(e) => setNewVocational({ ...newVocational, vocationalHighestAttained: e.target.value })} 
              fullWidth 
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              label="Year Graduated" 
              type="number" 
              value={newVocational.vocationalYearGraduated} 
              onChange={(e) => setNewVocational({ ...newVocational, vocationalYearGraduated: e.target.value })} 
              fullWidth 
            />
          </Grid>
          <Grid item xs={12}>
            <Button onClick={addVocationalData} variant="outlined" color="primary"> 
              Add Vocational
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* File Upload Section */}
      <Paper elevation={2} style={{ padding: '16px', marginBottom: '24px' }}>
        <Typography variant="h6" gutterBottom>
          Upload Vocational Data (XLS File)
        </Typography>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
            <Button variant="outlined" component="span" style={{ backgroundColor: 'white' }}>
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
        </div>
        {uploadMessage && (
          <Typography variant="body2" color="textSecondary" align="center" style={{ marginTop: '8px' }}>
            {uploadMessage}
          </Typography>
        )}
      </Paper>

      {/* Vocational Records Table */}
      <Paper elevation={2} style={{ padding: '16px' }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>School</TableCell>
                <TableCell>Degree</TableCell>
                <TableCell>Period From</TableCell>
                <TableCell>Period To</TableCell>
                <TableCell>Highest Attained</TableCell>
                <TableCell>Year Graduated</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vocationalData.map((row) => (
                <TableRow key={row.id}>
                  {editVocationalId === row.id ? (
                    <>
                      <TableCell>
                        <TextField
                          value={editedRecord.vocationalNameOfSchool}
                          onChange={(e) => handleFieldChange(e, 'vocationalNameOfSchool')}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={editedRecord.vocationalDegree}
                          onChange={(e) => handleFieldChange(e, 'vocationalDegree')}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={editedRecord.vocationalPeriodFrom}
                          onChange={(e) => handleFieldChange(e, 'vocationalPeriodFrom')}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={editedRecord.vocationalPeriodTo}
                          onChange={(e) => handleFieldChange(e, 'vocationalPeriodTo')}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={editedRecord.vocationalHighestAttained}
                          onChange={(e) => handleFieldChange(e, 'vocationalHighestAttained')}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={editedRecord.vocationalYearGraduated}
                          onChange={(e) => handleFieldChange(e, 'vocationalYearGraduated')}
                        />
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => saveEdit(row.id)} color="primary" variant="contained">
                          Save
                        </Button>
                        <Button onClick={cancelEdit} color="secondary">
                          Cancel
                        </Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{row.vocationalNameOfSchool}</TableCell>
                      <TableCell>{row.vocationalDegree}</TableCell>
                      <TableCell>{row.vocationalPeriodFrom}</TableCell>
                      <TableCell>{row.vocationalPeriodTo}</TableCell>
                      <TableCell>{row.vocationalHighestAttained}</TableCell>
                      <TableCell>{row.vocationalYearGraduated}</TableCell>
                      <TableCell>
                        <Button onClick={() => startEdit(row.id)} color="primary" variant="outlined">
                          Edit
                        </Button>
                        <Button onClick={() => deleteVocationalData(row.id)} color="secondary" variant="outlined">
                          Delete
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* Snackbar for success or error messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default VocationalData;
