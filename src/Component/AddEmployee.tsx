/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Divider, Avatar } from '@mui/material';
import Sidebar from './Sidebar';
import DependentModal from './DependentModal';
import {api} from '~/utils/api'
import { useRouter } from 'next/router';
import { CheckBox, DeleteOutline, EditOutlined, OpenInNewOutlined, PeopleAltRounded} from "@mui/icons-material";
import {Controller, useForm, useFieldArray} from 'react-hook-form'
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone';
import toast from 'react-hot-toast';

dayjs.extend(utc)
dayjs.extend(timezone)

// interface Dependent {
//   id?: number;
//   name: string;
//   relation: string;
//   dateOfBirth: Date | null;
// }

// interface EmployeeData {
//   id?: string;
//   username: string;
//   employeeId: string;
//   designation: string;
//   dateOfJoining: Date;
//   gender: 'Male' | 'Female';
//   mobileNumber: string;
//   email: string;
//   dependents: Dependent[];
//   insuranceId?: number
// }

interface AddEmployeeProps {
  initialData?: EmployeeData;
}

const schema = yup.object().shape({
  username: yup.string().required('Employee Name is required'),
  employeeId: yup.string().required('Employee ID is required'),
  designation: yup.string().required('Employee Designation is required'),
  dateOfJoining: yup.date().required('Date of Joining is required'),
  gender: yup.mixed<'Male' | 'Female'>().oneOf(['Male', 'Female']).required('Gender is required'),
  mobileNumber: yup.number().required('Mobile Number is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  dependents: yup.array().of(
    yup.object().shape({
      id: yup.number().optional(),
      name: yup.string().required('Dependent Name is required'),
      relation: yup.string().required('Relation is required'),
      dateOfBirth: yup.date().required('Date of Birth is required'),
    })
  ),
});

