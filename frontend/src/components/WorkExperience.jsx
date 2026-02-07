import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Container,
  Grid,
  Paper,
  MenuItem
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const WorkExperience = () => {

  // PAGE ACCESS SCRIPT ------------------------ UPPER PART --- START

  const [hasAccess, setHasAccess] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const pageId = 22;

    if (!userId) {
      setHasAccess(false);
      return;
    }

    const checkAccess = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/page_access/${userId}/${pageId}`);

        if (response.data && typeof response.data.hasAccess === 'boolean') {
          setHasAccess(response.data.hasAccess);
        } else {
          console.error('Unexpected API response format:', response.data);
          setHasAccess(false);
        }
      } catch (error) {
        console.error('Error checking access:', error);
        setHasAccess(false);
      }
    };

    checkAccess();
  }, []);

  // PAGE ACCESS SCRIPT ------------------------ UPPER PART --- END

  const [data, setData] = useState([]);
  const [workDateFrom, setNewWorkDateFrom] = useState("");
  const [workDateTo, setNewWorkDateTo] = useState("");
  const [workPositionTitle, setNewWorkPositionTitle] = useState("");
  const [workCompany, setNewWorkCompany] = useState("");
  const [workMonthlySalary, setNewWorkMonthlySalary] = useState("");
  const [salaryJobOrPayGrade, setNewSalaryJobOrPayGrade] = useState("");
  const [statusOfAppointment, setNewStatusOfAppointment] = useState("");
  const [isGovtService, setNewIsGovtService] = useState("");
  const [editItem, setEditItem] = useState(null);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    fetchItems();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  const fetchItems = async () => {
    const response = await axios.get("http://localhost:5000/work-experience");
    setData(response.data);
  };

  const addItem = async () => {
    if (
      workDateFrom.trim() === "" ||
      workDateTo.trim() === "" ||
      workPositionTitle.trim() === "" ||
      workCompany.trim() === "" ||
      workMonthlySalary.trim() === "" ||
      salaryJobOrPayGrade.trim() === "" ||
      statusOfAppointment.trim() === "" ||
      isGovtService.trim() === ""
    )
      return;
    await axios.post("http://localhost:5000/work-experience", {
      workDateFrom: workDateFrom,
      workDateTo: workDateTo,
      workPositionTitle: workPositionTitle,
      workCompany: workCompany,
      workMonthlySalary: workMonthlySalary,
      salaryJobOrPayGrade: salaryJobOrPayGrade,
      statusOfAppointment: statusOfAppointment,
      isGovtService: isGovtService,
    });
    setNewWorkDateFrom("");
    setNewWorkDateTo("");
    setNewWorkPositionTitle("");
    setNewWorkCompany("");
    setNewWorkMonthlySalary("");
    setNewSalaryJobOrPayGrade("");
    setNewStatusOfAppointment("");
    setNewIsGovtService("");
    fetchItems();
  };

  const updateItem = async () => {
    if (
      !editItem ||
      editItem.workDateFrom.trim() === "" ||
      editItem.workDateTo.trim() === "" ||
      editItem.workPositionTitle.trim() === "" ||
      editItem.workCompany.trim() === "" ||
      editItem.workMonthlySalary === "" ||
      editItem.salaryJobOrPayGrade === "" ||
      editItem.statusOfAppointment.trim() === "" ||
      editItem.isGovtService.trim() === ""
    )
      return;

    await axios.put(`http://localhost:5000/work-experience/${editItem.id}`, {
      workDateFrom: editItem.workDateFrom,
      workDateTo: editItem.workDateTo,
      workPositionTitle: editItem.workPositionTitle,
      workCompany: editItem.workCompany,
      workMonthlySalary: editItem.workMonthlySalary,
      salaryJobOrPayGrade: editItem.salaryJobOrPayGrade,
      statusOfAppointment: editItem.statusOfAppointment,
      isGovtService: editItem.isGovtService,
    });

    setEditItem(null);
    fetchItems();
  };

  const deleteItem = async (id) => {
    await axios.delete(`http://localhost:5000/work-experience/${id}`);
    fetchItems();
  };

  // PAGE ACCESS SCRIPT ------------------------ LOWER PART --- START

  if (hasAccess === null) {
    return <div>Loading access information...</div>;
  }

  if (!hasAccess) {
    return <div>You do not have access to this page. Contact the administrator to request access.</div>;
  }

  // PAGE ACCESS SCRIPT ------------------------ LOWER PART --- END

  return (
    <>
      <Box>
        {message && (
          <Alert severity={messageType} sx={{ marginTop: 2, width: "100%" }}>
            {message}
          </Alert>
        )}
      </Box>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 3, mt: 3, fontWeight: 'bold' }}>Work Experience</Typography>

        {/* Add New Item Form */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Add New Work Experience</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date From"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={workDateFrom}
                onChange={(e) => setNewWorkDateFrom(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date To"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={workDateTo}
                onChange={(e) => setNewWorkDateTo(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Position Title"
                fullWidth
                value={workPositionTitle}
                onChange={(e) => setNewWorkPositionTitle(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Company / Department"
                fullWidth
                value={workCompany}
                onChange={(e) => setNewWorkCompany(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Monthly Salary"
                fullWidth
                value={workMonthlySalary}
                onChange={(e) => setNewWorkMonthlySalary(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Pay Grade / step (e.g. 00-1)"
                fullWidth
                value={salaryJobOrPayGrade}
                onChange={(e) => setNewSalaryJobOrPayGrade(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Status of Appointment"
                fullWidth
                value={statusOfAppointment}
                onChange={(e) => setNewStatusOfAppointment(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Government Service"
                fullWidth
                value={isGovtService}
                onChange={(e) => setNewIsGovtService(e.target.value)}
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button onClick={addItem} variant="contained" color="primary" fullWidth size="large">
                Add Record
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Work Experience Table */}
        <Paper elevation={3} sx={{ p: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><b>From</b></TableCell>
                <TableCell><b>To</b></TableCell>
                <TableCell><b>Position</b></TableCell>
                <TableCell><b>Company</b></TableCell>
                <TableCell><b>Salary</b></TableCell>
                <TableCell><b>Pay Grade</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Govt Service</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {editItem && editItem.id === item.id ? (
                      <TextField
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={editItem.workDateFrom}
                        onChange={(e) =>
                          setEditItem({
                            ...editItem,
                            workDateFrom: e.target.value,
                          })
                        }
                        size="small"
                      />
                    ) : (
                      formatDate(item.workDateFrom)
                    )}
                  </TableCell>

                  <TableCell>
                    {editItem && editItem.id === item.id ? (
                      <TextField
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={editItem.workDateTo}
                        onChange={(e) =>
                          setEditItem({ ...editItem, workDateTo: e.target.value })
                        }
                        size="small"
                      />
                    ) : (
                      formatDate(item.workDateTo)
                    )}
                  </TableCell>

                  <TableCell>
                    {editItem && editItem.id === item.id ? (
                      <TextField
                        value={editItem.workPositionTitle}
                        onChange={(e) =>
                          setEditItem({
                            ...editItem,
                            workPositionTitle: e.target.value,
                          })
                        }
                        size="small"
                      />
                    ) : (
                      item.workPositionTitle
                    )}
                  </TableCell>

                  <TableCell>
                    {editItem && editItem.id === item.id ? (
                      <TextField
                        value={editItem.workCompany}
                        onChange={(e) =>
                          setEditItem({
                            ...editItem,
                            workCompany: e.target.value,
                          })
                        }
                        size="small"
                      />
                    ) : (
                      item.workCompany
                    )}
                  </TableCell>

                  <TableCell>
                    {editItem && editItem.id === item.id ? (
                      <TextField
                        value={editItem.workMonthlySalary}
                        onChange={(e) =>
                          setEditItem({
                            ...editItem,
                            workMonthlySalary: e.target.value,
                          })
                        }
                        size="small"
                      />
                    ) : (
                      item.workMonthlySalary
                    )}
                  </TableCell>

                  <TableCell>
                    {editItem && editItem.id === item.id ? (
                      <TextField
                        value={editItem.salaryJobOrPayGrade}
                        onChange={(e) =>
                          setEditItem({
                            ...editItem,
                            salaryJobOrPayGrade: e.target.value,
                          })
                        }
                        size="small"
                      />
                    ) : (
                      item.salaryJobOrPayGrade
                    )}
                  </TableCell>

                  <TableCell>
                    {editItem && editItem.id === item.id ? (
                      <TextField
                        value={editItem.statusOfAppointment}
                        onChange={(e) =>
                          setEditItem({
                            ...editItem,
                            statusOfAppointment: e.target.value,
                          })
                        }
                        size="small"
                      />
                    ) : (
                      item.statusOfAppointment
                    )}
                  </TableCell>

                  <TableCell>
                    {editItem && editItem.id === item.id ? (
                      <TextField
                        select
                        value={editItem.isGovtService}
                        onChange={(e) =>
                          setEditItem({
                            ...editItem,
                            isGovtService: e.target.value,
                          })
                        }
                        size="small"
                        fullWidth
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </TextField>
                    ) : (
                      item.isGovtService
                    )}
                  </TableCell>

                  <TableCell>
                    {editItem && editItem.id === item.id ? (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          onClick={updateItem}
                          variant="contained"
                          color="success"
                          size="small"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditItem(null)}
                          variant="outlined"
                          color="secondary"
                          size="small"
                        >
                          Cancel
                        </Button>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          onClick={() => setEditItem(item)}
                          variant="outlined"
                          color="primary"
                          size="small"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => deleteItem(item.id)}
                          variant="outlined"
                          color="error"
                          size="small"
                        >
                          Delete
                        </Button>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </>
  );
};

export default WorkExperience;
