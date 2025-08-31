'use client'
import { Button } from "@/components/ui/button"
import { Code, Braces, Brackets } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

export default function Page(){

    return (
        <>
            <h1 className="text-4xl font-bold">Force Update</h1>
            
            <div className="grid max-w-md gap-5 mt-5">
                <Button variant="outline" size="sm" onClick={async ()=>{
                    try{
                        await axios.get('/api/codeforces')
                        toast.success('Code Forces updated.')
                    }catch(err){
                        toast.error('Some Error Occured Updating Codeforces')
                    }
                }}><Code/>Update Codeforces</Button>
                <Button variant="outline" size="sm" onClick={async ()=>{
                    try{
                        await axios.get('/api/codechef')
                        toast.success('CodeChef updated.')
                    }catch(err){
                        toast.error('Some Error Occured Updating CodeChef')
                    }
                }}><Braces/>Update CodeChef</Button>
                <Button variant="outline" size="sm" onClick={async ()=>{
                    try{
                        await axios.get('/api/leetcode')
                        toast.success('LeetCode updated.')
                    }catch(err){
                        toast.error('Some Error Occured Updating LeetCode')
                    }
                }}><Brackets/>Update LeetCode</Button>
            </div>
        </>
    )
}