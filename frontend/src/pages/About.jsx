import React from "react";
import { Box, Typography, Container, Grid, Paper } from "@mui/material";

const About = () => {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        About EARIST System
      </Typography>

      <Grid container spacing={4} sx={{ justifyContent: "center" }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              What is EARIST System?
            </Typography>
            <Typography variant="body1" paragraph>
              The EARIST System is an integrated platform designed to manage and
              streamline various academic and administrative processes at EARIST. 
              With this system, students, faculty, and staff can access essential 
              tools and information, such as eligibility verification, departmental 
              assignments, vocational data, and more.
            </Typography>
            <Typography variant="body1" paragraph>
              The system allows users to easily navigate through different sections, 
              update their personal records, and communicate with relevant departments 
              efficiently. The goal is to create a centralized environment that improves 
              accessibility and reduces administrative overhead.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Key Features:
            </Typography>
            <Typography variant="body1" paragraph>
              - Manage and track eligibility for students and staff
            </Typography>
            <Typography variant="body1" paragraph>
              - Access vocational and departmental data
            </Typography>
            <Typography variant="body1" paragraph>
              - Search employees and departments
            </Typography>
            <Typography variant="body1" paragraph>
              - Voluntary works and college assignments management
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="body1">
          For more information, feel free to explore the other sections of the system.
        </Typography>
      </Box>
    </Container>
  );
};

export default About;
