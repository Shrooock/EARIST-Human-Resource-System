import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, Container,
  Paper, AppBar, Toolbar, Typography, Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const OfficialTime = () => {
  const [data, setData] = useState([]);
  const [newEntry, setNewEntry] = useState({
    person_id: '',
    day: '',
    official_time_in: '',
    official_break_time_in: '',
    official_break_time_out: '',
    official_time_out: '',
    status: '',
  });
  const [editItem, setEditItem] = useState(null);
  const navigate = useNavigate();

  const fetchItems = async () => {
    const response = await axios.get('http://localhost:5000/official_time_table');
    setData(response.data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addItem = async () => {
    if (Object.values(newEntry).some(value => value.trim() === '')
    
    ) return;

    await axios.post('http://localhost:5000/official_time_table', newEntry);
    setNewEntry({
      person_id: '',
      day: '',
      official_time_in: '',
      official_break_time_in: '',
      official_break_time_out: '',
      official_time_out: '',
      status: '',
    });
    fetchItems();
  };

  const updateItem = async () => {
    if (!editItem) return;

    const processedEditItem = {
      ...editItem,
      person_id: String(editItem.person_id || '').trim(),
      day: String(editItem.day || '').trim(),
      official_time_in: String(editItem.official_time_in || '').trim(),
      official_break_time_in: String(editItem.official_break_time_in || '').trim(),
      official_break_time_out: String(editItem.official_break_time_out || '').trim(),
      official_time_out: String(editItem.official_time_out || '').trim(),
      status: String(editItem.status || '').trim(),
    };

    if (Object.values(processedEditItem).some(value => value === '')) return;

    await axios.put(`http://localhost:5000/official_time_table/${processedEditItem.id}`, processedEditItem);
    setEditItem(null);
    fetchItems();
  };

  const deleteItem = async (id) => {
    await axios.delete(`http://localhost:5000/official_time_table/${id}`);
    fetchItems();
  };

  const handleEditClick = (item) => {
    setEditItem(item);
  };

  const cancelEdit = () => {
    setEditItem(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Official Time
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h4" gutterBottom>
            Official Time
          </Typography>
          <Box sx={{ mb: 2 }}>
            {Object.keys(newEntry).map((key) => (
              <TextField
                key={key}
                label={key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} // Format label
                value={newEntry[key]}
                onChange={(e) => setNewEntry({ ...newEntry, [key]: e.target.value })}
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
            <Button
              onClick={addItem}
              variant="contained"
              style={{ backgroundColor: '#4CAF50', color: 'white' }}
              sx={{ mr: 1 }}
            >
              Add
            </Button>
            <Button onClick={handleLogout} variant="contained" color="secondary">
              Logout
            </Button>
          </Box>
          <Table>
            <TableHead>
              <TableRow>
                {['ID', 'Person ID', 'Day', 'Official Time In', 'Official Break Time In', 'Official Break Time Out', 'Official Time Out', 'Status', 'Actions'].map(header => (
                  <TableCell key={header}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  {Object.keys(item).map((key) => (
                    <TableCell key={key}>
                      {editItem?.id === item.id ? (
                        <TextField
                          value={editItem[key]}
                          onChange={(e) => setEditItem({ ...editItem, [key]: e.target.value })}
                        />
                      ) : (
                        item[key]
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    {editItem?.id === item.id ? (
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

export default OfficialTime;
