'use client'
import axios from "axios"
import React from "react"
import DashboardTable from "@/components/dashboard/table";

export default function Page() {

  const [data,setData] = React.useState();

  React.useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get("/api/student");
        setData(res.data.data);
      } catch (err) {
        console.error("Error fetching profiles:", err);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <DashboardTable data={data}/>
    </>
  );
}
