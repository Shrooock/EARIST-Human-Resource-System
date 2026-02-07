import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, Container, Select, MenuItem, InputLabel, FormControl, Paper, Typography, Grid, Box, FormHelperText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ActiveAcademicYear = () => {
  const [data, setData] = useState([]); // To hold active academic years data
  const [newAcademicYearId, setNewAcademicYearId] = useState(''); // To hold new academic year ID
  const [newTermId, setNewTermId] = useState(''); // To hold new term ID
  const [newStatus, setNewStatus] = useState(''); // To hold new status
  const [editItem, setEditItem] = useState(null); // To hold item being edited
  const [academicYears, setAcademicYears] = useState([]); // To hold academic years
  const [terms, setTerms] = useState([]); // To hold terms
  const navigate = useNavigate(); // Hook for navigating to different routes

  // Fetch all active academic years, academic years, and terms on component mount
  useEffect(() => {
    fetchActiveAcademicYears();
    fetchAcademicYears();
    fetchTerms();
  }, []);

  const fetchActiveAcademicYears = async () => {
    try {
      const response = await axios.get('http://localhost:5000/active-academic-year');
      console.log('API Response:', response.data);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching active academic years:', error);
    }
  };

  const fetchAcademicYears = async () => {
    try {
      const response = await axios.get('http://localhost:5000/academic-year');
      setAcademicYears(response.data);
    } catch (error) {
      console.error('Error fetching academic years:', error);
    }
  };

  const fetchTerms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/term-table');
      setTerms(response.data);
    } catch (error) {
      console.error('Error fetching terms:', error);
    }
  };

  // Add new active academic year
  const addActiveAcademicYear = async () => {
    if (!newAcademicYearId || !newTermId || newStatus.trim() === '') return;
    await axios.post('http://localhost:5000/active-academic-year', {
      academic_year_id: newAcademicYearId,
      term_id: newTermId,
      status: newStatus,
    });
    setNewAcademicYearId('');
    setNewTermId('');
    setNewStatus('');
    fetchActiveAcademicYears();
  };

  // Update active academic year
  const updateActiveAcademicYear = async () => {
    if (!editItem || !editItem.academic_year_id || !editItem.term_id || editItem.status.trim() === '') return;
    await axios.put(`http://localhost:5000/active-academic-year/${editItem.id}`, {
      academic_year_id: editItem.academic_year_id,
      term_id: editItem.term_id,
      status: editItem.status,
    });
    setEditItem(null);
    fetchActiveAcademicYears();
  };

  // Delete active academic year
  const deleteActiveAcademicYear = async (id) => {
    await axios.delete(`http://localhost:5000/active-academic-year/${id}`);
    fetchActiveAcademicYears();
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 3, mt: 3, fontWeight: 'bold' }}>Active Academic Year</Typography>

      {/* Add New Active Academic Year */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Set Active Academic Year</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Academic Year</InputLabel>
              <Select
                value={newAcademicYearId}
                label="Academic Year"
                onChange={(e) => setNewAcademicYearId(e.target.value)}
              >
                {academicYears.map(ay => (
                  <MenuItem key={ay.id} value={ay.id}>{ay.description}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Term</InputLabel>
              <Select
                value={newTermId}
                label="Term"
                onChange={(e) => setNewTermId(e.target.value)}
              >
                {terms.map(term => (
                  <MenuItem key={term.id} value={term.id}>{term.term_name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={newStatus}
                label="Status"
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button onClick={addActiveAcademicYear} variant="contained" color="primary" fullWidth size="large">
              Add
            </Button>
          </Grid>
        </Grid>
      </Paper>


      {/* Active Academic Years Table */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Academic Year</b></TableCell>
              <TableCell><b>Term</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(activeYear => (
              <TableRow key={activeYear.id}>
                <TableCell>{activeYear.id}</TableCell>
                <TableCell>
                  {editItem && editItem.id === activeYear.id ? (
                    <FormControl fullWidth size="small">
                      <Select
                        value={editItem.academic_year_id}
                        onChange={(e) => setEditItem({ ...editItem, academic_year_id: e.target.value })}
                      >
                        {academicYears.map(ay => (
                          <MenuItem key={ay.id} value={ay.id}>{ay.description}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    // Display description if available, otherwise ID
                    activeYear.academic_year_description || activeYear.academic_year_id
                  )}
                </TableCell>
                <TableCell>
                  {editItem && editItem.id === activeYear.id ? (
                    <FormControl fullWidth size="small">
                      <Select
                        value={editItem.term_id}
                        onChange={(e) => setEditItem({ ...editItem, term_id: e.target.value })}
                      >
                        {terms.map(term => (
                          <MenuItem key={term.id} value={term.id}>{term.term_name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    // Display description if available, otherwise ID
                    activeYear.term_description || activeYear.term_id
                  )}
                </TableCell>
                <TableCell>
                  {editItem && editItem.id === activeYear.id ? (
                    <FormControl fullWidth size="small">
                      <Select
                        value={editItem.status}
                        onChange={(e) => setEditItem({ ...editItem, status: e.target.value })}
                      >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                      </Select>
                    </FormControl>
                  ) : (
                    activeYear.status
                  )}
                </TableCell>
                <TableCell>
                  {editItem && editItem.id === activeYear.id ? (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button onClick={updateActiveAcademicYear} variant="contained" color="success" size="small">Save</Button>
                      <Button onClick={() => setEditItem(null)} variant="outlined" color="secondary" size="small">Cancel</Button>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button onClick={() => setEditItem(activeYear)} variant="outlined" color="primary" size="small">Edit</Button>
                      <Button onClick={() => deleteActiveAcademicYear(activeYear.id)} variant="outlined" color="error" size="small">Delete</Button>
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

export default ActiveAcademicYear;