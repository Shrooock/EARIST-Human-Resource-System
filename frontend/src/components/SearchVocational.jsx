import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchVocational = () => {
  const [vocationalId, setVocationalId] = useState('');
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');

  // Debounce state and timer
  const [debouncedId, setDebouncedId] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedId(vocationalId);
    }, 500); // Delay of 500ms

    return () => clearTimeout(timer);
  }, [vocationalId]);

  useEffect(() => {
    if (debouncedId.trim() === '') {
      setRecords([]); // Clear records if input is empty
      return;
    }

    const fetchRecords = async () => {
      try {
        // Fetch records based on school name
        const response = await axios.get(`http://localhost:5000/vocational-records/school/${debouncedId}`);
        setRecords(response.data);
        setError(''); // Clear any previous errors
      } catch (error) {
        console.error('Error fetching vocational records:', error);
        setError('No records found or an error occurred'); // Set error message
        setRecords([]); // Clear previous records
      }
    };

    fetchRecords();
  }, [debouncedId]);

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
      <h1 style={headerStyle}>Search Vocational Records</h1>
      <input
        type="text"
        placeholder="Enter Name of School"
        value={vocationalId}
        onChange={(e) => setVocationalId(e.target.value)}
        style={inputStyle}
      />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {records.length > 0 && (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Name of School</th>
              <th style={thStyle}>Degree</th>
              <th style={thStyle}>Period From</th>
              <th style={thStyle}>Period To</th>
              <th style={thStyle}>Highest Attained</th>
              <th style={thStyle}>Year Graduated</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={index}>
                <td style={tdStyle}>{record.vocationalNameOfSchool}</td>
                <td style={tdStyle}>{record.vocationalDegree}</td>
                <td style={tdStyle}>{record.vocationalPeriodFrom}</td>
                <td style={tdStyle}>{record.vocationalPeriodTo}</td>
                <td style={tdStyle}>{record.vocationalHighestAttained}</td>
                <td style={tdStyle}>{record.vocationalYearGraduated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SearchVocational;
