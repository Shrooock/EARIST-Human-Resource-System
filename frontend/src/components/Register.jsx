import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleRegister = async () => {
    setError('');
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/register', formData);
      navigate('/login');
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#1976d2' }}>
        Create an Account
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleRegister();
        }}
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: 3,
          backgroundColor: '#f5f5f5',
        }}
      >
        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          fullWidth
          required
          sx={{ backgroundColor: 'white' }}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          fullWidth
          required
          sx={{ backgroundColor: 'white' }}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          fullWidth
          required
          sx={{ backgroundColor: 'white' }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          fullWidth
          sx={{ mt: 2, padding: '12px', fontSize: '16px' }}
        >
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </Box>

      {/* Already have an account link */}
      <Box sx={{ marginTop: 2, textAlign: 'center' }}>
        <Typography variant="body2">
          Already have an account?{' '}
          <Button
            onClick={() => navigate('/login')} // Navigate to the login page
            color="primary"
            sx={{ padding: 0 }}
          >
            Log in here
          </Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;
