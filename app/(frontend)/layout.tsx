import type { Metadata } from "next";
import NavBar from "@/components/common/navbar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Placement Portal",
  description: "NA",
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth.api.getSession({ headers: await headers() });

  const user = session?.user;

  if (!user) redirect('/login')
  return (
    <>
      <NavBar icon={user.name.slice(0,1)}/>
      <div
        className={`px-10`}
      >
        {children}
      </div>
    </>
  );
}
