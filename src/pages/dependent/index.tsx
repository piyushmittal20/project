/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, } from '@mui/material';
import { PersonAddAlt1Outlined, EditOutlined, DeleteOutlineOutlined } from '@mui/icons-material';
import {api} from "~/utils/api"
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import Sidebar from '../../Component/Sidebar';
import AddDependentModal from '~/Component/AddDependentModal';
import EditDependentModal from '~/Component/EditDependentModal';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

dayjs.extend(utc)
dayjs.extend(timezone)

// interface Dependent {
//   id: number;
//   name: string;
//   relation: string;
//   dateOfBirth: Date;
//   employeeId: number;
// }

const DependentsPage = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editDependentId, setEditDependentId] = useState(0);
    const [initialEditFormState, setInitialEditFormState] = useState<Dependent>({
        id: 1,
        name: '',
        relation: '',
        dateOfBirth: new Date(),
        employeeId: 1
    })

  const  {data: dependentList, isLoading, isError, refetch} = api.dependent.listDependents.useQuery()
  const {mutate} = api.dependent.addDependent.useMutation()
  const updateMutation = api.dependent.updateDependent.useMutation()
  const deleteMutation = api.dependent.removeDependent.useMutation()
  const {dependent: {listDependents: {setData, getData}}} = api.useUtils()

  const {data} = useSession()
  const router = useRouter()

  if(isLoading){
    console.log("Loading employees data...")
  } else if(isError){
    console.log("Error fetching employees data:", isError)
  }

  const handleEditDependent = (id: number) => {
    const dependentToEdit = dependentList?.find((dependent: { id: number; }) => dependent.id === id);
    if (dependentToEdit) {
        dependentToEdit.dateOfBirth = dayjs.utc(new Date(dependentToEdit.dateOfBirth).toISOString()).local().tz('Asia/Kolkata').format('YYYY-MM-DD') as unknown as Date
        setInitialEditFormState(dependentToEdit)
        setIsEditModalOpen(true)
        setEditDependentId(id)
    }
  };

  const handleUpdateDependent = (data: Partial<Dependent>) => {
    const updateDependent = {
        id: editDependentId,
        name: data.name!,
        dateOfBirth: data.dateOfBirth!,
        relation: data.relation!,
        employeeId: data.employeeId!
    }

    const oldDependentDoc = getData()?.find((dependent) => dependent.id === updateDependent.id)

    setData(undefined, (oldData) => {
        const newDependentsData = [...Array.from(oldData?? [])]
        const indexOfOldDoc = oldData?.findIndex((dependent) => dependent.id === updateDependent.id)
        if(indexOfOldDoc !== undefined && indexOfOldDoc !== -1){
          newDependentsData[indexOfOldDoc] = updateDependent;
          return newDependentsData 
        }
        return oldData;
    })

    updateMutation.mutate(updateDependent, {
        onSuccess: () => {
            setIsEditModalOpen(false)
            refetch().catch((err) => console.log(err));
            toast.success("Dependent updated successfully")
        },
        onError: () => {
            setData(undefined, (oldData) => {
              const newDependentsData = [...Array.from(oldData?? [])]
              const indexOfOldDoc = oldData?.findIndex((dependent) => dependent.id === updateDependent.id)
              if(indexOfOldDoc !== undefined && indexOfOldDoc !== -1){
                newDependentsData[indexOfOldDoc] = oldDependentDoc!;
                return newDependentsData
              }

              return oldData;
            })
            toast.error("Failed to update dependent!!")
        }
    });

  };

  const handleDeleteDependent = (id: number) => {

    setData(undefined, (oldData) => {
        return oldData?.filter((item: { id: number; }) => item.id !== id)
    })

    deleteMutation.mutate({id: id}, {
        onSuccess: () => {
            refetch().catch((err) => console.log(err));
            toast.success("Deleted dependent!!")
        }
    })
  };

  const submitHandler = (data: Dependent) => {
    const newDependent = {
        name: data.name,
        dateOfBirth: data.dateOfBirth,
        relation: data.relation
    }
    
    const newUpdatedDependent = {
        ...newDependent,
        id: dependentList?.length ?? 0,
        // dateOfBirth: newDependent.dateOfBirth ? new Date(newDependent.dateOfBirth) : new Date(),
        employeeId: 1
    }

    setData(undefined, (oldData) => {
        return oldData?.concat([newUpdatedDependent])
    })

    mutate(newDependent, {
        onSuccess: () => {
            setIsAddModalOpen(false)
            refetch().catch((err) => console.log(err));
            toast.success("Dependent added successfully")
        },
        onError: () => {
            setData(undefined, (oldData) => {
                return oldData?.filter((item) => item !== newUpdatedDependent)
            })
            toast.error("Failed to add dependent!!")
        }
    });
  }

  // useEffect(() => {
  //   if(data?.user.role !== "EMPLOYEE"){
  //     router.push('/')
  //   }
  // }, [data?.user.role])

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
        <Sidebar />
      <Box sx={{ flex: 1 }}>
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
              Dependents
            </Typography>
            <Typography className=" font-light" color={"black"}>
              Manage all the dependents from here
            </Typography>
            </Box>
            <Box className="flex gap-2 ">
            <Button
              variant="contained"
              color="primary"
              startIcon={<PersonAddAlt1Outlined />}
              sx={{ textTransform: "none", fontWeight: "light" }}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Dependent
            </Button>
          </Box>
          </Box>
          <Box sx={{ display: "flex" }}>
            <Box sx={{ flex: 1}}>
                <List>
                {dependentList?.map((dependent: { id: React.Key | null | undefined; name: string; dateOfBirth: string | number | Date; relation: string; }) => (
                    <ListItem
                    key={dependent.id}
                    className="my-2 ml-4 rounded-md border font-light "
                    secondaryAction={
                        <>
                        <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => handleEditDependent(dependent.id as number)}
                        >
                            <EditOutlined />
                        </IconButton>
                        <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleDeleteDependent(dependent.id as number)}
                        >
                            <DeleteOutlineOutlined className="text-red-400" />
                        </IconButton>
                        </>
                    }
                    >
                    <ListItemAvatar>
                        <Avatar>
                        {/* You can replace this with an appropriate avatar icon or image */}
                        {dependent.name.charAt(0).toUpperCase()}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={`${dependent.name}`}
                        secondary={`${new Date(dependent.dateOfBirth).toLocaleDateString()} | ${dependent.relation.toLowerCase()}`}
                    />
                    </ListItem>
                ))}
                </List>
                {dependentList?.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                    No Dependent Selected
                </Typography>
                )}
            </Box>
            <Box
            className=" ml-6 flex min-h-[75vh] items-center justify-center border-l"
            sx={{ flex: .6 }}
          >
          </Box>
        </Box>
      </Box>

      {/* Add Dependent Modal */}
      {/* <Modal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            right: 0,
            width: '400px',
            height: '100vh',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            overflowY: 'auto',
          }}
          component="form"
          onSubmit={handleSubmit(submitHandler)}
        >
          <Typography variant="h6" gutterBottom>
            Add Dependent
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1rem' }}>
            <Controller
              control={control}
              defaultValue=""
              name='name'
              render={({ field }) => (
                <>
                  <TextField {...field} label="Dependent Name" />
                  {errors.name && <Typography variant="body2" color="error">{errors.name.message}</Typography>}
                </>
              )}
            />
            <Controller
              name="dateOfBirth"
              control={control}
              defaultValue={new Date()}
              render={({ field }) => (
                <>
                  <TextField
                    {...field}
                    label="Date of Birth"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                  />
                  {errors.dateOfBirth && <Typography variant="body2" color="error">{errors.dateOfBirth.message}</Typography>}
                </>
              )}
            />
            <Controller
              name="relation"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <>
                  <TextField {...field} label="Relation" />
                  {errors.relation && <Typography variant="body2" color="error">{errors.relation.message}</Typography>}
                </>
              )}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "1rem",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              type='submit'
            >
              Add
            </Button>
          </Box>
        </Box>
      </Modal> */}
      <AddDependentModal 
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={submitHandler}
      />

      {/* Edit Dependent Modal */}
      {/* <Modal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            right: 0,
            width: '400px',
            height: '100vh',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            overflowY: 'auto',
          }}
          component="form"
          onSubmit={handleSubmit(handleUpdateDependent)}
        >
          <Typography variant="h6" gutterBottom>
            Edit Dependent
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1rem' }}>
          <Controller
              name="name"
              control={control}
              defaultValue={initialEditFormState.name}
              render={({ field }) => (
                <>
                  <TextField {...field} label="Dependent Name" />
                  {errors.name && <Typography variant="body2" color="error">{errors.name.message}</Typography>}
                </>
              )}
            />
            <Controller
              name="dateOfBirth"
              control={control}
              defaultValue={initialEditFormState.dateOfBirth}
              render={({ field }) => (
                <>
                  <TextField
                    {...field}
                    label="Date of Birth"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                  />
                  {errors.dateOfBirth && <Typography variant="body2" color="error">{errors.dateOfBirth.message}</Typography>}
                </>
              )}
            />
            <Controller
              name="relation"
              control={control}
              defaultValue={initialEditFormState.relation}
              render={({ field }) => (
                <>
                  <TextField {...field} label="Relation" />
                  {errors.relation && <Typography variant="body2" color="error">{errors.relation.message}</Typography>}
                </>
              )}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "1rem",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              type='submit'
            >
              Update
            </Button>
          </Box>
        </Box>
      </Modal> */}
      <EditDependentModal 
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateDependent}
        initialFormState={initialEditFormState}
      />
      </Box>
  );
};

export default DependentsPage;