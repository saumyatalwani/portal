'use client'
import axios from "axios"
import React from "react"
import LogTable from "@/components/logs/table";

export default function Page() {

  const [data,setData] = React.useState();

  React.useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get("/api/logs");
        setData(res.data.data);
      } catch (err) {
        console.error("Error fetching logs:", err);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <h1 className="text-4xl font-bold">Logs</h1>
      <LogTable data={data}/>
    </>
  );
}
