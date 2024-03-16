/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Typography,
  Select,
  ToggleButtonGroup,
  ToggleButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  LeaderboardOutlined,
  PersonAddAlt1Outlined,
  Search,
  Filter,
  Download,
} from "@mui/icons-material";
import Link from "next/link";
import Sidebar from '../../Component/Sidebar';
import EmployeeList from '../../Component/EmployeeList';
import EmployeeDetails from '../../Component/EmployeeDetails';
import {api} from "~/utils/api"
import BulkUploadModal from '~/Component/BulkUploadModal';

interface Employee {
  username: string;
  role: string;
  employeeId: string;
  id: number;
  designation: string;
  user: {
    id: number;
    name: string;
  },
  Dependent: [
    {
        id: number;
        name: string;
        relation: string;
        dateOfBirth: Date
    }
  ]
}

const Employees: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [tabValue, setTabValue] = useState<number>(0);
  const [bulkModalIsOpen, setBulkModalIsOpen] = useState(false)

  const onBulkModalClose = () => setBulkModalIsOpen(false)

  const {data: listEmployees, isLoading, isError} = api.employee.listEmployees.useQuery()

  if(isLoading){
    console.log("Loading employees data...")
  } else if(isError){
    console.log("Error fetching employees data:", isError)
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          className="bg-[#edf5ff] text-[#384793]"
          sx={{
            display: "flex",
            padding: "1rem",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Employees
            </Typography>
            <Typography variant="body2" color={"black"}>
              Manage all the employees from here
            </Typography>
          </Box>
          <Box className="flex gap-2 ">
            <Button
              className="font"
              variant="outlined"
              startIcon={<LeaderboardOutlined />}
              color="primary"
              sx={{ textTransform: "none", fontWeight: "light" }}
            >
              Reports
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PersonAddAlt1Outlined />}
              sx={{ textTransform: "none", fontWeight: "light" }}
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              Add Employee(s)
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <Link href="/employee/add">
                <MenuItem sx={{ width: 210, maxWidth: '100%' }}>Single Entry</MenuItem>
              </Link>
                <MenuItem onClick={() => setBulkModalIsOpen(true)}>Bulk Entry</MenuItem>
            </Menu>
          </Box>
        </Box>
        <Box
          sx={{ display: "flex", gap: "1rem", justifyContent: "space-between" }}
        >
          <Box sx={{ flex: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1rem",
                paddingLeft: "8px",
                gap: "8px",
              }}
              className="justify-between"
            >
              <Select size="small" value={"all"}>
                <option value="all">All Policies</option>
              </Select>
              <ToggleButtonGroup
                size="small"
                color="primary"
                value={tabValue}
                exclusive
                onChange={handleTabChange}
                aria-label="Platform"
              >
                <ToggleButton
                  sx={{ textTransform: "none", paddingX: "3rem" }}
                  value="Active"
                >
                  Active
                </ToggleButton>
                <ToggleButton
                  sx={{ textTransform: "none", paddingX: "3rem" }}
                  value="Pending"
                >
                  Pending
                </ToggleButton>
                <ToggleButton
                  sx={{ textTransform: "none", paddingX: "3rem" }}
                  value="Inactive"
                >
                  Inactive
                </ToggleButton>
              </ToggleButtonGroup>
              <Box className="flex items-center gap-2">
                <Search className=" cursor-pointer" />
                <Filter className=" cursor-pointer" />
                <Download className=" cursor-pointer" />
              </Box>
            </Box>
            <Divider />
            <EmployeeList
              employees={listEmployees}
              onEmployeeSelect={handleEmployeeSelect}
              selectedEmployee={selectedEmployee}
            />
          </Box>
          <Box sx={{ flex: 1, marginRight: "8px" }}>
            {selectedEmployee && (
              <EmployeeDetails employee={selectedEmployee} />
            )}
          </Box>
        </Box>
      </Box>
      <BulkUploadModal open={bulkModalIsOpen} onClose={onBulkModalClose} />
    </Box>
  );
};

export default Employees;