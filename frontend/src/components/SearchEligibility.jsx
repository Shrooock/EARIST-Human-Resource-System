import React, { useState } from 'react';
import axios from 'axios';

const SearchEligibility = () => {
  const [eligibilityId, setEligibilityId] = useState('');
  const [records, setRecords] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/eligibility-records/${eligibilityId}`);
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching eligibility records:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Search Eligibility Records</h1>
      <input
        type="text"
        placeholder="Enter Eligibility ID"
        value={eligibilityId}
        onChange={(e) => setEligibilityId(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {records.length > 0 && (
        <table border="1" style={{ marginTop: '20px', width: '100%' }}>
          <thead>
            <tr>
              <th>Eligibility Name</th>
              <th>Rating</th>
              <th>Date of Exam</th>
              <th>Place of Exam</th>
              <th>License Number</th>
              <th>Date of Validity</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={index}>
                <td>{record.eligibilityName}</td>
                <td>{record.eligibilityRating}</td>
                <td>{record.eligibilityDateOfExam}</td>
                <td>{record.eligibilityPlaceOfExam}</td>
                <td>{record.licenseNumber}</td>
                <td>{record.DateOfValidity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SearchEligibility;
