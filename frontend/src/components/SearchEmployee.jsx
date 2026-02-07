import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchVoluntaryWorks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');

  // Debounced state and timer
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Delay of 500ms

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm.trim() === '') {
      setRecords([]); // Clear records if input is empty
      return;
    }

    const fetchRecords = async () => {
      try {
        // Fetch records based on name or address
        const response = await axios.get(`http://localhost:5000/voluntary-work/search?searchTerm=${debouncedSearchTerm}`);
        setRecords(response.data);
        setError(''); // Clear any previous errors
      } catch (error) {
        console.error('Error fetching voluntary works records:', error);
        setError('No records found or an error occurred');
        setRecords([]); // Clear previous records
      }
    };

    fetchRecords();
  }, [debouncedSearchTerm]);

  // Styles
  const containerStyle = {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'flex-start', // Align items to the top
    alignItems: 'center',         // Center items horizontally
    flexDirection: 'column',      // Stack elements vertically
  };

  const headerStyle = {
    textAlign: 'center',
    color: 'black',
    marginBottom: '20px',
  };

  const inputStyle = {
    width: '50%',             // Set input width to 50% of the container
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    outline: 'none',
    textAlign: 'center',     // Center the text inside the input field
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  };

  const thStyle = {
    backgroundColor: '#f2f2f2',
    padding: '10px',
    border: '1px solid #ddd',
  };

  const tdStyle = {
    padding: '10px',
    textAlign: 'center',
    border: '1px solid #ddd',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Search Voluntary Work Records</h1>
      <input
        type="text"
        placeholder="Enter Name or Address"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={inputStyle}
      />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {records.length > 0 && (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Name and Address</th>
              <th style={thStyle}>Date From</th>
              <th style={thStyle}>Date To</th>
              <th style={thStyle}>Number of Hours</th>
              <th style={thStyle}>Number of Works</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={index}>
                <td style={tdStyle}>{record.nameAndAddress}</td>
                <td style={tdStyle}>{record.dateFrom}</td>
                <td style={tdStyle}>{record.dateTo}</td>
                <td style={tdStyle}>{record.numberOfHours}</td>
                <td style={tdStyle}>{record.numberOfWorks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SearchVoluntaryWorks;
