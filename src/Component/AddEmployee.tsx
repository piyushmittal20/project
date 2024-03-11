/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, ToggleButtonGroup, ToggleButton, Divider, Avatar } from '@mui/material';
import Sidebar from './Sidebar';
import DependentModal from './DependentModal';
import {api} from '~/utils/api'
import { useRouter } from 'next/router';
import {
  CheckBox,
  DeleteOutline,
  EditOutlined,
  OpenInNewOutlined,
  PeopleAltRounded,
} from "@mui/icons-material";

interface Dependent {
  name: string;
  relation: string;
  dateOfBirth: Date | null;
}

interface EmployeeData {
  id?: string;
  username: string;
  employeeId: string;
  designation: string;
  // dateOfJoining: Date | null;
  // dateOfBirth: Date | null;
  gender: 'Male' | 'Female';
  mobileNumber: string;
  email: string;
  dependents: Dependent[];
  insuranceId?: number
}

interface AddEmployeeProps {
  initialData?: EmployeeData;
}

const AddEmployee: React.FC<AddEmployeeProps> = ({ initialData }) => {
  const mutation = api.employee.createEmployee.useMutation()
  const updateMutation = api.employee.updateEmployee.useMutation()
  const router = useRouter()
  const {pathname} = router;

  console.log(pathname)

  const [formData, setFormData] = useState<EmployeeData>(
    initialData?? {
      username: '',
      employeeId: '',
      designation: '',
      // dateOfJoining: null,
      // dateOfBirth: null,
      gender: 'Male',
      mobileNumber: '',
      email: '',
      dependents: [],
      insuranceId: 1
    }
  );

  console.log(initialData, 'initialData')

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddDependent = (dependent: Dependent) => {
    setFormData({
      ...formData,
      dependents: [...formData.dependents, dependent],
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLElement>, isToggle?: boolean) => {
    if (isToggle) {
      setFormData({
        ...formData,
        gender: e.currentTarget.value as 'Male' | 'Female',
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(pathname === '/employee/add'){
      mutation.mutate(formData)
    } else {
      formData.dependents ?  formData.dependents?.map((dependent) => {
        if(dependent.id){
          formData.dependentsToUpdate = []
          formData.dependentsToUpdate.push(dependent)
        } else {
          formData.dependentsToCreate = []
          formData.dependentsToCreate.push(dependent)
        }
      }) : formData.Dependent?.map((dependent) => {
        if(dependent.id){
          formData.dependentsToUpdate = []
          formData.dependentsToUpdate.push(dependent)
        } else {
          formData.dependentsToCreate = []
          formData.dependentsToCreate.push(dependent)
        }
      })

      console.log(formData, '105')
      updateMutation.mutate(formData)
    }

    router.push('/employee')

    setFormData({
      username: '',
      employeeId: '',
      designation: '',
      // dateOfJoining: null,
      // dateOfBirth: null,
      gender: 'Male',
      mobileNumber: '',
      email: '',
      dependents: [],
      insuranceId: 1
    })

  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
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
              Employees &gt; Single Entry
            </Typography>
            <Typography variant="body2" color={"black"}>
              Manage all the employees from here
            </Typography>
          </Box>
          <Box className="flex gap-2 ">
            <Button
              className="font"
              variant="outlined"
              color="primary"
              sx={{ textTransform: "none", fontWeight: "light" }}
            >
              Discard
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ textTransform: "none", fontWeight: "light" }}
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleSubmit}
            >
              Confirm Employee
            </Button>
          </Box>
        </Box>
        <Box sx={{ display: "flex", padding: "1rem" }}>
          <Box
            sx={{
              flex: 4,
            }}
          >
          <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "1rem",
              }}
            >
            <TextField
              label="Employee Name *"
              placeholder="Full Name"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            <TextField
              label="Employee ID *"
              placeholder="Company employee id"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
            />
            <TextField
              label="Employee Designation *"
              placeholder="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
            />
            {/* <TextField
              label="Date of Joining *"
              type="date"
              name="dateOfJoining"
              value={formData.dateOfJoining}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            /> */}
            {/* <TextField
              label="Date of Birth *"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            /> */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1">Gender *</Typography>
              <ToggleButtonGroup
                value={formData.gender ? formData.gender : formData?.user?.gender}
                exclusive
                onChange={(_, value) => handleChange({ currentTarget: { value } }, true)}
                sx={{ ml: 2 }}
              >
                <ToggleButton value="Male">Male</ToggleButton>
                <ToggleButton value="Female">Female</ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <TextField
              label="Mobile Number *"
              placeholder="without country code"
              name="mobileNumber"
              value={formData.mobileNumber ? formData.mobileNumber: Number(formData?.user?.mobileNumber)}
              onChange={handleChange}
            />
            <TextField
              label="Email *"
              placeholder="corporate email id"
              name="email"
              value={formData.email ? formData.email : formData?.user?.email}
              onChange={handleChange}
            />
          </Box>
          <Box sx={{ marginTop: "2rem", padding: "1rem" }}>
            <Typography variant="h6" gutterBottom>
                Add dependents
              </Typography>
              <Divider />
              {formData.dependents ? formData.dependents.map((dependent) => (
                <Box
                  key={dependent.name}
                  className=" rounded-md"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "solid 0.3px #e5e7eb",
                    gap: "0.5rem",
                    marginY: "2px",
                    marginTop: "4px",
                    padding: "3px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginY: "2px",
                      marginTop: "4px",
                      padding: "3px",
                    }}
                  >
                    <Avatar>{dependent.name.charAt(0)}</Avatar>
                    <Box className=" pl-2">
                      <Typography variant="h6">{dependent.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {dependent.dateOfBirth} | {dependent.relation}
                      </Typography>
                    </Box>
                  </Box>
                  <Box className=" mr-6  flex items-center gap-2 ">
                    <EditOutlined className="cursor-pointer pl-1" />
                    <DeleteOutline className=" cursor-pointer pl-1 text-orange-600" />
                  </Box>
                </Box>
              )) : formData?.Dependent?.map((dependent) => (
                <Box
                  key={dependent.name}
                  className=" rounded-md"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "solid 0.3px #e5e7eb",
                    gap: "0.5rem",
                    marginY: "2px",
                    marginTop: "4px",
                    padding: "3px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginY: "2px",
                      marginTop: "4px",
                      padding: "3px",
                    }}
                  >
                    <Avatar>{dependent.name.charAt(0)}</Avatar>
                    <Box className=" pl-2">
                      <Typography variant="h6">{dependent.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(dependent.dateOfBirth).toLocaleDateString()} | {dependent.relation}
                      </Typography>
                    </Box>
                  </Box>
                  <Box className=" mr-6  flex items-center gap-2 ">
                    <EditOutlined className="cursor-pointer pl-1" />
                    <DeleteOutline className=" cursor-pointer pl-1 text-orange-600" />
                  </Box>
                </Box>
              ))}
              <Box
                onClick={openModal}
                className=" cursor-pointer rounded-md bg-[#edf5ff]"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "dotted 2px #2b3981",
                  gap: "0.5rem",
                  marginY: "2px",
                  marginTop: "4px",
                  padding: "3px",
                  color: "#2b3981",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginY: "2px",
                    marginTop: "4px",
                    padding: "3px",
                  }}
                >
                  <Box className=" pl-2">
                    <Typography>+ Add a Dependent</Typography>
                  </Box>
                </Box>
              </Box>
              </Box>
              </Box>
              <Box sx={{ marginLeft: "2rem", width: "300px", flex: 2 }}>
            <Box
              sx={{
                borderRadius: "4px",
                border: "solid 1px green ",
              }}
            >
              <Typography
                sx={{
                  borderRadius: "4px",
                }}
                variant="body2"
                color="success"
                className="w-full bg-[#eafcf0] px-4 py-2 text-[#469465]"
              >
                <CheckBox className="mr-1 pr-1" />
                Selected
              </Typography>
              <Box className="p-2">
                <Box className="flex items-center justify-between p-2">
                  <Box>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      className=" cursor-pointer"
                    >
                      Group Health Insurance <OpenInNewOutlined />
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Employees and family covered
                    </Typography>
                  </Box>
                  <PeopleAltRounded className=" cursor-pointer rounded-sm bg-blue-200 p-1" />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: "1rem",
                    marginTop: "0.5rem",
                    justifyContent: "space-evenly",
                  }}
                >
                  <Button variant="outlined" color="success">
                    ₹2,00,000
                  </Button>
                  <Button variant="outlined" color="success">
                    ₹7,50,000
                  </Button>
                  <Button variant="outlined" color="success">
                    ₹10,00,000
                  </Button>
                </Box>
                </Box>
              </Box>
            </Box>
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


{/* <Box sx={{ marginTop: '2rem' }}>
          <Typography variant="h6" gutterBottom>Add dependents</Typography>
          <Divider />
          {formData.dependents ? formData.dependents.map((dependent, index) => (
            <Box key={index} sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
              <Typography>{dependent.name}</Typography>
              <Typography>{dependent.relation}</Typography>
              <Typography>{dependent.dateOfBirth ? dependent.dateOfBirth : ''}</Typography>
            </Box>
          )) : formData?.Dependent?.map((dependent, index) => (
            <Box key={index} sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
              <Typography>{dependent.name}</Typography>
              <Typography>{dependent.relation}</Typography>
              <Typography>{dependent.dateOfBirth ? dependent.dateOfBirth : ''}</Typography>
            </Box>
          ))}
          <Button variant="outlined" onClick={openModal} sx={{ marginTop: '1rem' }}>
            + Add a dependent
          </Button>
        </Box> */}