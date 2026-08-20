import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import API from "../api/axios";

function ActivityLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/admin/logs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLogs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box p={10}>
      <Heading mb={6}>Activity Logs</Heading>

      <Table>
        <Thead>
          <Tr>
            <Th>Action</Th>
            <Th>Target User</Th>
            <Th>Amount</Th>
            <Th>Date</Th>
          </Tr>
        </Thead>

        <Tbody>
          {logs.map((log) => (
            <Tr key={log._id}>
              <Td>{log.action}</Td>
              <Td>{log.targetUserId}</Td>
              <Td>{log.amount || "-"}</Td>
              <Td>{new Date(log.createdAt).toLocaleString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default ActivityLogs;
