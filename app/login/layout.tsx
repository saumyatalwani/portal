import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Placement Portal",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
