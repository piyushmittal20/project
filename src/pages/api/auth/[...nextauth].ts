import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "~/server/db"
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }
                const user = await db.user.findUnique({
                    where: {email: credentials.email}
                })

                if (!user) {
                    throw new Error("No user found with the provided email");
                }

                const isValidPassword = await bcrypt.compare(credentials.password, user.password);

                if (!isValidPassword) {
                    throw new Error("Invalid password");
                }

                return user;
            },
        }),
    ],
    callbacks: {
        session: async ({ session, user }) => {
            session.user = {
                name: user.name,
                id: Number(user.id),
                role: user.role,
                email: user.email
            };
            return session;
        },
    },
};

export default NextAuth(authOptions);