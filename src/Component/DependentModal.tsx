import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Modal } from '@mui/material';

interface Dependent {
  name: string;
  relation: string;
  dob: string;
}

interface DependentModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (dependent: Dependent) => void;
}

const DependentModal: React.FC<DependentModalProps> = ({ open, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [dob, setDob] = useState('');

  const handleSave = () => {
    const dependent: Dependent = { name, relation, dob };
    onSave(dependent);
    onClose();
    setName('');
    setRelation('');
    setDob('');
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
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
          <TextField label="Dependent Name" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Relation" value={relation} onChange={(e) => setRelation(e.target.value)} />
          <TextField label="Date of Birth" placeholder="dd/mm/yy" value={dob} onChange={(e) => setDob(e.target.value)} InputLabelProps={{ shrink: true }} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DependentModal;