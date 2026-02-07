import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Button,TextField,Table,TableBody,TableCell,TableHead,TableRow,Container,Grid,Paper,Typography,Box,
  AppBar,
  Toolbar,
  Snackbar,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Children = () => {

// -------------- Page Access Upper-Start ---------------
const [hasAccess, setHasAccess] = useState(null); // Updated to null to show loading state


    useEffect(() => {
        // Retrieve userId from localStorage (make sure this exists and is correct)
        const userId = localStorage.getItem('userId');
        const pageId = 7; // The page ID for the Profile


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


// -------------- Children Table Start ---------------

  const [children, setChildren] = useState([]);
  const [newChild, setNewChild] = useState({
    childrenFirstName: '',
    childrenMiddleName: '',
    childrenLastName: '',
    childrenNameExtension: '',
    dateOfBirth: '',
    person_id: ''
  });
  const [editingChildId, setEditingChildId] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const response = await axios.get('http://localhost:5000/children');
      setChildren(response.data);
    } catch (error) {
      console.error('Error fetching children:', error);
      showSnackbar('Failed to fetch children. Please try again.', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const formatDate = (date) => {
    if (!date) return '';
    const formattedDate = new Date(date).toISOString().split('T')[0];
    return formattedDate;
  };

  const addOrUpdateChild = async () => {
    if (!newChild.childrenFirstName || !newChild.childrenLastName || !newChild.dateOfBirth || !newChild.person_id) {
      showSnackbar('Please fill in all required fields.', 'error');
      return;
    }

    if (isNaN(newChild.person_id)) {
      showSnackbar('Person ID must be a valid number.', 'error');
      return;
    }

    try {
      if (editingChildId) {
        await axios.put(`http://localhost:5000/children/${editingChildId}`, newChild);
        showSnackbar('Child updated successfully!');
      } else {
        await axios.post('http://localhost:5000/children', newChild);
        showSnackbar('Child added successfully!');
      }
      fetchChildren();
      resetNewChild();
      setEditingChildId(null);
    } catch (error) {
      console.error('Error adding or updating child:', error);
      showSnackbar('Failed to add or update child. Please try again.', 'error');
    }
  };

  const deleteChild = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/children/${id}`);
      showSnackbar('Child deleted successfully!');
      fetchChildren();
    } catch (error) {
      console.error('Error deleting child:', error);
      showSnackbar('Failed to delete child. Please try again.', 'error');
    }
  };

  const resetNewChild = () => {
    setNewChild({
      childrenFirstName: '',
      childrenMiddleName: '',
      childrenLastName: '',
      childrenNameExtension: '',
      dateOfBirth: '',
      person_id: ''
    });
  };

  const editChildInList = (child) => {
    const updatedChildren = children.map((item) =>
      item.id === child.id ? { ...item, isEditing: !item.isEditing } : item
    );
    setChildren(updatedChildren);
  };

  const saveEditedChild = async (child) => {
    try {
      await axios.put(`http://localhost:5000/children/${child.id}`, child);
      showSnackbar('Child updated successfully!');
      fetchChildren();
    } catch (error) {
      console.error('Error updating child:', error);
      showSnackbar('Failed to update child. Please try again.', 'error');
    }
  };

  const handleChildChange = (e, id) => {
    const { name, value } = e.target;
    const updatedChildren = children.map((child) =>
      child.id === id ? { ...child, [name]: value } : child
    );
    setChildren(updatedChildren);
  };

// -------------- Children Table End ---------------


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
    <Container maxWidth="md" sx={{ marginTop: 3 }}>
       <Typography variant="h4" gutterBottom align="center" style={{ fontWeight: 'bold', marginTop: '0px' }}>
       Children</Typography>
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 4 }}>
          <Toolbar>
          </Toolbar>
        <Box sx={{ marginTop: -10 }}>
          <Typography variant="h6" gutterBottom sx={{ textAlign: 'left', mb: 1 }}>
            {editingChildId ? 'Update Child' : 'Add New Child'}
          </Typography>
          <Grid container spacing={3}>

            
            {/* Top section: First Name, Middle Name, Last Name */}
            <Grid container item spacing={3}>
              <Grid item xs={4}>
                <TextField
                  label="First Name"
                  fullWidth
                  value={newChild.childrenFirstName}
                  onChange={(e) => setNewChild({ ...newChild, childrenFirstName: e.target.value })}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Middle Name"
                  fullWidth
                  value={newChild.childrenMiddleName}
                  onChange={(e) => setNewChild({ ...newChild, childrenMiddleName: e.target.value })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Last Name"
                  fullWidth
                  value={newChild.childrenLastName}
                  onChange={(e) => setNewChild({ ...newChild, childrenLastName: e.target.value })}
                  variant="outlined"
                  required
                />
              </Grid>
            </Grid>
            {/* Bottom section: Name Extension, Date of Birth, Person ID */}
            <Grid container item spacing={3}>
              <Grid item xs={4}>
                <TextField
                  label="Name Extension"
                  fullWidth
                  value={newChild.childrenNameExtension}
                  onChange={(e) => setNewChild({ ...newChild, childrenNameExtension: e.target.value })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Date of Birth"
                  type="date"
                  fullWidth
                  value={newChild.dateOfBirth}
                  onChange={(e) => setNewChild({ ...newChild, dateOfBirth: e.target.value })}
                  variant="outlined"
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Person ID"
                  fullWidth
                  value={newChild.person_id}
                  onChange={(e) => setNewChild({ ...newChild, person_id: e.target.value })}
                  variant="outlined"
                  required
                />
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={addOrUpdateChild}
                startIcon={<AddIcon />}
                sx={{
                  fontWeight: 'bold',
                  '&:hover': { backgroundColor: '#1565c0' }
                }}
              >
                {editingChildId ? 'Update Child' : 'Add Child'}
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ marginTop: 3 }}>
          <Typography variant="h6" gutterBottom>Children List</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Person ID</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Middle Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Name Extension</TableCell>
                <TableCell>Date of Birth</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {children.map((child) => (
                <TableRow
                  key={child.id}
                  sx={{
                    '&:hover': { backgroundColor: '#f1f1f1' },
                    backgroundColor: child.isEditing ? '#e3f2fd' : 'transparent'
                  }}
                >
                  <TableCell>{child.id}</TableCell>
                  <TableCell>
                    {child.isEditing ? (
                      <TextField
                        name="person_id"
                        value={child.person_id}
                        onChange={(e) => handleChildChange(e, child.id)}
                        variant="outlined"
                        fullWidth
                      />
                    ) : (
                      child.person_id
                    )}
                  </TableCell>
                  <TableCell>
                    {child.isEditing ? (
                      <TextField
                        name="childrenFirstName"
                        value={child.childrenFirstName}
                        onChange={(e) => handleChildChange(e, child.id)}
                        variant="outlined"
                        fullWidth
                      />
                    ) : (
                      child.childrenFirstName
                    )}
                  </TableCell>
                  <TableCell>
                    {child.isEditing ? (
                      <TextField
                        name="childrenMiddleName"
                        value={child.childrenMiddleName}
                        onChange={(e) => handleChildChange(e, child.id)}
                        variant="outlined"
                        fullWidth
                      />
                    ) : (
                      child.childrenMiddleName
                    )}
                  </TableCell>
                  <TableCell>
                    {child.isEditing ? (
                      <TextField
                        name="childrenLastName"
                        value={child.childrenLastName}
                        onChange={(e) => handleChildChange(e, child.id)}
                        variant="outlined"
                        fullWidth
                      />
                    ) : (
                      child.childrenLastName
                    )}
                  </TableCell>
                  <TableCell>
                    {child.isEditing ? (
                      <TextField
                        name="childrenNameExtension"
                        value={child.childrenNameExtension}
                        onChange={(e) => handleChildChange(e, child.id)}
                        variant="outlined"
                        fullWidth
                      />
                    ) : (
                      child.childrenNameExtension
                    )}
                  </TableCell>
                  <TableCell>
                    {child.isEditing ? (
                      <TextField
                        name="dateOfBirth"
                        value={child.dateOfBirth}
                        onChange={(e) => handleChildChange(e, child.id)}
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    ) : (
                      formatDate(child.dateOfBirth)
                    )}
                  </TableCell>
                  <TableCell>
                    {child.isEditing ? (
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => saveEditedChild(child)}
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => editChildInList(child)}
                        startIcon={<EditIcon />}
                      >
                        Edit
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => deleteChild(child.id)}
                      startIcon={<DeleteIcon />}
                      sx={{
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
      </Snackbar>
    </Container>
  );
};

export default Children;
