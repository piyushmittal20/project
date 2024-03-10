import React, { useState } from 'react';
import { Box, List, ListItem, ListItemAvatar, ListItemText, Avatar } from '@mui/material';

interface Employee {
  name: string;
  role: string;
  id: string;
}

interface EmployeeListProps {
  employees: Employee[];
  onEmployeeSelect: (employee: Employee) => void;
  selectedEmployee: Employee | null;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees, onEmployeeSelect, selectedEmployee }) => {
    return (
      <Box sx={{ marginTop: '1rem' }}>
        <List>
          {employees.map((employee) => (
            <ListItem
              key={employee.id}
              button
              onClick={() => onEmployeeSelect(employee)}
              sx={{
                backgroundColor: selectedEmployee === employee ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
              }}
            >
              <ListItemAvatar>
                <Avatar>{employee.name.charAt(0)}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={employee.name}
                secondary={`${employee.role} | ${employee.id}`}
                secondaryTypographyProps={{ style: { color: 'rgba(0, 0, 0, 0.6)' } }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    );
  };
  
  export default EmployeeList;