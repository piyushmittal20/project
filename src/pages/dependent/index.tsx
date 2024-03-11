import React, { useState } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, Modal, TextField } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, PersonAddAlt1Outlined } from '@mui/icons-material';
import {api} from "~/utils/api"
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import Sidebar from '../../Component/Sidebar';

dayjs.extend(utc)
dayjs.extend(timezone)

const DependentsPage = () => {
    // const [dependents, setDependents] = useState([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editDependentId, setEditDependentId] = useState(0);
    const [initialEditFormState, setInitialEditFormState] = useState({
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
  const {dependent: {listDependents: {setData}}} = api.useUtils()

  if(isLoading){
    console.log("Loading employees data...")
  } else if(isError){
    console.log("Error fetching employees data:", isError)
  }

  const handleEditDependent = (id: number) => {
    const dependentToEdit = dependentList?.Dependent.find((dependent: { id: number; }) => dependent.id === id);
    if (dependentToEdit) {
        dependentToEdit.dateOfBirth = dayjs.utc(new Date(dependentToEdit.dateOfBirth).toISOString()).local().tz('Asia/Kolkata').format('YYYY-MM-DD')
        setInitialEditFormState(dependentToEdit)
        setIsEditModalOpen(true);
        setEditDependentId(id)
    }
  };

  const handleUpdateDependent: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const targetEl = e.target as HTMLFormElement

    const formData = new FormData(targetEl);

    const updateDependent = {
        id: editDependentId,
        name: formData.get('name') as string,
        dateOfBirth: formData.get('dateOfBirth') as string,
        relation: formData.get('relation') as string,
    }
    
    const newUpdatedDependent = {
        ...updateDependent,
        dateOfBirth: new Date(updateDependent.dateOfBirth),
        employeeId: 1
    }

    // const listDependentsQueryKey = getQueryKey(api.dependent.listDependents)

    setData(undefined, (oldData) => {
        return {...oldData, Dependent: oldData?.Dependent.concat([newUpdatedDependent])} as typeof oldData
    })

    updateMutation.mutate(updateDependent, {
        onSuccess: () => {
            setIsEditModalOpen(false)
            targetEl.reset();
            refetch().catch((err) => console.log(err));
        },
        onError: () => {
            setData(undefined, (oldData) => {
                return {...oldData, Dependent: oldData?.Dependent.filter((item: { dateOfBirth: Date; employeeId: number; id: number; name: string; relation: string; }) => item !== newUpdatedDependent)} as typeof oldData
            })
        }
    });

  };

  const handleDeleteDependent = (id: number) => {

    setData(undefined, (oldData) => {
        return {...oldData, Dependent: oldData?.Dependent.filter((item: { id: number; }) => item.id !== id)} as typeof oldData
    })

    deleteMutation.mutate({id: id}, {
        onSuccess: () => {
            refetch().catch((err) => console.log(err));
        }
    })
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const targetEl = e.target as HTMLFormElement

    const formData = new FormData(targetEl);

    const newDependent = {
        name: formData.get('name') as string,
        dateOfBirth: formData.get('dateOfBirth') as string,
        relation: formData.get('relation') as string,
    }
    
    const newUpdatedDependent = {
        ...newDependent,
        id: dependentList?.Dependent.length?? 0,
        dateOfBirth: new Date(newDependent.dateOfBirth),
        employeeId: 1
    }

    // const listDependentsQueryKey = getQueryKey(api.dependent.listDependents)

    setData(undefined, (oldData) => {
        return {...oldData, Dependent: oldData?.Dependent.concat([newUpdatedDependent])} as typeof oldData
    })

    mutate(newDependent, {
        onSuccess: () => {
            setIsAddModalOpen(false)
            targetEl.reset();
            refetch().catch((err) => console.log(err));
        },
        onError: () => {
            setData(undefined, (oldData) => {
                return {...oldData, Dependent: oldData?.Dependent.filter((item: { id: any; dateOfBirth: Date; employeeId: number; name: string; relation: string; }) => item !== newUpdatedDependent)} as typeof oldData
            })
        }
    });
}

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
            <Typography variant="body2" color={"black"}>
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
                {dependentList?.Dependent.map((dependent: { id: React.Key | null | undefined; name: string; dateOfBirth: string | number | Date; relation: string; }) => (
                    <ListItem
                    key={dependent.id}
                    secondaryAction={
                        <>
                        <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => handleEditDependent(dependent.id as number)}
                        >
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleDeleteDependent(dependent.id as number)}
                        >
                            <DeleteIcon />
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
                {dependentList?.Dependent.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                    No Dependent Selected
                </Typography>
                )}
            </Box>
            <Box sx={{ flex: 1 }}></Box>
            </Box>
      </Box>

      {/* Add Dependent Modal */}
      <Modal
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
          onSubmit={handleSubmit}
        >
          <Typography variant="h6" gutterBottom>
            Add Dependent
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1rem' }}>
            <TextField
              label="Dependent Name"
              name='name'
            />
            <TextField
              label="Date of Birth"
              placeholder="dd/mm/yyyy"
              type="date"
              name="dateOfBirth"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Relation"
              name="relation"
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
      </Modal>

      {/* Edit Dependent Modal */}
      <Modal
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
          onSubmit={handleUpdateDependent}
        >
          <Typography variant="h6" gutterBottom>
            Edit Dependent
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1rem' }}>
            <TextField
              label="Dependent Name"
              name='name'
              defaultValue={initialEditFormState.name}
              key={initialEditFormState.name}
            />
            <TextField
              label="Date of Birth"
              placeholder="dd/mm/yyyy"
              type='date'
              defaultValue={initialEditFormState.dateOfBirth}
              name="dateOfBirth"
              key={initialEditFormState.dateOfBirth}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Relation"
              defaultValue={initialEditFormState.relation}
              name='relation'
              key={initialEditFormState.relation}
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
      </Modal>
      </Box>
  );
};

export default DependentsPage;