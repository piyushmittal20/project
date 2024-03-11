/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, Button, Avatar, Divider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ArrowDropDown, Person2Outlined } from '@mui/icons-material';

interface Employee {
    username: string;
    role: string;
    employeeId: string;
    id: number;
    designation: string;
    user: {
        id: number;
        name: string;
    },
    Dependent: [
        {
            id: number;
            name: string;
            relation: string;
            dateOfBirth: Date
        }
    ]
}

interface Dependent {
    id: number;
    name: string;
    relation: string;
    dateOfBirth: Date
}

interface EmployeeDetailsProps {
    employee: Employee;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({employee}) => {
    const router = useRouter()

    const editEmployeeHandler = (id: number) => {
        router.push({
            pathname: "/employee/edit",
            query: {id: id}
        })
    }

  return (
    <Box sx={{ padding: 0 }}>
      {employee ? (
        <Box sx={{ backgroundColor: "white", padding: "1rem" }}>
            <Box sx={{}}>
            <Typography variant="h6" color={"#1f1899"}>
              Policy Dependants
            </Typography>
            <Divider className="mb-4" />
            <Accordion>
              <AccordionSummary
                expandIcon={<ArrowDropDown />}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{ backgroundColor: "#ffeded" }}
              >
                <Person2Outlined />
                <Typography>
                  Group Health Insurance {employee?.Dependent?.length}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                    <Box className="mb-4 flex items-center justify-between">
                    <Typography variant="body2" fontWeight={"light"}>
                      Dependents{" "}
                    </Typography>
                    <Typography variant="body2" fontWeight={"semibold"}>
                      Self , Spouse , Father , Mother
                    </Typography>
                  </Box>
                  {employee?.Dependent?.map((dependent: Dependent) => (
                    <Box
                      key={dependent.name}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        border: "solid 0.3px #e5e7eb",
                        marginY: "2px",
                        padding: "3px",
                      }}
                      className=" rounded-md"
                    >
                      <Avatar>{dependent.name.charAt(0)}</Avatar>
                      <Box>
                        <Typography variant="body2">
                          {dependent.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {dependent.dateOfBirth.toLocaleDateString()} | {dependent.relation}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                  </Box>
                  <Button
                  variant="outlined"
                  color="primary"
                  sx={{ marginTop: "1rem" , width:"100%" }}
                  onClick={() => editEmployeeHandler(employee?.id)}
                >
                  Edit details
                </Button>
              </AccordionDetails>
            </Accordion>
          </Box>
          </Box>
      ) : (
        <Box
          sx={{
            backgroundColor: "white",
            padding: "1rem",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography>No Employee Selected</Typography>
          <Typography color="text.secondary">
            Please select an employee to view details
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default EmployeeDetails;