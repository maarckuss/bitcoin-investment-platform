import { useEffect, useState } from "react";

import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
} from "@chakra-ui/react";

import API from "../api/axios";

function AdminInvestments() {
  const [investments, setInvestments] = useState([]);

  const fetchInvestments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/admin/investments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setInvestments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const completeInvestment = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.patch(
        `/admin/complete-investment/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchInvestments();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  return (
    <Box p={8} minH="100vh">
      <Text fontSize="3xl" fontWeight="bold" color="white" mb={6}>
        Investment Management
      </Text>

      <Table bg="rgba(255,255,255,0.04)" color="white" borderRadius="20px">
        <Thead>
          <Tr>
            <Th color="gray.300">User</Th>

            <Th color="gray.300">Amount</Th>

            <Th color="gray.300">Return</Th>

            <Th color="gray.300">Status</Th>

            <Th color="gray.300">Action</Th>
          </Tr>
        </Thead>

        <Tbody>
          {investments.map((investment) => (
            <Tr key={investment._id}>
              <Td>{investment.userId?.email || investment.userId}</Td>

              <Td>${investment.amount}</Td>

              <Td>${investment.expectedReturn}</Td>

              <Td>{investment.status}</Td>

              <Td>
                {investment.status === "active" && (
                  <Button
                    size="sm"
                    colorScheme="green"
                    onClick={() => completeInvestment(investment._id)}
                  >
                    Complete
                  </Button>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default AdminInvestments;
