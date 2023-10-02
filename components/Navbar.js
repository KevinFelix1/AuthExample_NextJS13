'use client';
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";


const Navbar = () => {
    const pathname = usePathname();
    const {data, status} = useSession();

    if(status === 'loading') return null

    const title = {
        '/' : 'Auth',
        '/dashboard' : 'Dashboard',
        '/profile' : 'Profile'
    };


    return ( 
        <div className="flex justify-between items-center w-full h-fit p-3 bg-neutral-100 shadow-md">
            <h1 className="font-bold text-2xl xl:text-3xl">{title[pathname]}<span className="text-blue-700">Page</span></h1>
            <div className="flex flex-col items-end gap-3">
                <div className="flex justify-evenly w-80 items-center">
                    <p className="font-semibold">User: <span className="text-neutral-600 font-normal">{data?.user.name || 'Undefined'}</span></p>
                    <div className="h-12 w-12 overflow-hidden rounded-full">
                        <img src={data?.user.image || '#'} alt="Not Picture" />
                    </div>
                </div>
                <div className="flex">
                    <p onClick={() => signOut()} className="text-white font-bold mr-10 bg-red-600 hover:bg-red-700 w-24 text-center h-9 p-1 rounded cursor-pointer">SignOut</p>
                    {pathname !== '/' && 
                    <>
                        <Link href="/" className="text-white font-bold mr-10 bg-blue-600 hover:bg-blue-700 w-24 text-center h-9 p-1 rounded cursor-pointer">Log in</Link>
                    </>
                    }
                </div>
            </div>
        </div>
     );
}
 
export default Navbar;