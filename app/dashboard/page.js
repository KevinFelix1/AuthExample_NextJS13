'use client';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Dashboard() {
    const {data: session, status} = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/')
        }
    });

    if(status === 'loading') {
        return null
    }

    return (
    <div className="text-white text-center text-3xl mt-5">
        DashboardPage
    </div>
 )
}