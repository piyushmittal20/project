import { type DefaultSession } from "next-auth"

declare module "next-auth" {
    /**
     * Returned by useSession, getSession and received as a prop on the SessionProvider React Context
     */
    interface Session {
        user: DefaultSession['user'] & {
            /** The user's postal address. */
            id: number
            role: string
        }
    }

    interface User extends DefaultSession.user {
        id: number,
        role: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: number;
        role: string;
    }
}