import { useEffect, useState } from "react";
import FeedbackWidget from "@/components/FeedbackWidget";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Dashboard = () => {
  const [data, setData] = useState([
    { id: 1, name: "Item 1", status: "Active" },
    { id: 2, name: "Item 2", status: "Inactive" },
    { id: 3, name: "Item 3", status: "Active" },
  ]);

  useEffect(() => {
    // Simulate fetching data from an API
    setTimeout(() => {
      setData([
        { id: 1, name: "Item 1", status: "Active" },
        { id: 2, name: "Item 2", status: "Inactive" },
        { id: 3, name: "Item 3", status: "Active" },
        { id: 4, name: "Item 4", status: "Active" },
        { id: 5, name: "Item 5", status: "Inactive" },
      ]);
    }, 500);
  }, []);
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="rounded-md border">
        <Table>
          <TableCaption>A list of your recent tasks.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <FeedbackWidget position="bottom-right" productName="Dashboard" />
    </div>
  );
};

export default Dashboard;
