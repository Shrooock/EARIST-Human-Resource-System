import React, { useState } from 'react';
import axios from 'axios';

const UploadXLS = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!file) {
      setMessage('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload-xls', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message); // Show server response message
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('File upload failed');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Upload Voluntary Works XLS File</h1>
      
      {/* File input */}
      <input
        type="file"
        onChange={handleFileChange}
        style={styles.fileInput}
        accept=".xls,.xlsx"
      />
      
      {/* Upload button */}
      <button onClick={handleFileUpload} style={styles.uploadButton}>
        Upload
      </button>
      
      {/* Message display */}
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

// Inline styles for better presentation
const styles = {
  container: {
    padding: '20px',
    maxWidth: '500px',
    margin: '0 auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    color: '#3f51b5',
  },
  fileInput: {
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  uploadButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#3f51b5',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  uploadButtonHover: {
    backgroundColor: '#303f9f',
  },
  message: {
    textAlign: 'center',
    fontSize: '16px',
    marginTop: '20px',
    color: '#555',
  },
};

export default UploadXLS;
