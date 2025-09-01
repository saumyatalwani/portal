'use client'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function UserForm() {

    const router = useRouter();

    const [name,setName]=useState<string>('');
    const [email,setEmail]=useState<string>('');
    const [role,setRole]=useState<"user"|"admin">('user');
    const [password,setPassword]=useState<string>('');
  return (
    <>
        <form onSubmit={async (e)=>{
            e.preventDefault()
    await authClient.admin.createUser(
      {
        email: email,
        password: password,
        name: name,
        role: role
      },
      {
        onSuccess: () => {
          toast.success("User added successfully!");
          router.push("/users");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
          //console.error(ctx.error.message);
        },
      }
    );
        }}>
          <div className="w-full">
            <h1 className="text-4xl font-bold mb-2">Add User</h1>
            <label className="font-semibold">Name</label>
            <Input
                className="w-[20vw]"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}          
            />
            
            <label className="font-semibold mt-5">Email</label>
            <Input
                className="w-[20vw] mr-5"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}        
            />
            
            <label className="font-semibold mt-5">Role</label>
            <Select onValueChange={(e:"admin"|"user")=>setRole(e)} value={role}>    
                <SelectTrigger className="w-[25vw]">
                    <SelectValue placeholder="Role" />
                </SelectTrigger>  
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                <label className="font-semibold mt-5">Password</label>
                    <Input
                      type="password"
                      className="w-[20vw] mr-5"
                      placeholder="Password"
                      value={password}
                onChange={(e) => setPassword(e.target.value)}        
                      />
          </div>
          <Button type="submit" className="mt-5">
            Submit
          </Button>
        </form>
    </>
  );
}
