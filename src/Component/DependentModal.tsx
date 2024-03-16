import React, { useEffect } from 'react';
import { Box, Typography, TextField, Button, Modal } from '@mui/material';
import {useForm, Controller} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';

interface Dependent {
  id?: string;
  name: string;
  relation: string;
  dateOfBirth: Date;
}

interface DependentModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (dependent: Dependent) => void;
  initialData?: Dependent;
}

const schema = yup.object().shape({
  name: yup.string().required('Employee Name is required'),
  relation: yup.string().required('Employee Name is required'),
  dateOfBirth: yup.date().required('Date of birth is required'),
})

const defaultValues = {
  name: '',
  dateOfBirth: undefined,
  relation: '',
  employeeId: 1
}

const DependentModal: React.FC<DependentModalProps> = ({ open, onClose, onSave, initialData}) => {

  const {control, handleSubmit, reset, formState: {errors}} = useForm<Dependent>({
    resolver: yupResolver(schema),
    defaultValues,
  })

  useEffect(() => {
    if(initialData){
      if(Object.keys(initialData).length === 0) {
        reset(defaultValues);
      } else {
        reset(initialData)
      }
    }
  }, [initialData, open, reset])

  const submitHandler = (data: Dependent) => {
    onSave(data)
    onClose()
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
        component="form"
        onSubmit={handleSubmit(submitHandler)}
      >
        <Typography variant="h6" gutterBottom>
          Add Dependent
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1rem' }}>
          <Controller
              name="name"
              control={control}
              render={({ field }) => (
                  <TextField
                  {...field}
                  label="Name *"
                  placeholder="Name"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
            <Controller
                name="relation"
                control={control}
                render={({ field }) => (
                    <TextField
                    {...field}
                    label="Relation *"
                    placeholder="Relation"
                    error={!!errors.relation}
                    helperText={errors.relation?.message}
                  />
                )}
              />
              <Controller
                name="dateOfBirth"
                control={control}
                defaultValue={new Date()}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Date of Birth"
                    type="date"
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth?.message}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <Button variant="contained" color="primary" type='submit'>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DependentModal;