import React, { useState } from 'react';
import axios from 'axios';

const UploadCollegeTable = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload-college-table', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('File upload failed');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Upload College Data</h1>
      <input type="file" onChange={handleFileChange} accept=".xls,.xlsx" />
      <button onClick={handleFileUpload}>Upload</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadCollegeTable;