const AddEmployee: React.FC<AddEmployeeProps> = () => {
  const mutation = api.employee.createEmployee.useMutation()
  const updateMutation = api.employee.updateEmployee.useMutation()
  const router = useRouter()
  const {query} = router;
  const employeeId = query?.id as string | undefined;

  const {data: employeeDetails} = api.employee.getEmployeeDetail.useQuery({id: Number(employeeId)}, {enabled: employeeId != null})

  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState({} as unknown as Dependent)

  const { control, handleSubmit, reset, formState: { errors } } = useForm<NonNullable<EmployeeData>>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      employeeId: '',
      designation: '',
      dateOfJoining: undefined,
      gender: 'Male',
      email: '',
      dependents: [],
      insuranceId: 1
    },
  });

  const { fields, append, remove, update } = useFieldArray<NonNullable<EmployeeData>, 'dependents', 'key'>({
    control,
    name: 'dependents',
    keyName: "key"
  });

  useEffect(() => {
    if(employeeDetails){
      reset(employeeDetails)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeDetails])

  // const handleAddDependent = (dependent: Dependent) => {
  //   setFormData({
  //     ...formData,
  //     dependents: [...formData.dependents, dependent],
  //   });
  // };

  const handleAddDependent = (data: Dependent) => {
    if(data.id){
      const oldFieldIndex = fields.findIndex((field) => field.id === data.id);
      if(oldFieldIndex !== -1){
        update(oldFieldIndex, data)
      }
    } else {
      append(data);
    }
  };

  const handleDeleteDependent = (index: number) => {
    remove(index);
  };

  const handleEditDependent = (key: string) => {
    const field = fields.find((field) => field.key === key)
    if(field){
      const dateOfBirth = dayjs.utc(new Date(field.dateOfBirth).toISOString()).local().tz('Asia/Kolkata').format('YYYY-MM-DD')
      if(dateOfBirth){
        field.dateOfBirth = dateOfBirth as unknown as Date
      }
      setEditData(field)
      setIsModalOpen(true);
  }
  }

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLElement>, isToggle?: boolean) => {
  //   if (isToggle) {
  //     setFormData({
  //       ...formData,
  //       gender: e.currentTarget.value as 'Male' | 'Female',
  //     });
  //   } else {
  //     setFormData({
  //       ...formData,
  //       [e.target.name]: e.target.value,
  //     });
  //   }
  // };

  const submitHandler = (data: NonNullable<EmployeeData>) => {
    if(employeeId == null){
      data.insuranceId = 1;
      mutation.mutate(data, {
        onSuccess: () => {
          toast.success("Employee created successfully!!")
          router.push('/employee');
        },
        onError: () => {
          toast.error("Failed to add employee")
        }
      })
    } else {
      if(data.dependents){
        data.dependentsToCreate = [];
        data.dependentsToUpdate = [];
        data.dependents.forEach((dependent) => {
          if(dependent.id){
            data.dependentsToUpdate.push(dependent)
          } else {
            data.dependentsToCreate.push(dependent)
          }
        })
      }

      updateMutation.mutate(data, {
        onSuccess: () => {
          toast.success("Employee updated successfully!!")
          router.push('/employee');
        },
        onError: () => {
          toast.error("Failed to update employee")
        }
      })
    }
  };

  const openModal = () => {
    setEditData({})
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
        component="form"
        onSubmit={handleSubmit(submitHandler)}
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
              color="error"
              href='/employee'
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
              onClick={() => setOpen(!open)}
              type='submit'
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
            <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Employee Name *"
                    placeholder="Full Name"
                    error={!!errors.username}
                    helperText={errors.username?.message}
                  />
                )}
              />
            <Controller
                name="employeeId"
                control={control}
                render={({ field }) => (
                    <TextField
                      {...field}
                      label="Employee Id *"
                      placeholder="Employee Id"
                      error={!!errors.employeeId}
                      helperText={errors.employeeId?.message}
                    />
                )}
              />
            <Controller
                name="designation"
                control={control}
                render={({ field }) => (
                    <TextField
                    {...field}
                    label="Designation *"
                    placeholder="Designation"
                    error={!!errors.designation}
                    helperText={errors.designation?.message}
                  />
                )}
              />
            <Controller
                name="dateOfJoining"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Date of Joining"
                    type="date"
                    error={!!errors.dateOfJoining}
                    helperText={errors.dateOfJoining?.message}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            <Controller
                name="email"
                control={control}
                render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email *"
                      placeholder="Email Address"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                )}
              />
            <Controller
                name="mobileNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Mobile number *"
                    placeholder="Mobile number"
                    error={!!errors.mobileNumber}
                    helperText={errors.mobileNumber?.message}
                  />
                )}
              />
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Gender *"
                    placeholder="Gender"
                    error={!!errors.gender}
                    helperText={errors.gender?.message}
                  />
                )}
              />
              {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1">Gender *</Typography>
              <Controller
                name="gender"
                control={control}
                defaultValue="Male"
                render={({ field }) => (
                  <ToggleButtonGroup
                    {...field}
                    exclusive
                    onChange={(event, value) => setValue('gender', value as "Male" | "Female")}
                    sx={{ ml: 2 }}
                  >
                    <ToggleButton value="Male">Male</ToggleButton>
                    <ToggleButton value="Female">Female</ToggleButton>
                  </ToggleButtonGroup>
                )}
              />
              </Box> */}
          </Box>
          <Box sx={{ marginTop: "2rem", padding: "1rem" }}>
            <Typography variant="h6" gutterBottom>
                Add dependents
              </Typography>
              <Divider />
              {fields.map((field, index) => (
                <Box
                  key={field.key}
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
                      paddingLeft:"7px"
                    }}
                  >
                    <Avatar>{field.name.charAt(0)}</Avatar>
                    <Box className=" pl-2">
                      <Typography variant="h6">{field.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(field.dateOfBirth).toLocaleDateString()} | {field.relation}
                      </Typography>
                    </Box>
                  </Box>
                  <Box className=" mr-6  flex items-center gap-2 ">
                    <EditOutlined className="cursor-pointer pl-1" 
                      onClick={() => handleEditDependent(field.key)}
                    />
                    <DeleteOutline className=" cursor-pointer pl-1 text-orange-600" 
                      onClick={() => handleDeleteDependent(index)} 
                    />
                  </Box>
                </Box>
              ))}
              <Box
                onClick={openModal}
                className=" cursor-pointer rounded-md bg-[#edf5ff] mt-4"
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
                  <Button variant="contained" color="success">
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
        initialData={editData}
      />
    </Box>
  );
};

export default AddEmployee;