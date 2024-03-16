/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Box, Typography, Button, Dialog, DialogContent, IconButton } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import {api} from '~/utils/api'
import {useRouter} from 'next/router'

interface Employee {
  empCode: string;
  name: string;
  relationToEmployee: string;
  gender: string;
  dateOfBirth: string;
  sumInsured: number;
}

interface BulkUploadtModalProps {
    open: boolean;
    onClose: () => void;
}

const BulkUploadModal: React.FC<BulkUploadtModalProps> = ({open, onClose}) => {
  const [file, setFile] = useState<File | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const mutation = api.employee.createBulkEmployees.useMutation();
  const router = useRouter()

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv'],
    },
  });

  const handleUpload = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const binaryStr = event.target?.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json<Employee>(worksheet, { header: 1, raw: false });

        console.log(data, 'data')

        const validEmployees = data
          .slice(1)
          .map((row) => ({
                username: row[0] as string,
                designation: row[1] as string,
                employeeId: `${row[2]}`,
                gender: row[3] as string,
                mobileNumber: row[4] as string,
                email: row[5] as string,
                dateOfJoining: dayjs(row[6], 'YYYY-MM-DD').toDate(),
                relation: row[7] as string,
                name: row[8] as string,
                dateOfBirth: dayjs(row[9], 'YYYY-MM-DD').toDate(),
                insuranceId: 1
        }))

        if(validEmployees.length){
            validEmployees.map((validEmployee) => {
                validEmployee.dependents = [];
                const obj = {
                    name: validEmployee.name,
                    relation: validEmployee.relation,
                    dateOfBirth: validEmployee.dateOfBirth
                }
                validEmployee.dependents.push(obj);
            })
        }
        

        setEmployees(validEmployees);

        // mutation.mutate(validEmployees)

        console.log(validEmployees)

        };
        reader.readAsBinaryString(file);
    }
};

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent>
        <Box position="relative">
          <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h5" gutterBottom>
            Bulk Import
          </Typography>
          <Box
            {...getRootProps({
              className: 'dropzone',
            })}
            sx={{
              border: '2px dashed',
              borderColor: 'text.disabled',
              borderRadius: 1,
              py: 4,
              px: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <input {...getInputProps()} />
            <Typography variant="body1" color="text.secondary">
              Drag or drop your file here or choose xlsx
            </Typography>
            <Box mt={2}>
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="70" viewBox="0 0 48 48">
                <path fill="#169154" d="M29,6H15.744C14.781,6,14,6.781,14,7.744v7.259h15V6z"></path><path fill="#18482a" d="M14,33.054v7.202C14,41.219,14.781,42,15.743,42H29v-8.946H14z"></path><path fill="#0c8045" d="M14 15.003H29V24.005000000000003H14z"></path><path fill="#17472a" d="M14 24.005H29V33.055H14z"></path><g><path fill="#29c27f" d="M42.256,6H29v9.003h15V7.744C44,6.781,43.219,6,42.256,6z"></path><path fill="#27663f" d="M29,33.054V42h13.257C43.219,42,44,41.219,44,40.257v-7.202H29z"></path><path fill="#19ac65" d="M29 15.003H44V24.005000000000003H29z"></path><path fill="#129652" d="M29 24.005H44V33.055H29z"></path></g><path fill="#0c7238" d="M22.319,34H5.681C4.753,34,4,33.247,4,32.319V15.681C4,14.753,4.753,14,5.681,14h16.638 C23.247,14,24,14.753,24,15.681v16.638C24,33.247,23.247,34,22.319,34z"></path><path fill="#fff" d="M9.807 19L12.193 19 14.129 22.754 16.175 19 18.404 19 15.333 24 18.474 29 16.123 29 14.013 25.07 11.912 29 9.526 29 12.719 23.982z"></path>
            </svg>
            </Box>
          </Box>
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              General Guidelines
            </Typography>
            <ul>
              <li>The file must contain the following headers:</li>
              <ul>
                <li>Emp Code</li>
                <li>Name</li>
                <li>Relation to Employee</li>
                <li>Gender</li>
                <li>Date of Birth</li>
                <li>Sum Insured</li>
              </ul>
              <li>For Male: M and for Female: F</li>
              <li>The file cannot have more than 500 employees at one time (Max rows - 2000)</li>
              <li>Relations allowed - Self, Spouse, Mother, Father, Son, Daughter</li>
              <li>Son and Father cannot be Female</li>
              <li>Daughter and Mother cannot be Male</li>
              <li>Age of Son or Daughter should not be greater than 21</li>
            </ul>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!file}
            sx={{ mt: 4 }}
          >
            Upload data
          </Button>
          {employees.length > 0 && (
            <pre style={{ marginTop: '1rem' }}>{JSON.stringify(employees, null, 2)}</pre>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default BulkUploadModal;