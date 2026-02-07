import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, CircularProgress } from '@mui/material';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!formData.email || !formData.password) {
            setError('Both fields are required.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/login', formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId); // Store userId
            console.log('User ID stored in localStorage:', response.data.userId);
            // Redirect to Home page
            window.location.href = '/';
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ textAlign: 'center', margin: '2rem 0' }}>
                <Typography variant="h4" gutterBottom>
                    Login
                </Typography>
            </Box>
            <Box
                component="form"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    padding: 2,
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    boxShadow: 2,
                }}
                noValidate
            >
                <TextField
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    fullWidth
                />
                <TextField
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    fullWidth
                />
                {error && (
                    <Typography variant="body2" color="error" sx={{ textAlign: 'center' }}>
                        {error}
                    </Typography>
                )}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleLogin}
                    disabled={loading || !formData.email || !formData.password}
                    fullWidth
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                </Button>

                <Box sx={{ marginTop: 2, textAlign: 'center' }}>
                    <Typography variant="body2">
                        Don't have an account?{' '}
                        <Button
                            onClick={() => navigate('/register')}
                            color="primary"
                            sx={{ padding: 0 }}
                        >
                            Register here
                        </Button>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
