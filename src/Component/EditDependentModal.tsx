import React, {useEffect} from 'react';
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

// type EditFormStateType = yup.InferType<typeof schema>

interface EditDependentModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Dependent) => void;
    initialFormState: Dependent;
}

const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    relation: yup.string().required('Relation is required'),
    dateOfBirth: yup.date().required('Date of Birth is required').max(new Date(), 'Date of Birth cannot be in the future'),
    employeeId: yup.number()
});


const EditDependentModal: React.FC<EditDependentModalProps> = ({ open, onClose, onSubmit, initialFormState }) => {
    const { control, handleSubmit, reset, formState: { errors } } = useForm<Dependent>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            dateOfBirth: undefined,
            relation: '',
            employeeId: 1
        }
    });

    useEffect(() => {
        reset(initialFormState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialFormState])

    const handleModalSubmit = (data: Dependent) => {
        onSubmit(data);
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
            Edit Dependent
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1rem' }}>
          <Controller
              name="name"
              control={control}
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
      </Modal>
    )
}

export default EditDependentModal