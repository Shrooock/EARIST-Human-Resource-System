import React from "react";
import { Box, Typography, Container, Grid, Paper, List, ListItem, ListItemText } from "@mui/material";

const Contact = () => {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Contact Our Team
      </Typography>

      <Grid container spacing={4} sx={{ justifyContent: "center" }}>
        {/* Team Member 1 */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Oner - Project Manager
            </Typography>
            <Typography variant="body1" paragraph>
              Oner is responsible for overseeing the entire project, ensuring deadlines are met, and maintaining clear communication within the team.
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Email: Oner@jangel.com" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Phone: +1 (123) 456-7890" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Team Member 2 */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Faker - Developer
            </Typography>
            <Typography variant="body1" paragraph>
              Faker is our lead developer, handling all the frontend and backend coding to bring the system to life.
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Email: Faker@gurang.com" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Phone: +1 (234) 567-8901" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Team Member 3 */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Gumayusi - UX/UI Designer
            </Typography>
            <Typography variant="body1" paragraph>
              Gumayusi is in charge of the design and user experience, ensuring the system is visually appealing and easy to navigate.
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Email: Gumayusi@gmail.com" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Phone: +1 (345) 678-9012" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Team Member 4 */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Zeus - Quality Assurance
            </Typography>
            <Typography variant="body1" paragraph>
              Zeus ensures that the application runs smoothly, performing thorough testing to identify and fix any bugs.
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Email: ZeusT1@ulala.com" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Phone: +1 (456) 789-0123" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Team Member 5 */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
             Keria - Backend Developer
            </Typography>
            <Typography variant="body1" paragraph>
              Keria is responsible for managing the server-side logic, databases, and API development for the application.
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Email: Keria@olala.com" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Phone: +1 (567) 890-1234" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Footer Information */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="body1">
          If you have any questions, feel free to contact any of our team members above.
        </Typography>
      </Box>
    </Container>
  );
};

export default Contact;
