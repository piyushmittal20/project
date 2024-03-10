import React, { useState } from 'react';
import { Box, Button, Tabs, Tab, Divider, Typography } from '@mui/material';
import Sidebar from '../../Component/Sidebar';
import EmployeeList from '../../Component/EmployeeList';
import EmployeeDetails from '../../Component/EmployeeDetails';

interface Employee {
  name: string;
  role: string;
  id: string;
}

const employees: Employee[] = [
  { name: 'Albert Flores', role: 'Employee', id: 'Employee ID' },
  { name: 'Esther Howard', role: 'Employee', id: 'Employee ID' },
  { name: 'Cameron Williamson', role: 'Employee', id: 'Employee ID' },
  { name: 'Guy Hawkins', role: 'Manager', id: 'Employee ID' },
  { name: 'Jenny Wilson', role: 'Employee', id: 'Employee ID' },
  { name: 'Kristin Watson', role: 'Manager', id: 'Employee ID' },
  { name: 'Ralph Edwards', role: 'Manager', id: 'Employee ID' },
];

const dependents = [
  { name: 'Name', dob: '12/09/1956', relation: 'Self' },
  { name: 'Name', dob: '12/09/1956', relation: 'Spouse' },
  { name: 'Name', dob: '12/09/1956', relation: 'Father' },
  { name: 'Name', dob: '12/09/1956', relation: 'Mother' },
];

const Employees = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box sx={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Employees
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage all the employees from here
            </Typography>
          </Box>
          <Box>
            <Button variant="contained" color="primary" sx={{ marginRight: '0.5rem' }}>
              Reports
            </Button>
            <Button variant="contained" color="primary">
              Add Employee(s)
            </Button>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="All Policies" />
                <Tab label="Active" />
                <Tab label="Pending" />
                <Tab label="Inactive" />
              </Tabs>
            </Box>
            <Divider />
            <EmployeeList employees={employees} onEmployeeSelect={handleEmployeeSelect} selectedEmployee={selectedEmployee} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <EmployeeDetails employee={selectedEmployee} dependents={dependents} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Employees;