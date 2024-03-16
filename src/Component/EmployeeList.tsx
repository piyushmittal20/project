import React from 'react';
import { Box, List, ListItem, ListItemAvatar, ListItemText, Avatar, } from '@mui/material';
import { ArrowRight, CancelOutlined } from '@mui/icons-material';

interface EmployeeListProps {
  employees: Employees;
  onEmployeeSelect: (employee: Employee) => void;
  selectedEmployee: Employee | null;
}

const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  onEmployeeSelect,
  selectedEmployee,
}) => {
  return (
    <Box sx={{ marginTop: "1rem", paddingLeft: "2rem"  }}>
      <List>
        {employees?.map((employee) => (
          <ListItem
                key={employee.id}
                button
                onClick={() => onEmployeeSelect(employee)}
                sx={{
                    backgroundColor:
                    selectedEmployee === employee
                        ? "rgba(0, 0, 0, 0.04)"
                        : "transparent",
                    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                    border: "solid 0.3px #e5e7eb",
                    marginY: "4px",
                }}
                className="flex justify-between rounded-md  px-4"
            >
                <Box className="flex items-center">
                    <ListItemAvatar>
                    <Avatar className="bg-blue-500 text-white">
                        {employee.user.name.charAt(0)}
                    </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                    primary={employee.username}
                    secondary={`${employee.designation} | ${employee.employeeId}`}
                    secondaryTypographyProps={{
                        className: 'text-gray-600',
                    }}
                    />
            </Box>
            <Box className="flex items-center">
            { selectedEmployee !== employee ? (
                <ArrowRight
                  sx={{
                    backgroundColor: "#edf5ff",
                    color: "#6370af",
                    borderRadius: "6px",
                    fontSize: "32px",
                  }}
                /> 
                ) : (
                  <CancelOutlined
                  sx={{
                    backgroundColor: "#384793",
                    color: "#ffffff",
                    borderRadius: "6px",
                    fontSize: "32px",
                    padding: "4px",
                  }}
                  />
                )}
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default EmployeeList;