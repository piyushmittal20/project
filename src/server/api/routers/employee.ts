import { TRPCError } from "@trpc/server";

import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from "../trpc";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc)
dayjs.extend(timezone)

const createEmployeeSchema = z.object({
    username: z.string(),
    email: z.string(),
    dateOfJoining: z.date(),
    designation: z.string(),
    insuranceId: z.number().optional(),
    employeeId: z.string(),
    dependents: z.array(
        z.object({
            name: z.string(),
            relation: z.string(),
            dateOfBirth: z.date(),
        })
    ),
})
const createBulkEmployeesSchema = z.array(
    z.object({
        username: z.string(),
        email: z.string(),
        dateOfJoining: z.date(),
        designation: z.string(),
        insuranceId: z.number().optional(),
        employeeId: z.string(),
        dependents: z.array(
            z.object({
                name: z.string(),
                relation: z.string(),
                dateOfBirth: z.date(),
            })
        ),
    })
)

const updateEmployeeSchema = z.object({
    id: z.number(),
    username: z.string(),
    dateOfJoining: z.date(),
    designation: z.string(),
    insuranceId: z.number(),
    employeeId: z.string(),
    email: z.string(),
    mobileNumber: z.number(),
    gender: z.string(),
    dependentsToCreate: z.array(
        z.object({
            name: z.string(),
            relation: z.string(),
            dateOfBirth: z.date()
        })
    ).optional(),
    dependentsToUpdate: z.array(
        z.object({
            id: z.number(),
            name: z.string(),
            relation: z.string(),
            dateOfBirth: z.date()
        })
    )
})

export const employeeRouter = createTRPCRouter({
    createEmployee: protectedProcedure
        .input(createEmployeeSchema)
        .mutation(async ({ ctx, input }) => {
            const { designation, dateOfJoining, insuranceId, employeeId, email, username, dependents } = input

            if (ctx.session?.user?.role !== 'HR_MANAGER') {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Only HR managers can create employees",
                })
            }

            const user = await ctx.db.user.findUnique({
                where: { email }
            })

            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User is not presesnt in company",
                })
            }

            const employee = await ctx.db.employee.create({
                data: {
                    user: { connect: { id: user.id } },
                    designation,
                    dateOfJoining: new Date(dateOfJoining),
                    insurance: { connect: { id: insuranceId } },
                    username,
                    employeeId,
                    Dependent: {
                        create: dependents.map((dependent) => ({
                            name: dependent.name,
                            relation: dependent.relation,
                            dateOfBirth: new Date(dependent.dateOfBirth),
                        }))
                    }
                },
                include: {Dependent: true}
            })

            return employee
        }),
    listEmployees: protectedProcedure
        .query(async ({ ctx }) => {
            if (ctx.session?.user?.role !== 'HR_MANAGER') {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Only HR managers can view employees",
                });
            }

            const employees = await ctx.db.employee.findMany({
                include: {
                    user: true,
                    Dependent: true,
                },
            })

            return employees;
        }),
    getEmployeeDetail: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ctx, input}) => {
            const {id} = input;

            if (ctx.session?.user?.role !== 'HR_MANAGER') {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Only HR managers can view employees",
                });
            }

                const employee = await ctx.db.employee.findUnique({
                    where: {id: id},
                    include: {
                        user: true,
                        Dependent: true,
                    },
                })
                
                if(!employee){
                    return employee;
                }

                const {user, Dependent, ...employeeDetails} = employee

                return {
                    ...employeeDetails,
                    dateOfJoining: dayjs.utc(new Date(employeeDetails.dateOfJoining).toISOString()).local().tz('Asia/Kolkata').format('YYYY-MM-DD'),
                    email: user.email,
                    gender: user.gender,
                    mobileNumber: Number(user.mobileNumber),
                    dependents: Dependent
                };
        }),
    updateEmployee: protectedProcedure
        .input(updateEmployeeSchema)
        .mutation(async ({ ctx, input }) => {
            const { id, designation, dateOfJoining, insuranceId, employeeId, username, email, mobileNumber, gender, dependentsToCreate, dependentsToUpdate} = input

            if (ctx.session?.user?.role !== 'HR_MANAGER') {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Only HR managers can view employees",
                });
            }

            const existingEmployee = await ctx.db.employee.findUnique({
                where: { id }
            })

            if (!existingEmployee) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Employee is not presesnt in the company",
                })
            }

            const employee = await ctx.db.employee.update({
                where: { id },
                data: {
                    designation,
                    dateOfJoining: new Date(dateOfJoining),
                    insurance: { connect: { id: insuranceId } },
                    username,
                    employeeId,
                    Dependent: {
                        create: dependentsToCreate?.map((dependent) => ({
                            name: dependent.name,
                            relation: dependent.relation,
                            dateOfBirth: new Date(dependent.dateOfBirth),   
                        })),
                        updateMany: dependentsToUpdate?.map((dependent) => ({
                            where: {
                                id: dependent.id,
                            },
                            data: {
                                name: dependent.name,
                                relation: dependent.relation,
                                dateOfBirth: new Date(dependent.dateOfBirth),
                            },
                        }))
                    }
                },
                include: {Dependent: true}
            })

            const existingUser = await ctx.db.user.findUnique({
                where: { email }
            })

            if (!existingUser) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User is not presesnt in company",
                })
            }

            const updatedUser = await ctx.db.user.update({
                where: { email },
                data: {
                    email,
                    gender,
                    mobileNumber,
                }
            })

            return {
                employee,
                updatedUser
            }
        }),
    deleteEmployee: protectedProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const { id } = input;

            if (ctx.session?.user?.role !== 'HR_MANAGER') {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Only HR managers can view employees",
                });
            }

            const employee = await ctx.db.employee.findUnique({
                where: {id},
                include: {
                    Dependent: true
                }
            })

            if (employee?.Dependent) {
                await Promise.all(
                    employee.Dependent.map(async (dependent) => {
                        await ctx.db.dependent.delete({
                            where: { id: dependent.id },
                        });
                    })
                )
            }

            await ctx.db.employee.delete({
                where: { id: id },
            })

            return employee;
        }),
    createBulkEmployees: protectedProcedure
        .input(createBulkEmployeesSchema)
        .mutation(async({ctx, input}) => {
            if (ctx.session?.user?.role !== 'HR_MANAGER') {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Only HR managers can view employees",
                });
            }

            const employees = input;

            for(const employee of employees) {
                const existingUser = await ctx.db.user.findUnique({
                    where: {email: employee.email}
                })

                if(!existingUser) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "No user found with this email id.",
                    });
                }

                await ctx.db.employee.create({
                    data: {
                        dateOfJoining: new Date(employee.dateOfJoining),
                        designation: employee.designation,
                        user: {
                            connect: {
                                id: existingUser.id,
                            },
                        },
                        employeeId: employee.employeeId,
                        username: employee.username,
                        insurance: {connect: {
                            id: employee.insuranceId
                        }},
                        Dependent: {
                            create: employee.dependents.map((dependent) => ({
                                name: dependent.name,
                                dateOfBirth: new Date(dependent.dateOfBirth),
                                relation: dependent.relation
                            }))
                        }
                    }
                })
            }

            return {
                message: "Employees added successfully!!",
                success: true
            }
        })
})