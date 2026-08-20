import { useEffect, useState } from "react";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  TableContainer,
} from "@chakra-ui/react";

import API from "../api/axios";
function TransactionTable() {
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get("/transactions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTransactions(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTransactions();
  }, []);
  return (
    <TableContainer>
      <Table variant="simple" color="white">
        <Thead bg="rgba(255,255,255,0.04)">
          <Tr>
            <Th color="gray.300">Type</Th>
            <Th color="gray.300">Amount</Th>
            <Th color="gray.300">Status</Th>
            <Th color="gray.300">Date</Th>
          </Tr>
        </Thead>

        <Tbody>
          {transactions.map((transaction) => (
            <Tr
              key={transaction._id}
              _hover={{
                bg: "rgba(255,255,255,0.05)",
              }}
            >
              <Td>{transaction.type}</Td>

              <Td
                color={transaction.type === "deposit" ? "green.400" : "red.400"}
                fontWeight="bold"
              >
                {transaction.type === "deposit" ? "+" : "-"}$
                {transaction.amount}
              </Td>

              <Td>
                <Badge
                  colorScheme={
                    transaction.status === "approved"
                      ? "green"
                      : transaction.status === "pending"
                        ? "yellow"
                        : "red"
                  }
                >
                  {transaction.status}
                </Badge>
              </Td>

              <Td>
                {transaction.createdAt
                  ? new Date(transaction.createdAt).toLocaleDateString()
                  : "N/A"}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default TransactionTable;
