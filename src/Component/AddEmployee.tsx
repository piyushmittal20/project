import React, { useState } from 'react';
import { Box, Typography, TextField, Button, ToggleButtonGroup, ToggleButton, Divider } from '@mui/material';
import Sidebar from './Sidebar';
import DependentModal from './DependentModal';

interface Dependent {
  name: string;
  relation: string;
  dob: string;
}

const AddEmployee = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [designation, setDesignation] = useState('');
  const [joinDate, setJoinDate] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddDependent = (dependent: Dependent) => {
    setDependents([...dependents, dependent]);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };


  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box sx={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <Typography variant="h6" fontWeight="bold">
            Employees &gt; Single Entry
          </Typography>
          <Box>
            <Button variant="contained" color="error" sx={{ marginRight: '0.5rem' }}>
              Discard
            </Button>
            <Button variant="contained" color="primary">
              Confirm Employee
            </Button>
          </Box>
        </Box>
        <Typography variant="subtitle1" gutterBottom>
          Add a new employee in the system
        </Typography>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <TextField
              label="Employee Name *"
              placeholder="Full Name"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
            />
            <TextField
              label="Employee ID *"
              placeholder="Company employee id"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
            <TextField
              label="Employee Designation *"
              placeholder="Designation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            />
            <TextField
              label="Date of Joining *"
              placeholder="dd/mm/yy"
              value={joinDate}
              onChange={(e) => setJoinDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Date of Birth *"
              placeholder="dd/mm/yy"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1">Gender *</Typography>
              <ToggleButtonGroup
                value={gender}
                exclusive
                onChange={(_, value) => setGender(value as string)}
                sx={{ ml: 2 }}
              >
                <ToggleButton value="Male">Male</ToggleButton>
                <ToggleButton value="Female">Female</ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <TextField
              label="Mobile Number *"
              placeholder="without country code"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
            <TextField
              label="Email *"
              placeholder="corporate email id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>
          <Box sx={{ marginLeft: '2rem', width: '300px' }}>
            <Typography variant="h6" gutterBottom>
              Select Insurance and Sum Insured
            </Typography>
            <Box sx={{ backgroundColor: 'rgba(0, 128, 0, 0.1)', padding: '0.5rem', borderRadius: '4px' }}>
              <Typography variant="body2" color="text.secondary">
                Group Health Insurance
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Employees and family covered
              </Typography>
              <Box sx={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <Button variant="outlined" color="success">
                  ₹2,00,000
                </Button>
                <Button variant="outlined" color="success">
                  ₹7,50,000
                </Button>
                <Button variant="contained" color="success">
                  ₹10,00,000
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box sx={{ marginTop: '2rem' }}>
          <Typography variant="h6" gutterBottom>Add dependents</Typography>
          <Divider />
          {dependents.map((dependent, index) => (
            <Box key={index} sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
              <Typography>{dependent.name}</Typography>
              <Typography>{dependent.relation}</Typography>
              <Typography>{dependent.dob}</Typography>
            </Box>
          ))}
          <Button variant="outlined" onClick={openModal} sx={{ marginTop: '1rem' }}>
            + Add a dependent
          </Button>
        </Box>
      </Box>
      <DependentModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddDependent}
      />
    </Box>
  );
};

export default AddEmployee;