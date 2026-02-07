import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, List, ListItem, ListItemText, ListItemIcon, Drawer, IconButton, Button, Collapse } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DashboardIcon from "@mui/icons-material/Dashboard";
import ChildrenIcon from "@mui/icons-material/FamilyRestroom";
import EligibilityIcon from "@mui/icons-material/HowToReg";
import CollegeIcon from "@mui/icons-material/School";
import DepartmentIcon from "@mui/icons-material/Business";
import DepartmentAssignmentIcon from "@mui/icons-material/AssignmentInd";
import ItemTableIcon from "@mui/icons-material/TableChart";
import VoluntaryWorksIcon from "@mui/icons-material/VolunteerActivism";
import VocationalDataIcon from "@mui/icons-material/WorkOutline";
import AboutIcon from "@mui/icons-material/Info";
import ContactIcon from "@mui/icons-material/Call";
import SettingsIcon from "@mui/icons-material/Settings";
import PageCRUDIcon from "@mui/icons-material/Pages";
import UserPageAccessIcon from "@mui/icons-material/AdminPanelSettings";
import WorkExperienceIcon from "@mui/icons-material/Work";
import ReceiptIcon from '@mui/icons-material/Receipt';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SchoolIcon from '@mui/icons-material/School';

import axios from "axios";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./components/Login";
import Register from "./components/Register";
import College from "./components/College";
import SettingsForm from "./components/SettingsForm";
import Department from "./components/Department";
import DepartmentAssignment from "./components/DepartmentAssignment";
import ItemTable from "./components/ItemTable";
import VocationalData from "./components/VocationalData";
import VoluntaryWorks from "./components/VoluntaryWorks";
import Eligibility from "./components/Eligibility";
import Children from "./components/Children";
import PageCRUD from "./components/PageCRUD";
import UserPageAccess from "./components/UserPageAccess";
import WorkExperience from "./components/WorkExperience";
import LearningAndDevelopmment from "./components/LearningAndDevelopment";
import AcademicYear from "./components/AcademicYear";
import ActiveAcademicYear from "./components/ActiveAcademicYear";
import TermTable from "./components/TermTable";


const drawerWidth = 240;

