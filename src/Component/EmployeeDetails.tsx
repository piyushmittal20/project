import React from 'react';
import { Box, Typography, Button, Avatar } from '@mui/material';

interface Employee {
  name: string;
  role: string;
  id: string;
}

interface Dependent {
  name: string;
  dob: string;
  relation: string;
}

interface EmployeeDetailsProps {
  employee: Employee | null;
  dependents: Dependent[];
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ employee, dependents }) => {
  return (
    <Box>
      {employee ? (
        <Box sx={{ backgroundColor: 'white', padding: '1rem', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {employee.name}
          </Typography>
          <Typography>Role: {employee.role}</Typography>
          <Typography>Employee ID: {employee.id}</Typography>
          <Box sx={{ marginTop: '1rem' }}>
            <Typography variant="h6" gutterBottom>
              Policy Dependants
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Group Health Insurance {dependents.length}/{dependents.length}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {dependents.map((dependent) => (
                <Box key={dependent.name} sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Avatar>{dependent.name.charAt(0)}</Avatar>
                  <Box>
                    <Typography variant="body2">{dependent.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {dependent.dob} | {dependent.relation}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <Button variant="contained" color="primary" sx={{ marginTop: '1rem' }}>
              Edit details
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ backgroundColor: 'white', padding: '1rem', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <Typography>No Employee Selected</Typography>
          <Typography color="text.secondary">Please select an employee to view details</Typography>
        </Box>
      )}
    </Box>
  );
};

export default EmployeeDetails;