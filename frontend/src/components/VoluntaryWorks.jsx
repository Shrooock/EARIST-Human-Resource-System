import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Container,
  Grid,
  Paper,
  Snackbar,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const VoluntaryWorks = () => {


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



// -------------- Voluntary Works Table Start ---------------
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [numberOfHours, setNumberOfHours] = useState('');
  const [numberOfWorks, setNumberOfWorks] = useState('');
  const [editItemId, setEditItemId] = useState(null); // Track which row is being edited
  const [editedRow, setEditedRow] = useState(null); // Temporarily store edited data
  const [file, setFile] = useState(null); // Store the selected file
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  // Fetch data from server
  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/voluntary-work');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  // Add a new item
  const handleSubmit = async () => {
    if (!name.trim() || !address.trim() || !dateFrom || !dateTo || !numberOfHours || !numberOfWorks) {
      setSnackbarMessage('All fields are required.');
      setSnackbarOpen(true);
      return;
    }

    try {
      await axios.post('http://localhost:5000/voluntary-work', {
        nameAndAddress: `${name} - ${address}`,
        dateFrom,
        dateTo,
        numberOfHours: Number(numberOfHours),
        numberOfWorks: Number(numberOfWorks),
      });

      setSnackbarMessage('Item added successfully!');
      setName('');
      setAddress('');
      setDateFrom('');
      setDateTo('');
      setNumberOfHours('');
      setNumberOfWorks('');
      fetchItems();
    } catch (error) {
      console.error('Error adding item:', error);
      setSnackbarMessage('Error adding item.');
    } finally {
      setSnackbarOpen(true);
    }
  };

  // Edit a specific row
  const handleEdit = (item) => {
    setEditItemId(item.id); // Set the row to be edited
    setEditedRow({ ...item }); // Create a copy of the row for editing
  };

  // Save changes to the edited row
  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/voluntary-work/${editItemId}`, editedRow);
      setSnackbarMessage('Item updated successfully!');
      setEditItemId(null); // Exit edit mode
      setEditedRow(null);
      fetchItems();
    } catch (error) {
      console.error('Error updating item:', error);
      setSnackbarMessage('Error updating item.');
    } finally {
      setSnackbarOpen(true);
    }
  };

  // Delete an item
  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/voluntary-work/${id}`);
      setSnackbarMessage('Item deleted successfully!');
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      setSnackbarMessage('Error deleting item.');
    } finally {
      setSnackbarOpen(true);
    }
  };

  // File upload handler
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  //Handle File Upload
  const handleFileUpload = async () => {
    if (!file) return alert('Please select a file first.');

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:5000/voluntary-work/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSnackbarMessage('File uploaded successfully!');
      setSnackbarOpen(true);
      fetchItems();
    } catch (error) {
      console.error('Error uploading file:', error);
      setSnackbarMessage('Error uploading file.');
      setSnackbarOpen(true);
    }
  };

  // Close Snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // -------------- Voluntary Works Table End ---------------


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
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <h1 style={{ textAlign: 'center', color: 'black' }}>Voluntary Works Table</h1>

        {/* Form for Adding Items */}
        <Grid container spacing={3} justifyContent="space-between">
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              label="Date From"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              variant="outlined"
              size="small"
              type="date"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              label="Date To"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              variant="outlined"
              size="small"
              type="date"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Number of Hours"
              value={numberOfHours}
              onChange={(e) => setNumberOfHours(e.target.value)}
              variant="outlined"
              size="small"
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Number of Works"
              value={numberOfWorks}
              onChange={(e) => setNumberOfWorks(e.target.value)}
              variant="outlined"
              size="small"
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              sx={{ height: '100%' }}
              onClick={handleSubmit}
            >
              Add
            </Button>
          </Grid>
        </Grid>

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

        {/* Table with Edit Functionality */}
        <Table sx={{ marginTop: 3 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name and Address</TableCell>
              <TableCell>Date From</TableCell>
              <TableCell>Date To</TableCell>
              <TableCell>Number of Hours</TableCell>
              <TableCell>Number of Works</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                {editItemId === item.id ? (
                  <>
                    <TableCell>
                      <TextField
                        fullWidth
                        variant="outlined"
                        value={editedRow.nameAndAddress}
                        onChange={(e) =>
                          setEditedRow({ ...editedRow, nameAndAddress: e.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        variant="outlined"
                        type="date"
                        value={editedRow.dateFrom.split('T')[0]}
                        onChange={(e) =>
                          setEditedRow({ ...editedRow, dateFrom: e.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        variant="outlined"
                        type="date"
                        value={editedRow.dateTo.split('T')[0]}
                        onChange={(e) =>
                          setEditedRow({ ...editedRow, dateTo: e.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        variant="outlined"
                        type="number"
                        value={editedRow.numberOfHours}
                        onChange={(e) =>
                          setEditedRow({ ...editedRow, numberOfHours: e.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        variant="outlined"
                        type="number"
                        value={editedRow.numberOfWorks}
                        onChange={(e) =>
                          setEditedRow({ ...editedRow, numberOfWorks: e.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Button onClick={handleSave} color="primary">Save</Button>
                      <Button onClick={() => setEditItemId(null)} color="secondary">Cancel</Button>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{item.nameAndAddress}</TableCell>
                    <TableCell>{item.dateFrom}</TableCell>
                    <TableCell>{item.dateTo}</TableCell>
                    <TableCell>{item.numberOfHours}</TableCell>
                    <TableCell>{item.numberOfWorks}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleEdit(item)} color="primary">Edit</Button>
                      <Button onClick={() => deleteItem(item.id)} color="error">Delete</Button>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default VoluntaryWorks;