function App() {
  const [settings, setSettings] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openDashboard, setOpenDashboard] = useState(false);  // State for Dashboard dropdown

  const [openFeatures, setOpenFeatures] = useState(false);  // State for Features dropdown

  const fetchSettings = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/settings");
      setSettings(response.data);
    } catch (error) {
      console.error("Error fetching settings:", error);
      setSettings({
        company_name: "EARIST",
        header_color: "#c22d2d",
        footer_text: "Default Footer Text",
        footer_color: "#c22d2d",
      });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  const ProtectedRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" />;
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleDashboardToggle = () => {
    setOpenDashboard((prev) => !prev);  // Toggle the Dashboard dropdown
  };



  const handleFeaturesToggle = () => {
    setOpenFeatures((prev) => !prev);  // Toggle the Features dropdown
  };

  return (
    <Router>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            bgcolor: settings.header_color || "#c22d2d",
          }}
        >
          <Toolbar>
            <IconButton edge="start" color="default" aria-label="menu" onClick={toggleSidebar} sx={{ marginRight: 2 }}>
              <MenuIcon />
            </IconButton>
            {settings.logo_url && (
              <img
                src={`http://localhost:5000${settings.logo_url}`}
                alt="Logo"
                style={{ height: "40px", marginRight: "10px" }}
              />
            )}
            <Typography variant="h6" noWrap>
              {settings.company_name || "EARIST"}
            </Typography>
          </Toolbar>
        </AppBar>

        <Drawer
          variant="persistent"
          open={isSidebarOpen}
          sx={{
            width: isSidebarOpen ? drawerWidth : 0,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              bgcolor: "#FFFFFF",
              transition: "width 0.3s",
            },
          }}
        >
          <Toolbar />
          <List>
            {isLoggedIn ? (
              <>
                {/* Home and non-table pages */}
                <ListItem button component={Link} to="/">
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItem>
                <ListItem button onClick={handleDashboardToggle}>
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                  <ListItemIcon>
                    <ExpandMoreIcon sx={{ transform: openDashboard ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} /> {/* Rotate the icon when the dropdown is open */}
                  </ListItemIcon>
                </ListItem>
                <Collapse in={openDashboard} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {/* Features Section (Children, Eligibility, College) */}
                    <ListItem button component={Link} to="/children" sx={{ pl: 4 }}>
                      <ListItemIcon>
                        <ChildrenIcon />
                      </ListItemIcon>
                      <ListItemText primary="Children" />
                    </ListItem>
                    <ListItem button component={Link} to="/eligibility" sx={{ pl: 4 }}>
                      <ListItemIcon>
                        <EligibilityIcon />
                      </ListItemIcon>
                      <ListItemText primary="Eligibility" />
                    </ListItem>
                    <ListItem button component={Link} to="/college" sx={{ pl: 4 }}>
                      <ListItemIcon>
                        <CollegeIcon />
                      </ListItemIcon>
                      <ListItemText primary="College" />
                    </ListItem>
                  </List>

                  {/* Dashboard Section */}
                  <ListItem button component={Link} to="/department" sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <DepartmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Department" />
                  </ListItem>
                  <ListItem button component={Link} to="/departmentassignment" sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <DepartmentAssignmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Department Assignment" />
                  </ListItem>
                  <ListItem button component={Link} to="/itemtable" sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <ItemTableIcon />
                    </ListItemIcon>
                    <ListItemText primary="Department Items" />
                  </ListItem>
                  <ListItem button component={Link} to="/voluntary-works" sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <VoluntaryWorksIcon />
                    </ListItemIcon>
                    <ListItemText primary="Voluntary Works" />
                  </ListItem>
                  <ListItem button component={Link} to="/vocational-data" sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <VocationalDataIcon />
                    </ListItemIcon>
                    <ListItemText primary="Vocational Data" />
                  </ListItem>
                  <ListItem button component={Link} to="/work-experience" sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <WorkExperienceIcon />
                    </ListItemIcon>
                    <ListItemText primary="Work Experience" />
                  </ListItem>

                  <ListItem button component={Link} to="/learning_and_development_table" sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <LightbulbIcon />
                    </ListItemIcon>
                    <ListItemText primary="Learning And Development" />
                  </ListItem>

                  <ListItem button component={Link} to="/academic-year" sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <SchoolIcon />
                    </ListItemIcon>
                    <ListItemText primary="Academic Year" />
                  </ListItem>

                  <ListItem button component={Link} to="/active-academic-year" sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <SchoolIcon />
                    </ListItemIcon>
                    <ListItemText primary="Active Academic Year" />
                  </ListItem>

                  <ListItem button component={Link} to="/term-table" sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <SchoolIcon />
                    </ListItemIcon>
                    <ListItemText primary="Term Table" />
                  </ListItem>
                </Collapse>



                {/* About and Contact */}
                <ListItem button component={Link} to="/contact">
                  <ListItemIcon>
                    <ContactIcon />
                  </ListItemIcon>
                  <ListItemText primary="Contact" />
                </ListItem>
                <ListItem button component={Link} to="/about">
                  <ListItemIcon>
                    <AboutIcon />
                  </ListItemIcon>
                  <ListItemText primary="About" />
                </ListItem>

                {/* Settings and Logout */}
                <ListItem button component={Link} to="/settings">
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItem>

                <ListItem button component={Link} to="/page-crud">
                  <ListItemIcon>
                    <PageCRUDIcon />
                  </ListItemIcon>
                  <ListItemText primary="Page CRUD" />
                </ListItem>

                <ListItem button component={Link} to="/page-access">
                  <ListItemIcon>
                    <UserPageAccessIcon />
                  </ListItemIcon>
                  <ListItemText primary="User Page Access" />
                </ListItem>
                <ListItem>
                  <Button variant="contained" color="primary" onClick={handleLogout} fullWidth>
                    Logout
                  </Button>
                </ListItem>
              </>
            ) : (
              <>
                <ListItem button component={Link} to="/login">
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Login" />
                </ListItem>
                <ListItem button component={Link} to="/register">
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Register" />
                </ListItem>
              </>
            )}
          </List>
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "background.default",
            p: 3,
            marginLeft: isSidebarOpen ? `${drawerWidth}px` : 0,
            transition: "margin-left 0.3s",
          }}
        >
          <Toolbar />
          <Routes>
            <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
            <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
            <Route path="/register" element={isLoggedIn ? <Navigate to="/" /> : <Register />} />
            <Route
              path="/eligibility"
              element={
                <ProtectedRoute>
                  <Eligibility />
                </ProtectedRoute>
              }
            />
            <Route
              path="/children"
              element={
                <ProtectedRoute>
                  <Children />
                </ProtectedRoute>
              }
            />
            <Route
              path="/college"
              element={
                <ProtectedRoute>
                  <College />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsForm onUpdate={fetchSettings} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/department"
              element={
                <ProtectedRoute>
                  <Department />
                </ProtectedRoute>
              }
            />
            <Route
              path="/departmentassignment"
              element={
                <ProtectedRoute>
                  <DepartmentAssignment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/itemtable"
              element={
                <ProtectedRoute>
                  <ItemTable />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vocational-data"
              element={
                <ProtectedRoute>
                  <VocationalData />
                </ProtectedRoute>
              }
            />
            <Route
              path="/voluntary-works"
              element={
                <ProtectedRoute>
                  <VoluntaryWorks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/work-experience"
              element={
                <ProtectedRoute>
                  <WorkExperience />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learning_and_development_table"
              element={
                <ProtectedRoute>
                  <LearningAndDevelopmment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/academic-year"
              element={
                <ProtectedRoute>
                  <AcademicYear />
                </ProtectedRoute>
              }
            />
            <Route
              path="/active-academic-year"
              element={
                <ProtectedRoute>
                  <ActiveAcademicYear />
                </ProtectedRoute>
              }
            />
            <Route
              path="/term-table"
              element={
                <ProtectedRoute>
                  <TermTable />
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/page-crud" element={<PageCRUD />} />
            <Route path="/page-access" element={<UserPageAccess />} />
          </Routes>
        </Box>

        <Box
          component="footer"
          sx={{
            width: "100%",
            position: "relative",
            bottom: 0,
            left: 0,
            bgcolor: settings.footer_color || "#c22d2d",
            color: "black",
            textAlign: "center",
            padding: "15px",
          }}
        >
          <Typography variant="body1">
            {settings.footer_text || "Default Footer Text"}
          </Typography>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
