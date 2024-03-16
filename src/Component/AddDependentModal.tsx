import React from 'react';
import { Box, Typography, Button, Modal, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// interface Dependent {
//     id: number;
//     name: string;
//     relation: string;
//     dateOfBirth: Date;
//     employeeId: number;
// }

interface AddDependentModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Dependent) => void;
}

const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    relation: yup.string().required('Relation is required'),
    dateOfBirth: yup.date().required('Date of Birth is required').max(new Date(), 'Date of Birth cannot be in the future'),
});


const AddDependentModal: React.FC<AddDependentModalProps> = ({ open, onClose, onSubmit }) => {
    const { control, handleSubmit, reset, formState: { errors } } = useForm<Dependent>({
        resolver: yupResolver(schema),
    });

    const handleModalSubmit = (data: Dependent) => {
        onSubmit(data);
        reset();
    };

    return (
        <Modal
        open={open}
        onClose={onClose}
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
          onSubmit={handleSubmit(handleModalSubmit)}
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
      </Modal>
    )
}

export default AddDependentModal