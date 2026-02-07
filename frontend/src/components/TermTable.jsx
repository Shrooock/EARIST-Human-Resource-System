import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, Container, Paper, Typography, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TermTable = () => {
  const [data, setData] = useState([]); // To hold term data
  const [newTerm, setNewTerm] = useState(''); // To hold input for new term name
  const [editTerm, setEditTerm] = useState(null); // To hold term being edited
  const navigate = useNavigate(); // Hook for navigating to different routes

  // Fetch all terms on component mount
  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/term-table');
      console.log('API Response:', response.data);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching terms:', error);
    }
  };

  // Add new term
  const addTerm = async () => {
    if (newTerm.trim() === '') return;
    await axios.post('http://localhost:5000/term-table', { term_name: newTerm });
    setNewTerm('');
    fetchTerms();
  };

  // Update term
  const updateTerm = async () => {
    if (!editTerm || editTerm.term_name.trim() === '') return;
    await axios.put(`http://localhost:5000/term-table/${editTerm.id}`, { term_name: editTerm.term_name });
    setEditTerm(null);
    fetchTerms();
  };

  // Delete term
  const deleteTerm = async (id) => {
    await axios.delete(`http://localhost:5000/term-table/${id}`);
    fetchTerms();
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 3, mt: 3, fontWeight: 'bold' }}>Term Table</Typography>

      {/* Add New Term */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Add New Term</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <TextField
              label="Term Name (e.g., 1st Semester)"
              fullWidth
              value={newTerm}
              onChange={(e) => setNewTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button onClick={addTerm} variant="contained" color="primary" fullWidth size="large">
              Add
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Terms Table */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Term Name</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(term => (
              <TableRow key={term.id}>
                <TableCell>{term.id}</TableCell>
                <TableCell>
                  {editTerm && editTerm.id === term.id ? (
                    <TextField
                      value={editTerm.term_name}
                      onChange={(e) => setEditTerm({ ...editTerm, term_name: e.target.value })}
                      fullWidth
                      size="small"
                    />
                  ) : (
                    term.term_name
                  )}
                </TableCell>
                <TableCell>
                  {editTerm && editTerm.id === term.id ? (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button onClick={updateTerm} variant="contained" color="success" size="small">Save</Button>
                      <Button onClick={() => setEditTerm(null)} variant="outlined" color="secondary" size="small">Cancel</Button>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button onClick={() => setEditTerm(term)} variant="outlined" color="primary" size="small">Edit</Button>
                      <Button onClick={() => deleteTerm(term.id)} variant="outlined" color="error" size="small">Delete</Button>
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

export default TermTable;