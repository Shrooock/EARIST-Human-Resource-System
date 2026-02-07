import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Grid, Paper } from '@mui/material';

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); // Redirect to login if no token
        }
    }, [navigate]);

    return (
        <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', marginTop: '2rem' }}>
                <Typography variant="h3" gutterBottom>
                    Welcome to EARIST!
                </Typography>
                <Typography variant="h5" paragraph>
                    The East Avenue Research Institute of Science and Technology (EARIST) is a place where innovation meets excellence. We are dedicated to advancing education and research in various fields of science and technology.
                </Typography>
                <Typography variant="body1" paragraph>
                    Here at EARIST, we provide a platform for aspiring students to excel in their studies and become the leaders of tomorrow in the tech industry.
                </Typography>
            </Box>

            <Grid container spacing={4} sx={{ marginTop: '2rem' }}>
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ padding: '1.5rem', textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                            Research & Innovation
                        </Typography>
                        <Typography variant="body1" paragraph>
                            EARIST is at the forefront of scientific and technological research. Our research initiatives span across fields such as artificial intelligence, robotics, and sustainable energy.
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ padding: '1.5rem', textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                            Student Success
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Our students are empowered with the skills and knowledge necessary to thrive in a rapidly changing world. With hands-on learning and industry partnerships, we equip them for success.
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ padding: '1.5rem', textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                            Campus Life
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Beyond academics, EARIST offers a vibrant campus life. From student organizations to recreational activities, students have opportunities to grow, collaborate, and make lifelong memories.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Box sx={{ marginTop: '4rem', textAlign: 'center' }}>
                <Typography variant="h5" paragraph>
                    Join us at EARIST, where your academic and professional journey begins!
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Stay tuned for upcoming events, announcements, and more as we continue to innovate and inspire the next generation of leaders.
                </Typography>
            </Box>
        </Container>
    );
};

export default Home;
