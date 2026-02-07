import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  Input,
  Box,
  Grid,
  Paper,
  Typography,
  Divider,
  Card,
  CardMedia,
  Snackbar,
  Alert,
} from '@mui/material';

axios.defaults.baseURL = 'http://localhost:5000';

function SettingsForm({ onUpdate }) {

// -------------- Page Access Upper-Start ---------------

const [hasAccess, setHasAccess] = useState(null); // Updated to null to show loading state


    useEffect(() => {
        // Retrieve userId from localStorage (make sure this exists and is correct)
        const userId = localStorage.getItem('userId');
        const pageId = 17; // The page ID for the Profile


        // If userId is missing, deny access early
        if (!userId) {
            setHasAccess(false);
            return;
        }


        // Function to check if the user has access
        const checkAccess = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/page_access/${userId}/${pageId}`);
                
                // Check if the API response contains the 'hasAccess' field
                if (response.data && typeof response.data.hasAccess === 'boolean') {
                    setHasAccess(response.data.hasAccess);
                } else {
                    console.error('Unexpected API response format:', response.data);
                    setHasAccess(false);
                }
            } catch (error) {
                console.error('Error checking access:', error);
                setHasAccess(false); // No access if there's an error
            }
        };


        checkAccess();
    }, []);
// -------------- Page Access Upper-End ---------------



// -------------- Settings Start ---------------

  const [companyName, setCompanyName] = useState('');
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [headerColor, setHeaderColor] = useState('#ffffff');
  const [footerText, setFooterText] = useState('');
  const [footerColor, setFooterColor] = useState('#ffffff');

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    axios
      .get('/api/settings')
      .then((response) => {
        const { company_name, logo_url, header_color, footer_text, footer_color } = response.data;
        setCompanyName(company_name || '');
        setHeaderColor(header_color || '#ffffff');
        setFooterText(footer_text || '');
        setFooterColor(footer_color || '#ffffff');
        setLogoPreview(logo_url ? `${axios.defaults.baseURL}${logo_url}` : null);
      })
      .catch((error) => {
        console.error('Error fetching settings:', error);
        showSnackbar('Error fetching settings', 'error');
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('company_name', companyName || '');
    formData.append('logo', logo);
    formData.append('header_color', headerColor || '#ffffff');
    formData.append('footer_text', footerText || '');
    formData.append('footer_color', footerColor || '#ffffff');

    try {
      await axios.post('/api/settings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onUpdate();
      showSnackbar('Settings updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating settings:', error);
      showSnackbar('Failed to update settings', 'error');
    }
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    setLogo(file);
    setLogoPreview(file ? URL.createObjectURL(file) : null);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // -------------- Settings End ---------------

// -------------- Page Access Lower-Start ---------------
  
// If hasAccess is still null, show a loading state
if (hasAccess === null) {
  return <div>Loading access information...</div>;
}


// Deny access if hasAccess is false
if (!hasAccess) {
  return <div>You do not have access to this page. Contact the administrator to request access.</div>;
}

// -------------- Page Access Lower-End ---------------

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        backgroundColor: '#f5f5f5',
        p: 3,
      }}
    >
      <Paper
        sx={{
          width: '100%',
          maxWidth: '700px',
          padding: 4,
          borderRadius: 3,
          boxShadow: 6,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom style={{ fontWeight: 'bold', marginTop: '20px' }}>
          Update Settings
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Company Name */}
            <Grid item xs={12}>
              <TextField
                label="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Grid>

            {/* Logo Upload */}
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>
                Upload Logo
              </Typography>
              <Input type="file" onChange={handleLogoChange} fullWidth />
              {logoPreview && (
                <Card
                  sx={{
                    mt: 2,
                    maxWidth: 150,
                    borderRadius: 2,
                    boxShadow: 2,
                    mx: 'auto',
                  }}
                >
                  <CardMedia
                    component="img"
                    image={logoPreview}
                    alt="Logo Preview"
                    sx={{ height: 100, objectFit: 'contain' }}
                  />
                </Card>
              )}
            </Grid>

            {/* Header Color */}
            <Grid item xs={6}>
              <Typography variant="body1" gutterBottom>
                Header Color
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <input
                  type="color"
                  value={headerColor}
                  onChange={(e) => setHeaderColor(e.target.value)}
                  style={{ cursor: 'pointer', height: '40px', width: '50px', border: 'none' }}
                />
                <Typography
                  sx={{
                    width: '100%',
                    height: '40px',
                    backgroundColor: headerColor,
                    borderRadius: 2,
                    boxShadow: 1,
                  }}
                />
              </Box>
            </Grid>

            {/* Footer Color */}
            <Grid item xs={6}>
              <Typography variant="body1" gutterBottom>
                Footer Color
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <input
                  type="color"
                  value={footerColor}
                  onChange={(e) => setFooterColor(e.target.value)}
                  style={{ cursor: 'pointer', height: '40px', width: '50px', border: 'none' }}
                />
                <Typography
                  sx={{
                    width: '100%',
                    height: '40px',
                    backgroundColor: footerColor,
                    borderRadius: 2,
                    boxShadow: 1,
                  }}
                />
              </Box>
            </Grid>

            {/* Footer Text */}
            <Grid item xs={12}>
              <TextField
                label="Footer Text"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" size="large" fullWidth>
                Save Settings
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default SettingsForm;
