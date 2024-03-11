import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "~/server/db"
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
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
        jwt: async ({ token, user }) => {
            if(user){
                token.id = user.id as number;
                token.role = user.role;
            }
            return token;
        },
        session: async ({ session, token }) => {
            if(token){
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        },
    },
    jwt: {
        maxAge: 15 * 24 * 30 * 60,
    },
    pages: {
        signIn: "/"
    },
    secret: 'no-secret',
};

export default NextAuth(authOptions);