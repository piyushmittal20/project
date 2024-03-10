/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, Modal, TextField } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Sidebar from '../../Component/Sidebar';

const DependentsPage = () => {
  const [dependents, setDependents] = useState([
    { id: 1, name: 'Dependent 1', dob: '12/09/1994', relation: 'Spouse' },
    { id: 2, name: 'Dependent 2', dob: '12/09/1960', relation: 'Mother' },
    { id: 3, name: 'Dependent 3', dob: '12/09/1956', relation: 'Spouse' },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editDependentId, setEditDependentId] = useState(null);
  const [newDependentName, setNewDependentName] = useState('');
  const [newDependentDob, setNewDependentDob] = useState('');
  const [newDependentRelation, setNewDependentRelation] = useState('');

  const handleAddDependent = () => {
    const newDependent = {
      id: dependents.length + 1,
      name: newDependentName,
      dob: newDependentDob,
      relation: newDependentRelation,
    };
    setDependents([...dependents, newDependent]);
    setIsAddModalOpen(false);
    setNewDependentName('');
    setNewDependentDob('');
    setNewDependentRelation('');
  };

  const handleEditDependent = (id: number) => {
    const dependentToEdit = dependents.find((dependent) => dependent.id === id);
    setEditDependentId(id);
    setNewDependentName(dependentToEdit.name);
    setNewDependentDob(dependentToEdit.dob);
    setNewDependentRelation(dependentToEdit.relation);
    setIsEditModalOpen(true);
  };

  const handleUpdateDependent = () => {
    const updatedDependents = dependents.map((dependent) => {
      if (dependent.id === editDependentId) {
        return {
          ...dependent,
          name: newDependentName,
          dob: newDependentDob,
          relation: newDependentRelation,
        };
      }
      return dependent;
    });
    setDependents(updatedDependents);
    setIsEditModalOpen(false);
    setEditDependentId(null);
    setNewDependentName('');
    setNewDependentDob('');
    setNewDependentRelation('');
  };

  const handleDeleteDependent = (id: number) => {
    const updatedDependents = dependents.filter((dependent) => dependent.id !== id);
    setDependents(updatedDependents);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar component */}
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 2 }}>
        <Sidebar />
      </Box>

      <Box sx={{ flex: 1, p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Dependents
        </Typography>
        <Typography variant="body1" gutterBottom>
          Manage all the dependents from here
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1">Employee Name</Typography>
          <Button variant="contained" color="primary" onClick={() => setIsAddModalOpen(true)}>
            Add Dependents
          </Button>
        </Box>
        <List>
          {dependents.map((dependent) => (
            <ListItem
              key={dependent.id}
              secondaryAction={
                <>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleEditDependent(dependent.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteDependent(dependent.id)}
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
                primary={`Dependent ${dependent.id}`}
                secondary={`${dependent.dob} | ${dependent.relation}`}
              />
            </ListItem>
          ))}
        </List>
        {dependents.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No Dependent Selected
          </Typography>
        )}
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
        >
          <Typography variant="h6" gutterBottom>
            Add Dependent
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1rem' }}>
            <TextField
              label="Dependent Name"
              value={newDependentName}
              onChange={(e) => setNewDependentName(e.target.value)}
            />
            <TextField
              label="Date of Birth"
              placeholder="dd/mm/yyyy"
              value={newDependentDob}
              onChange={(e) => setNewDependentDob(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Relation"
              value={newDependentRelation}
              onChange={(e) => setNewDependentRelation(e.target.value)}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Button variant="contained" color="primary" onClick={handleAddDependent}>
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
        >
          <Typography variant="h6" gutterBottom>
            Edit Dependent
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1rem' }}>
            <TextField
              label="Dependent Name"
              value={newDependentName}
              onChange={(e) => setNewDependentName(e.target.value)}
            />
            <TextField
              label="Date of Birth"
              placeholder="dd/mm/yyyy"
              value={newDependentDob}
              onChange={(e) => setNewDependentDob(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Relation"
              value={newDependentRelation}
              onChange={(e) => setNewDependentRelation(e.target.value)}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Button variant="contained" color="primary" onClick={handleUpdateDependent}>
              Update
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default DependentsPage;