/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from "../trpc";

const registerSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    mobileNumber: z.number(),
    gender: z.string(),
    dateOfBirth: z.date(),
    role: z.enum(["EMPLOYEE", "HR_MANAGER"]),
});

export const authRouter = createTRPCRouter({
    register: publicProcedure
        .input(registerSchema)
        .mutation(async ({ ctx, input }) => {
            const { name, email, dateOfBirth, gender, password, mobileNumber, role } = input;

            const existingUser = await ctx.db.user.findUnique({
                where: {email: email}
            })

            if (existingUser) {
                throw new TRPCError({
                    code: 'CONFLICT',
                    message: 'User already exists!'
                })
            }

            const hashedPassword = await bcrypt.hash(password, 10)

            const user = await ctx.db.user.create({
                data: {
                    name: name,
                    email: email,
                    password: hashedPassword,
                    role: role,
                    dateOfBirth: dateOfBirth,
                    gender: gender,
                    mobileNumber: mobileNumber
                },
            });

            return user;
        }),
})

