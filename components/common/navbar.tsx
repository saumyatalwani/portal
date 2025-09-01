'use client';
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar({icon,role}:{icon:string,role : string}){

    const router = useRouter()
    const pathname = usePathname();

    return(
        <div className="w-full h-[20%] flex p-5">
            <h1 className="font-semibold text-2xl">Placement Portal</h1>

            <div className="ml-auto">
                <Link href={'/dashboard'} className={`mx-2 ${pathname==='/dashboard' ? 'font-semibold' : ''}`}>Dashboard</Link>
                <Link href={'/logs'} className={`mx-2 ${pathname==='/logs' ? 'font-semibold' : ''}`}>Logs</Link>
                {
                    role==='admin' ? 
                     <Link href={'/users'} className={`mx-2 ${pathname==='/users' ? 'font-semibold' : ''}`}>Users</Link> : null
                }
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar className="ml-5 size-[40px]"><AvatarFallback>{icon}</AvatarFallback></Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={'/users/change-password'}>Change Password</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={async()=>{await authClient.signOut({
                        fetchOptions: {
                            onSuccess: () => {
                            router.push("/login"); // redirect to login page
                            },
                        },
                        });}}>Log Out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}