import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
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
import SearchVocationalIcon from "@mui/icons-material/Search";
import SearchEmployeeIcon from "@mui/icons-material/Search";
import AboutIcon from "@mui/icons-material/Info";
import ContactIcon from "@mui/icons-material/Call";
import SettingsIcon from "@mui/icons-material/Settings";
import PageCRUDIcon from "@mui/icons-material/Pages";
import UserPageAccessIcon from "@mui/icons-material/AdminPanelSettings";


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
import SearchVocational from "./components/SearchVocational";
import VocationalData from "./components/VocationalData";
import VoluntaryWorks from "./components/VoluntaryWorks";
import SearchEmployee from "./components/SearchEmployee";
import Eligibility from "./components/Eligibility";
import Children from "./components/Children";
import PageCRUD from "./components/PageCRUD";
import UserPageAccess from "./components/UserPageAccess";


const drawerWidth = 240;

// Helper component for Navigation Items
const NavListItem = ({ to, icon, label, indent = false }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  // Theme color based on previous usage
  const activeColor = "#c22d2d";
  const activeBg = "rgba(194, 45, 45, 0.08)";

  return (
    <ListItem
      button
      component={Link}
      to={to}
      selected={isActive}
      sx={{
        pl: indent ? 4 : 2,
        borderLeft: isActive ? `4px solid ${activeColor}` : '4px solid transparent',
        bgcolor: isActive ? activeBg : 'transparent',
        color: isActive ? activeColor : 'inherit',
        '&.Mui-selected': {
          bgcolor: activeBg,
          '&:hover': {
            bgcolor: "rgba(194, 45, 45, 0.12)",
          },
        },
        '&:hover': {
          bgcolor: "rgba(0, 0, 0, 0.04)",
        }
      }}
    >
      <ListItemIcon sx={{ color: isActive ? activeColor : 'inherit', minWidth: '40px' }}>
        {icon}
      </ListItemIcon>
      <ListItemText
        primary={label}
        primaryTypographyProps={{
          style: {
            fontWeight: isActive ? 'bold' : 'normal',
            color: isActive ? activeColor : 'inherit'
          }
        }}
      />
    </ListItem>
  );
};

// Extracted main content to use useLocation
const AppContent = () => {
  const [settings, setSettings] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openDashboard, setOpenDashboard] = useState(true);  // Default open for convenience
  const location = useLocation();

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
    setOpenDashboard((prev) => !prev);
  };

  return (
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
              {/* Home */}
              <NavListItem to="/" icon={<HomeIcon />} label="Home" />

              {/* Dashboard Group */}
              <ListItem button onClick={handleDashboardToggle}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
                <ListItemIcon>
                  <ExpandMoreIcon sx={{ transform: openDashboard ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
                </ListItemIcon>
              </ListItem>
              <Collapse in={openDashboard} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <NavListItem to="/children" icon={<ChildrenIcon />} label="Children" indent />
                  <NavListItem to="/eligibility" icon={<EligibilityIcon />} label="Eligibility" indent />
                  <NavListItem to="/college" icon={<CollegeIcon />} label="College" indent />
                  <NavListItem to="/department" icon={<DepartmentIcon />} label="Department" indent />
                  <NavListItem to="/departmentassignment" icon={<DepartmentAssignmentIcon />} label="Dept. Assignment" indent />
                  <NavListItem to="/itemtable" icon={<ItemTableIcon />} label="Department Items" indent />
                  <NavListItem to="/voluntary-works" icon={<VoluntaryWorksIcon />} label="Voluntary Works" indent />
                  <NavListItem to="/search-employee" icon={<SearchEmployeeIcon />} label="Search Records" indent />
                  <NavListItem to="/vocational-data" icon={<VocationalDataIcon />} label="Vocational Data" indent />
                  <NavListItem to="/searchvocational" icon={<SearchVocationalIcon />} label="Search Vocational" indent />
                </List>
              </Collapse>

              {/* Contact & About */}
              <NavListItem to="/contact" icon={<ContactIcon />} label="Contact" />
              <NavListItem to="/about" icon={<AboutIcon />} label="About" />

              {/* Admin / Settings */}
              <NavListItem to="/settings" icon={<SettingsIcon />} label="Settings" />
              <NavListItem to="/page-crud" icon={<PageCRUDIcon />} label="Page CRUD" />
              <NavListItem to="/page-access" icon={<UserPageAccessIcon />} label="User Page Access" />

              <ListItem>
                <Button variant="contained" color="primary" onClick={handleLogout} fullWidth>
                  Logout
                </Button>
              </ListItem>
            </>
          ) : (
            <>
              <NavListItem to="/login" icon={<HomeIcon />} label="Login" />
              <NavListItem to="/register" icon={<HomeIcon />} label="Register" />
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
          <Route path="/eligibility" element={<ProtectedRoute><Eligibility /></ProtectedRoute>} />
          <Route path="/children" element={<ProtectedRoute><Children /></ProtectedRoute>} />
          <Route path="/college" element={<ProtectedRoute><College /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsForm onUpdate={fetchSettings} /></ProtectedRoute>} />
          <Route path="/department" element={<ProtectedRoute><Department /></ProtectedRoute>} />
          <Route path="/departmentassignment" element={<ProtectedRoute><DepartmentAssignment /></ProtectedRoute>} />
          <Route path="/itemtable" element={<ProtectedRoute><ItemTable /></ProtectedRoute>} />
          <Route path="/searchvocational" element={<ProtectedRoute><SearchVocational /></ProtectedRoute>} />
          <Route path="/vocational-data" element={<ProtectedRoute><VocationalData /></ProtectedRoute>} />
          <Route path="/voluntary-works" element={<ProtectedRoute><VoluntaryWorks /></ProtectedRoute>} />
          <Route path="/search-employee" element={<ProtectedRoute><SearchEmployee /></ProtectedRoute>} />

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
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
