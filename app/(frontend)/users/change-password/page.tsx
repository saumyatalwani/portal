"use client";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ChangePassword() {
  const [pass, setPass] = useState<string>("");
  const [newPass, setNewPass] = useState<string>("");
  const router = useRouter();

  async function change() {
    if (pass != "") {
      await authClient.changePassword({
        currentPassword: pass,
        newPassword: newPass,
        revokeOtherSessions : true
      });
      toast.success("Password Changed!");
      router.back();
    }
  }

  return (
    <>
      <h1 className="text-4xl font-bold mb-5">Change Password</h1>
      <div className="flex flex-wrap">
      <Input
        type="password"
        className="w-[20vw] mr-5"
        placeholder="Current Password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
      />
      <Input
        type="password"
        className="w-[20vw] mr-5"
        placeholder="New Password"
        value={newPass}
        onChange={(e) => setNewPass(e.target.value)}
      />
      </div>
      <Button type="submit" className="mt-5" onClick={() => change()}>
        Submit
      </Button>
    </>
  );
}
