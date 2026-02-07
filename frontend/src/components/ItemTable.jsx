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
  Snackbar,
  CircularProgress,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';

axios.defaults.baseURL = 'http://localhost:5000'; // Centralize API URL

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const ItemTable = () => {


  // -------------- Page Access Upper-Start ---------------

 const [hasAccess, setHasAccess] = useState(null); // Updated to null to show loading state


 useEffect(() => {
     // Retrieve userId from localStorage (make sure this exists and is correct)
     const userId = localStorage.getItem('userId');
     const pageId = 14; // The page ID for the Profile
 
 
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

  // -------------- Department Items Table Start ---------------
  const [data, setData] = useState([]);
  const [item_name, setItemName] = useState('');
  const [item_code, setItemCode] = useState('');
  const [employee_id, setEmployeeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editRowData, setEditRowData] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/items');
      setData(response.data);
    } catch (error) {
      handleSnackbar('Failed to fetch items.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {
    if (!item_name.trim() || !item_code.trim() || !employee_id.trim()) {
      handleSnackbar('All fields are required.', 'error');
      return;
    }

    try {
      await axios.post('/items', { item_name, item_code, employee_id });
      fetchItems();
      setItemName('');
      setItemCode('');
      setEmployeeId('');
      handleSnackbar('Item added successfully.', 'success');
    } catch (error) {
      handleSnackbar('Failed to add item.', 'error');
    }
  };

  const updateItem = async () => {
    if (!editRowData.item_name || !editRowData.item_code || !editRowData.employee_id) {
      handleSnackbar('All fields are required.', 'error');
      return;
    }

    try {
      await axios.put(`/items/${editingRowId}`, editRowData);
      fetchItems();
      setEditingRowId(null);
      handleSnackbar('Item updated successfully.', 'success');
    } catch (error) {
      handleSnackbar('Failed to update item.', 'error');
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`/items/${id}`);
      fetchItems();
      handleSnackbar('Item deleted successfully.', 'success');
    } catch (error) {
      handleSnackbar('Failed to delete item.', 'error');
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      handleSnackbar('Please select a file before uploading.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/upload-items', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      handleSnackbar(response.data.message, 'success');
      setFile(null);
      fetchItems();
    } catch (error) {
      handleSnackbar('File upload failed.', 'error');
    }
  };

  const handleSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

   // -------------- Department Items Table Start ---------------

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
      <h1>Department Items</h1>

      {/* Add Item Form */}
      <div style={{ marginTop: 20 }}>
        <TextField
          label="Item Name"
          variant="outlined"
          value={item_name}
          onChange={(e) => setItemName(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <TextField
          label="Item Code"
          variant="outlined"
          value={item_code}
          onChange={(e) => setItemCode(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <TextField
          label="Employee ID"
          variant="outlined"
          value={employee_id}
          onChange={(e) => setEmployeeId(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <Button variant="outlined" color="primary" onClick={addItem} style={{ marginRight: '10px' }}>
          
          Add
        </Button>
      </div>
   {/* File Upload */}
   <div style={{ marginTop: 20 }}>
      <Button variant="outlined" component="label" color="primary">
        Choose File
        <input
          type="file"
          hidden
          onChange={(e) => setFile(e.target.files[0])}
        />
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleFileUpload}
        disabled={!file}
        style={{ marginLeft: 10 }}
      >
        Upload File
      </Button>
    </div>

      {/* Items Table */}
      {loading ? (
        <CircularProgress style={{ marginTop: 20 }} />
      ) : (
        <Table style={{ marginTop: 20 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Item Name</TableCell>
              <TableCell>Item Code</TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>
                  {editingRowId === item.id ? (
                    <TextField
                      value={editRowData.item_name}
                      onChange={(e) =>
                        setEditRowData({ ...editRowData, item_name: e.target.value })
                      }
                    />
                  ) : (
                    item.item_name
                  )}
                </TableCell>
                <TableCell>
                  {editingRowId === item.id ? (
                    <TextField
                      value={editRowData.item_code}
                      onChange={(e) =>
                        setEditRowData({ ...editRowData, item_code: e.target.value })
                      }
                    />
                  ) : (
                    item.item_code
                  )}
                </TableCell>
                <TableCell>
                  {editingRowId === item.id ? (
                    <TextField
                      value={editRowData.employee_id}
                      onChange={(e) =>
                        setEditRowData({ ...editRowData, employee_id: e.target.value })
                      }
                    />
                  ) : (
                    item.employee_id
                  )}
                </TableCell>
                <TableCell>
  {editingRowId === item.id ? (
    <>
      <Button onClick={updateItem} color="primary" variant="outlined">
        Save
      </Button>
      <Button
        onClick={() => setEditingRowId(null)}
        color="secondary"
        variant="outlined"
      >
        Cancel
      </Button>
    </>
  ) : (
    <>
      <Button
        onClick={() => {
          setEditingRowId(item.id);
          setEditRowData(item);
        }}
        color="primary"
        variant="outlined"
      >
        Edit
      </Button>
      <Button
        onClick={() => deleteItem(item.id)}
        color="secondary"
        variant="outlined"
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
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ItemTable;
