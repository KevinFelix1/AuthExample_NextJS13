import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import prismadb from "@/libs/prismadb";


export async function POST( req ) {
    try {
        const { email, password, name } = await req.json();

        const existingUser = await prismadb.user.findUnique({
            where: {
                email
            },
        });

        if(existingUser) { // Validation 
            return NextResponse.json(null, {statusText: 'Email taken', status: 400});
        };

        if(password.length < 8) { // Validation
            return NextResponse.json(null, {statusText: 'Your Email is small', status: 400})
        };

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prismadb.user.create({
            data: {
                email,
                name,
                hashedPassword,
                image: ''
            },
        });

        return NextResponse.json(user, {statusText: 'Successfully Registered'});
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ status: 400 });
    };
};