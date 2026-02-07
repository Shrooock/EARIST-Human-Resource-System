import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Box, Table, TableBody, TableCell, TableHead, TableRow, TextField, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';  // Assuming you are using react-router for navigation

const LearningAndDevelopmment = () => {
  const [data, setData] = useState([]);   // To hold items data
  const [newItem, setNewItem] = useState('');  // To hold input for new item

  const [newItem2, setNewItem2] = useState('');  // To hold input for new last name
  const [newItem3, setNewItem3] = useState('');
  const [newItem4, setNewItem4] = useState('');
  const [newItem5, setNewItem5] = useState('');
  const [newItem6, setNewItem6] = useState('');
  const [editItem, setEditItem] = useState(null);  // To hold item being edited
  const navigate = useNavigate();  // Hook for navigating to different routes


  // Fetch all items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  const fetchItems = async () => {
    const response = await axios.get('http://localhost:5000/learning_and_development_table');
    setData(response.data);
  };

  // Add new item
  const addItem = async () => {
    if (newItem.trim() === '' || newItem2.trim() === '' || newItem3.trim() === '' || newItem4.trim() === '' || newItem5.trim() === '' || newItem6.trim() === '') return;
    await axios.post('http://localhost:5000/learning_and_development_table', {
      titleOfProgram: newItem,
      dateFrom: newItem2,
      dateTo: newItem3,
      numberOfHours: newItem4,
      typeOfLearningDevelopment: newItem5,
      conductedSponsored: newItem6,
    });
    setNewItem('');
    setNewItem2('');
    setNewItem3('');
    setNewItem4('');
    setNewItem5('');
    setNewItem6('');
    fetchItems();
  };

  // Update item
  const updateItem = async () => {
    if (!editItem || editItem.titleOfProgram.trim() === '' || editItem.dateFrom.trim() === '' || editItem.dateTo.trim() === '' || editItem.numberOfHours === '' || editItem.typeOfLearningDevelopment.trim() === '' || editItem.conductedSponsored === '') return;
    await axios.put(`http://localhost:5000/learning_and_development_table/${editItem.id}`, {
      titleOfProgram: editItem.titleOfProgram,
      dateFrom: editItem.dateFrom,
      dateTo: editItem.dateTo,
      numberOfHours: editItem.numberOfHours,
      typeOfLearningDevelopment: editItem.typeOfLearningDevelopment,
      conductedSponsored: editItem.conductedSponsored,
    });
    setEditItem(null);
    fetchItems();
  };

  const deleteItem = async (id) => {
    await axios.delete(`http://localhost:5000/learning_and_development_table/${id}`);
    fetchItems();
  };

  return (
    <Container>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h1 style={{ width: '90%' }}>Learning and Development</h1>
      </div>
      {/* Add New Item */}
      <Box display="flex" alignItems="center" sx={{ marginBottom: 3 }}>
        <TextField label="Title of Program" value={newItem} onChange={(e) => setNewItem(e.target.value)} sx={{ marginRight: 2 }} />
        <TextField
          label="Date From"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={newItem2}
          onChange={(e) => setNewItem2(e.target.value)}
          sx={{ marginRight: 2 }}
        />
        <TextField
          label="Date To"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={newItem3}
          onChange={(e) => setNewItem3(e.target.value)}
          sx={{ marginRight: 2 }}
        />
        <TextField label="Number of Hours" value={newItem4} onChange={(e) => setNewItem4(e.target.value)} sx={{ marginRight: 2 }} />
        <TextField label="Type Of Learning Development" value={newItem5} onChange={(e) => setNewItem5(e.target.value)} sx={{ marginRight: 2 }} />
        <TextField label="Conducted Sponsored" value={newItem6} onChange={(e) => setNewItem6(e.target.value)} sx={{ marginRight: 2 }} />
        <Button onClick={addItem} variant="contained" color="primary" sx={{ marginRight: 1 }}>Add</Button>
      </Box>


      {/* Items Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell sx={{ textAlign: 'center' }}>Title of Program</TableCell>
            <TableCell sx={{ textAlign: 'center' }}>Date From</TableCell>
            <TableCell sx={{ textAlign: 'center' }}>Date To</TableCell>
            <TableCell sx={{ textAlign: 'center' }}>Number of Hours</TableCell>
            <TableCell sx={{ textAlign: 'center' }} >Type Of Learning Development</TableCell>
            <TableCell sx={{ textAlign: 'center' }}>Conducted Sponsored</TableCell>
            <TableCell sx={{ textAlign: 'center' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(item => (
            <TableRow key={item.id}>
              <TableCell>
                {item.id}
              </TableCell>

              <TableCell sx={{ textAlign: 'center' }}>
                {/* Editable field */}
                {editItem && editItem.id === item.id ? (
                  <TextField
                    value={editItem.titleOfProgram}
                    onChange={(e) => setEditItem({ ...editItem, titleOfProgram: e.target.value })}
                  />
                ) : (
                  item.titleOfProgram
                )}
              </TableCell>

              <TableCell sx={{ textAlign: 'center' }}>
                {/* Editable field */}
                {editItem && editItem.id === item.id ? (
                  <TextField
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={editItem.dateFrom}
                    onChange={(e) => setEditItem({ ...editItem, dateFrom: e.target.value })}
                  />
                ) : (
                  formatDate(item.dateFrom)
                )}
              </TableCell>

              <TableCell sx={{ textAlign: 'center' }}>
                {/* Editable field */}
                {editItem && editItem.id === item.id ? (
                  <TextField
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={editItem.dateTo}
                    onChange={(e) => setEditItem({ ...editItem, dateTo: e.target.value })}
                  />
                ) : (
                  formatDate(item.dateTo)
                )}
              </TableCell>

              <TableCell sx={{ textAlign: 'center', width: 4 }}>
                {/* Editable field */}
                {editItem && editItem.id === item.id ? (
                  <TextField
                    value={editItem.numberOfHours}
                    onChange={(e) => setEditItem({ ...editItem, numberOfHours: e.target.value })}
                  />
                ) : (
                  item.numberOfHours
                )}
              </TableCell>

              <TableCell sx={{ textAlign: 'center', width: 4 }}>
                {/* Editable field */}
                {editItem && editItem.id === item.id ? (
                  <TextField
                    value={editItem.typeOfLearningDevelopment}
                    onChange={(e) => setEditItem({ ...editItem, typeOfLearningDevelopment: e.target.value })}
                  />
                ) : (
                  item.typeOfLearningDevelopment
                )}
              </TableCell>

              <TableCell sx={{ textAlign: 'center', width: '200px' }}>
                {/* Editable field */}
                {editItem && editItem.id === item.id ? (
                  <TextField
                    value={editItem.conductedSponsored}
                    onChange={(e) => setEditItem({ ...editItem, conductedSponsored: e.target.value })}
                  />
                ) : (
                  item.conductedSponsored
                )}
              </TableCell>

              <TableCell sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Show Save/Cancel if editing */}
                {editItem && editItem.id === item.id ? (
                  <>
                    <Button onClick={updateItem} variant="contained" color="primary" sx={{ marginRight: 2, marginBottom: 1 }}>Save</Button>
                    <Button onClick={() => setEditItem(null)} variant="outlined" color="secondary" sx={{ marginRight: 2 }}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => setEditItem(item)} variant="outlined" color="primary" sx={{ marginRight: 2 }}>Edit</Button>
                    <Button onClick={() => deleteItem(item.id)} variant="outlined" color="secondary">Delete</Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default LearningAndDevelopmment;