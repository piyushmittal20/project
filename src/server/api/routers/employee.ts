import { TRPCError } from "@trpc/server";

import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from "../trpc";

const createEmployeeSchema = z.object({
    username: z.string(),
    email: z.string(),
    dateOfJoining: z.string(),
    designation: z.string(),
    insuranceId: z.number(),
    employeeId: z.string(),
    dependents: z.array(
        z.object({
            name: z.string(),
            relation: z.string(),
            dateOfBirth: z.string(),
        })
    ),
})
const createBulkEmployeesSchema = z.array(
    z.object({
        username: z.string(),
        email: z.string(),
        dateOfJoining: z.date(),
        designation: z.string(),
        insuranceId: z.number(),
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
    username: z.string().optional(),
    dateOfJoining: z.date().optional(),
    designation: z.string().optional(),
    insuranceId: z.number(),
    employeeId: z.string().optional(),
    user: z.object({
        email: z.string(),
        mobileNumber: z.bigint(),
        gender: z.string()
    }),
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
                where: {id},
                include: {
                    user: true,
                    Dependent: true,
                },
            }, )

            return employee;
        }),
    updateEmployee: protectedProcedure
        .input(updateEmployeeSchema)
        .mutation(async ({ ctx, input }) => {
            const { id, designation, dateOfJoining, insuranceId, employeeId, username, user, dependentsToCreate, dependentsToUpdate} = input

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
                    dateOfJoining,
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
                where: { email: user.email }
            })

            if (!existingUser) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User is not presesnt in company",
                })
            }

            await ctx.db.user.update({
                where: { email: user.email },
                data: {
                    email: user.email,
                    gender: user.gender,
                    mobileNumber: user.mobileNumber,
                }
            })

            return employee
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
                        dateOfJoining: employee.dateOfJoining,
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

                return "Employees added successfully!!"
            }
        })
})