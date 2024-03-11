/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, {useState, useEffect} from "react";
// import Head from "next/head";
// import Link from "next/link";
import {signIn, useSession} from 'next-auth/react'
import {useRouter} from 'next/router'
import { Box, Typography, TextField, Button } from '@mui/material';

import { api } from "~/utils/api";

type loginCreds = {
  email: string;
  password: string
}

export default function Home() {
  const router = useRouter()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {data} = useSession()
  // const mutation = api.auth.register.useMutation();
  // const mutation = api.dependent.addDependent.useMutation()
  // const mutation = api.employee.createEmployee.useMutation()
  // const result = api.dependent.listDependents.useQuery()
  // const mutation = api.dependent.removeDependent.useMutation()
  // const mutation = api.dependent.updateDependent.useMutation()
  // const result = api.employee.listEmployees.useQuery()
  // const mutation = api.employee.deleteEmployee.useMutation()
  // const mutation = api.employee.updateEmployee.useMutation()

  // useEffect(() => {
  //   if(data && data.user.role === 'HR_MANAGER'){
  //     router.push('/employee')
  //   } else {
  //     router.push('/dependent')
  //   }
  // }, [data, router])

  const handleLogin = async () => {
    // mutation.mutate({
    //   name: 'User3',
    //   email: 'user3@gmail.com',
    //   gender: 'Male',
    //   mobileNumber: 8672687544,
    //   role: 'EMPLOYEE',
    //   dateOfBirth: new Date(),
    //   password: '12345678'
    // })

    // const data = { // Employee
    //   email: '20piyushmittal@gmail.com',
    //   password: '12345678'
    // }

    // const data = { // HR
    //   email: 'mandy22@gmail.com',
    //   password: '12345678'
    // }

    // await signIn('credentials', {...data, callbackUrl: "/"});
  }

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Here you would typically send the email and password to your server for authentication

    const loginCreds: loginCreds = {
      email: email,
      password: password
    }

    await signIn('credentials', {...loginCreds, callbackUrl: "/employee"})
  };

  const handleCreate = async() => {
    // mutation.mutate({
    //   email: 'rock02@gmail.com',
    //   username: 'rock0',
    //   designation: 'SDE',
    //   dateOfJoining: new Date(),
    //   insuranceId: 1,
    //   employeeId: '110',
    //   dependents: [
    //     {
    //       name: 'Dune',
    //       relation: 'sister',
    //       dateOfBirth: new Date('2001-01-20')
    //     }
    //   ]
    // })

    // mutation.mutate({
    //   name: 'Max',
    //   relation: 'Son',
    //   dateOfBirth: new Date('2022-03-11')
    // })

    // mutation.mutate({
    //   id: 3
    // })

    // mutation.mutate({
    //   id: 2,
    //   name: 'Johnny',
    //   relation: 'Friend',
    //   dateOfBirth: new Date('2001-01-11')
    // })

    // mutation.mutate({
    //   id: 2
    // })
  }

  return (
    <Box
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-500"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        className="bg-white p-8 rounded-lg shadow-md"
        maxWidth={400}
        borderRadius={8}
        boxShadow={3}
        padding={4}
      >
        <Typography
          className="text-3xl font-bold mb-6 text-center"
          variant="h4"
          gutterBottom
        >
          Sign In
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            className="mb-4 w-full"
            label="Email"
            type="email"
            value={email}
            onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setEmail(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            className="mb-6 w-full"
            label="Password"
            type="password"
            value={password}
            onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPassword(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <Button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            Sign In
          </Button>
        </form>
      </Box>
    </Box>
  );
}


// 3 dependent,
// 1 employee
// 1 HR
// 1 user