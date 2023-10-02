import NextAuth from "next-auth";

import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { compare } from "bcrypt";

import prismadb from "@/libs/prismadb";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
          }),
        Credentials({
            id: 'credentials',
            name: 'credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'text',
                },
                password: {
                    label: 'Password',
                    type: 'password',
                },
            },
            async authorize(credentials) {
                if(!credentials?.email || !credentials?.password) { // Validation
                    throw new Error('Email and password required');
                };

                const user = await prismadb.user.findUnique({
                    where: {
                        email: credentials?.email
                    },
                });
                
                if(!user || !user?.hashedPassword) { // Validation - Email
                    throw new Error('Email does not exist');
                };

                const isCorrectPassword = await compare(credentials?.password, user?.hashedPassword);

                if(!isCorrectPassword) { // Validation - Password
                    throw new Error('Incorrect password');
                };
                return user;
            },
        }),
    ],
    pages: {
        signIn: '/'
    },
    debug: process.env.NODE_ENV === 'development',
    adapter: PrismaAdapter(prismadb),
    session: {
        strategy: 'jwt'
    },
    jwt: {
        secret: process.env.NEXTAUTH_JWT_SECRET,
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export {handler as GET, handler as POST}