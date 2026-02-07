import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, Container,
  Paper, AppBar, Toolbar, Typography, Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Citizenship = () => {
  const [data, setData] = useState([]);
  const [newCitizenshipDescription, setNewCitizenshipDescription] = useState('');
  const [newCitizenshipType, setNewCitizenshipType] = useState('');
  const [newCountryName, setNewCountryName] = useState('');
  const [newPersonId, setNewPersonId] = useState('');
  const [editItem, setEditItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const fetchItems = async () => {
    const response = await axios.get('http://localhost:5000/citizenship_table');
    setData(response.data);
  };

  const addItem = async () => {
    if (
      newCitizenshipDescription.trim() === '' ||
      newCitizenshipType.trim() === '' ||
      newCountryName.trim() === '' ||
      newPersonId.trim() === ''
    ) return;

    await axios.post('http://localhost:5000/citizenship_table', {
      citizenship_description: newCitizenshipDescription,
      citizenshipType: newCitizenshipType,
      countryName: newCountryName,
      person_id: newPersonId
    });

    setNewCitizenshipDescription('');
    setNewCitizenshipType('');
    setNewCountryName('');
    setNewPersonId('');
    fetchItems();
  };

  const updateItem = async () => {
    if (!editItem) return;

    const processedEditItem = {
      ...editItem,
      citizenship_description: editItem.citizenship_description.trim(),
      citizenshipType: editItem.citizenshipType.trim(),
      countryName: editItem.countryName.trim(),
      person_id: editItem.person_id.toString().trim(),
    };

    if (
      processedEditItem.citizenship_description === '' ||
      processedEditItem.citizenshipType === '' ||
      processedEditItem.countryName === '' ||
      processedEditItem.person_id === ''
    ) return;

    await axios.put(`http://localhost:5000/citizenship_table/${processedEditItem.id}`, processedEditItem);
    setEditItem(null);
    fetchItems();
  };

  const deleteItem = async (id) => {
    await axios.delete(`http://localhost:5000/citizenship_table/${id}`);
    fetchItems();
  };

  const handleEditClick = (item) => {
    setEditItem(item);
  };

  const cancelEdit = () => {
    setEditItem(null);
  };

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Citizenship Table
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h4" gutterBottom>
            Citizenship Records
          </Typography>
          <Box sx={{ mb: 2 }}>
            <TextField label="Citizenship Description" value={newCitizenshipDescription} onChange={(e) => setNewCitizenshipDescription(e.target.value)} sx={{ mr: 1, mb: 1 }} />
            <TextField label="Citizenship Type" value={newCitizenshipType} onChange={(e) => setNewCitizenshipType(e.target.value)} sx={{ mr: 1, mb: 1 }} />
            <TextField label="Country Name" value={newCountryName} onChange={(e) => setNewCountryName(e.target.value)} sx={{ mr: 1, mb: 1 }} />
            <TextField label="Person ID" value={newPersonId} onChange={(e) => setNewPersonId(e.target.value)} sx={{ mr: 1, mb: 1 }} />
          </Box>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <Button onClick={addItem} variant="contained" style={{ backgroundColor: '#4CAF50', color: 'white' }} sx={{ mr: 1 }}>
              Add
            </Button>
            <Button onClick={handleLogout} variant="contained" color="secondary">
              Logout
            </Button>
          </Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Citizenship Description</TableCell>
                <TableCell>Citizenship Type</TableCell>
                <TableCell>Country Name</TableCell>
                <TableCell>Person ID</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{editItem?.id === item.id ? <TextField value={editItem.citizenship_description} onChange={(e) => setEditItem({ ...editItem, citizenship_description: e.target.value })} /> : item.citizenship_description}</TableCell>
                  <TableCell>{editItem?.id === item.id ? <TextField value={editItem.citizenshipType} onChange={(e) => setEditItem({ ...editItem, citizenshipType: e.target.value })} /> : item.citizenshipType}</TableCell>
                  <TableCell>{editItem?.id === item.id ? <TextField value={editItem.countryName} onChange={(e) => setEditItem({ ...editItem, countryName: e.target.value })} /> : item.countryName}</TableCell>
                  <TableCell>{editItem?.id === item.id ? <TextField value={editItem.person_id} onChange={(e) => setEditItem({ ...editItem, person_id: e.target.value })} /> : item.person_id}</TableCell>
                  <TableCell>
                    {editItem && editItem.id === item.id ? (
                      <>
                        <Button onClick={updateItem} variant="contained" style={{ backgroundColor: '#2196F3', color: 'white' }} sx={{ mr: 1 }}>
                          Save
                        </Button>
                        <Button onClick={cancelEdit} variant="contained" style={{ backgroundColor: '#800000', color: 'white' }} sx={{ mr: 1 }}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={() => handleEditClick(item)} variant="contained" style={{ backgroundColor: '#2196F3', color: 'white' }} sx={{ mr: 1 }}>
                          Edit
                        </Button>
                        <Button onClick={() => deleteItem(item.id)} variant="contained" style={{ backgroundColor: '#800000', color: 'white' }} sx={{ mr: 1 }}>
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
    </>
  );
};

export default Citizenship;
