import { TRPCError } from "@trpc/server";
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from "../trpc";

const dependentSchema = z.object({
    name: z.string(),
    relation: z.string(),
    dateOfBirth: z.date(),
    employeeId: z.optional(z.number())
})

const updateDependentSchema = z.object({
    id: z.number(),
    name: z.string(),
    relation: z.string(),
    dateOfBirth: z.date(),
})

export const dependentRouter = createTRPCRouter({
    listDependents: protectedProcedure
        .query(async({ctx}) => {
            if(!ctx?.session?.user) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You must be logged in to access this resource",
                });
            }
            const employeeid = ctx.session?.user?.id;
            const dependents = await ctx.db.employee.findUnique({
                where: {id: employeeid},
                include: {Dependent: true}
            })

            return dependents
        }),
    addDependent: protectedProcedure
        .input(dependentSchema)
        .mutation(async ({ ctx, input }) => {
            const { name, relation, dateOfBirth, employeeId } = input;

            if(!ctx?.session?.user) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You must be logged in to access this resource",
                });
            }

            const dependent = await ctx.db.dependent.create({
                data: {
                    name,
                    relation,
                    dateOfBirth: new Date(dateOfBirth),
                    employee: {connect: {id: ctx.session?.user?.id || employeeId}}
                },
            });

            return dependent;
        }),
    updateDependent: protectedProcedure
        .input(updateDependentSchema)
        .mutation(async ({ ctx, input }) => {
            const { id, name, relation, dateOfBirth } = input;

            const existingDependent = await ctx.db.dependent.findUnique({
                where: {id: id}
            })

            if(!existingDependent){
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Dependent not found in the DB.",
                });
            }

            const dependent = await ctx.db.dependent.updateMany({
                where: {
                    id: existingDependent?.id
                },
                data: {
                    name,
                    relation,
                    dateOfBirth: new Date(dateOfBirth),
                },
            });

            return dependent;
        }),
    removeDependent: protectedProcedure
        .input(z.object({id: z.number()}))
        .mutation(async({ctx, input}) => {
            const {id} = input;

            await ctx.db.dependent.delete({
                where: {id}
            })

            return {
                message: 'Dependent deleted successfully',
                success: true
            }
        }),
})