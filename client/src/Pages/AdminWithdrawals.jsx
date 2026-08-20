import { useEffect, useState } from "react";

import {
  Box,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";

import API from "../api/axios";

function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);

  const fetchWithdrawals = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/admin/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWithdrawals(res.data.withdrawals);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const approveWithdrawal = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.patch(
        `/withdrawals/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchWithdrawals();
    } catch (err) {
      console.log(err);
    }
  };

  const rejectWithdrawal = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.patch(
        `/withdrawals/${id}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchWithdrawals();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box p={8}>
      <Text fontSize="3xl" fontWeight="bold" mb={6}>
        Bitcoin Withdrawals
      </Text>

      <Box
        bg="rgba(255,255,255,0.04)"
        border="1px solid rgba(255,255,255,0.08)"
        borderRadius="20px"
        overflowX="auto"
      >
        <Table color="white">
          <Thead bg="rgba(255,255,255,0.05)">
            <Tr>
              <Th color="gray.400">User</Th>

              <Th color="gray.400">Amount</Th>

              <Th color="gray.400">Wallet Address</Th>

              <Th color="gray.400">Status</Th>

              <Th color="gray.400">Action</Th>
            </Tr>
          </Thead>

          <Tbody>
            {withdrawals.map((withdrawal) => (
              <Tr key={withdrawal._id}>
                <Td>{withdrawal.userId}</Td>

                <Td color="red.400" fontWeight="bold">
                  -${withdrawal.amount}
                </Td>

                <Td>{withdrawal.walletAddress}</Td>

                <Td>
                  <Text
                    fontWeight="bold"
                    textTransform="capitalize"
                    color={
                      withdrawal.status === "approved"
                        ? "green.400"
                        : withdrawal.status === "rejected"
                          ? "red.400"
                          : "orange.400"
                    }
                  >
                    {withdrawal.status}
                  </Text>
                </Td>

                <Td>
                  {withdrawal.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        colorScheme="green"
                        mr={2}
                        onClick={() => approveWithdrawal(withdrawal._id)}
                      >
                        Approve
                      </Button>

                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => rejectWithdrawal(withdrawal._id)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}

export default AdminWithdrawals;
