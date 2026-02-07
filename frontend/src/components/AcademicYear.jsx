import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, Container, Paper, Typography, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AcademicYear = () => {
  const [data, setData] = useState([]);   // To hold items data
  const [newItem, setNewItem] = useState('');  // To hold input for new item
  const [editItem, setEditItem] = useState(null);  // To hold item being edited
  const navigate = useNavigate();  // Hook for navigating to different routes

  // Fetch all items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/academic-year');
      console.log('API Response:', response.data);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  // Add new item
  const addItem = async () => {
    if (newItem.trim() === '') return;
    await axios.post('http://localhost:5000/academic-year', { description: newItem });
    setNewItem('');
    fetchItems();
  };

  // Update item
  const updateItem = async () => {
    if (!editItem || editItem.description.trim() === '') return;
    await axios.put(`http://localhost:5000/academic-year/${editItem.id}`, { description: editItem.description });
    setEditItem(null);
    fetchItems();
  };

  // Delete item
  const deleteItem = async (id) => {
    await axios.delete(`http://localhost:5000/academic-year/${id}`);
    fetchItems();
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 3, mt: 3, fontWeight: 'bold' }}>Academic Year</Typography>

      {/* Add New Item */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Add New Academic Year</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <TextField
              label="Description (e.g., 2023-2024)"
              fullWidth
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button onClick={addItem} variant="contained" color="primary" fullWidth size="large">
              Add
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Items Table */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Description</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(academic_year => (
              <TableRow key={academic_year.id}>
                <TableCell>{academic_year.id}</TableCell>
                <TableCell>
                  {editItem && editItem.id === academic_year.id ? (
                    <TextField
                      value={editItem.description}
                      onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                      fullWidth
                      size="small"
                    />
                  ) : (
                    academic_year.description
                  )}
                </TableCell>
                <TableCell>
                  {editItem && editItem.id === academic_year.id ? (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button onClick={updateItem} variant="contained" color="success" size="small">Save</Button>
                      <Button onClick={() => setEditItem(null)} variant="outlined" color="secondary" size="small">Cancel</Button>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button onClick={() => setEditItem(academic_year)} variant="outlined" color="primary" size="small">Edit</Button>
                      <Button onClick={() => deleteItem(academic_year.id)} variant="outlined" color="error" size="small">Delete</Button>
                    </Box>
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

export default AcademicYear;
