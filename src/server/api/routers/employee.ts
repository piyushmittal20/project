import { TRPCError } from "@trpc/server";

import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from "../trpc";

const createEmployeeSchema = z.object({
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
const updateEmployeeSchema = z.object({
    id: z.number(),
    username: z.string().optional(),
    email: z.string().optional(),
    dateOfJoining: z.date().optional(),
    designation: z.string().optional(),
    insuranceId: z.number().optional(),
    employeeId: z.string().optional(),
    mobileNumber: z.number().optional(),
    gender: z.string().optional(),
    dateOfBirth: z.date().optional(),
    dependents: z.array(
        z.object({
            id: z.number().optional(),
            name: z.string().optional(),
            relation: z.string().optional(),
            dateOfBirth: z.date().optional(),
        })
    ).optional(),
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
                    dateOfJoining,
                    insurance: { connect: { id: insuranceId } },
                    username,
                    employeeId,
                    Dependent: {
                        create: dependents.map((dependent) => ({
                            name: dependent.name,
                            relation: dependent.relation,
                            dateOfBirth: dependent.dateOfBirth,
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
                    insurance: true,
                },
            })

            return employees;
        }),
    updateEmployee: protectedProcedure
        .input(updateEmployeeSchema)
        .mutation(async ({ ctx, input }) => {
            const { id, designation, dateOfJoining, insuranceId, employeeId, email, username, gender, mobileNumber, dateOfBirth, dependents} = input

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
                        update: dependents?.map((dependent) => ({
                            where: {id: dependent.id},
                            data: {
                                name: dependent.name,
                                relation: dependent.relation,
                                dateOfBirth: dependent.dateOfBirth,
                            }
                        }))
                    }
                },
                include: {Dependent: true}
            })

            const existingUser = await ctx.db.user.findUnique({
                where: { email: email }
            })

            if (!existingUser) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User is not presesnt in company",
                })
            }

            await ctx.db.user.update({
                where: { email: email },
                data: {
                    email,
                    gender,
                    mobileNumber,
                    dateOfBirth
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

            const employee = await ctx.db.employee.delete({
                where: { id: id },
                include: {
                    Dependent: true,
                },
            })

            await Promise.all(
                employee.Dependent.map(async (dependent) => {
                    await ctx.db.dependent.delete({
                        where: { id: dependent.id },
                    });
                })
            )

            return employee
        })
})