import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Flex,
  SimpleGrid,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  TableContainer,
  VStack,
} from "@chakra-ui/react";
import API from "../api/axios";

function TransactionTable() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const getStatus = (status) => {
    if (status === "approved") {
      return {
        label: "Completed",
        colorScheme: "green",
      };
    }

    if (status === "pending") {
      return {
        label: "Pending",
        colorScheme: "orange",
      };
    }

    return {
      label: "Failed",
      colorScheme: "red",
    };
  };

  if (loading) {
    return (
      <Flex
        justify="center"
        align="center"
        py={12}
      >
        <VStack spacing={3}>
          <Spinner
            size="md"
            color="orange.300"
            thickness="3px"
          />
          <Text
            fontSize="sm"
            color="gray.500"
          >
            Loading transactions...
          </Text>
        </VStack>
      </Flex>
    );
  }

  if (transactions.length === 0) {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        py={{ base: 10, md: 14 }}
        textAlign="center"
      >
        <Box
          w="50px"
          h="50px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="15px"
          bg="whiteAlpha.100"
          color="gray.400"
          mb={4}
        >
          ↕
        </Box>

        <Text
          color="white"
          fontWeight="600"
          fontSize="md"
        >
          No transactions yet
        </Text>

        <Text
          mt={2}
          maxW="420px"
          color="gray.500"
          fontSize="sm"
          lineHeight="1.7"
        >
          Your deposits and withdrawals will appear here once
          activity begins.
        </Text>
      </Flex>
    );
  }

  return (
    <>
      <Box display={{ base: "none", md: "block" }}>
        <TableContainer>
          <Table
            variant="simple"
            color="white"
            size="md"
          >
            <Thead>
              <Tr>
                <Th
                  color="gray.500"
                  borderColor="whiteAlpha.100"
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="0.08em"
                >
                  Type
                </Th>

                <Th
                  color="gray.500"
                  borderColor="whiteAlpha.100"
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="0.08em"
                >
                  Amount
                </Th>

                <Th
                  color="gray.500"
                  borderColor="whiteAlpha.100"
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="0.08em"
                >
                  Status
                </Th>

                <Th
                  color="gray.500"
                  borderColor="whiteAlpha.100"
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="0.08em"
                >
                  Date
                </Th>
              </Tr>
            </Thead>

            <Tbody>
              {transactions.map((transaction) => {
                const isDeposit =
                  transaction.type === "deposit";
                const status = getStatus(
                  transaction.status,
                );

                return (
                  <Tr
                    key={transaction._id}
                    _hover={{
                      bg: "whiteAlpha.40",
                    }}
                    transition="background 0.2s ease"
                  >
                    <Td
                      borderColor="whiteAlpha.80"
                      color="gray.200"
                      textTransform="capitalize"
                    >
                      {transaction.type}
                    </Td>

                    <Td
                      borderColor="whiteAlpha.80"
                      color={
                        isDeposit
                          ? "green.300"
                          : "red.300"
                      }
                      fontWeight="700"
                    >
                      {isDeposit ? "+" : "-"}$
                      {Number(
                        transaction.amount,
                      ).toLocaleString("en-US")}
                    </Td>

                    <Td borderColor="whiteAlpha.80">
                      <Badge
                        colorScheme={
                          status.colorScheme
                        }
                        variant="subtle"
                        borderRadius="full"
                        px={2.5}
                        fontSize="10px"
                      >
                        {status.label}
                      </Badge>
                    </Td>

                    <Td
                      borderColor="whiteAlpha.80"
                      color="gray.500"
                    >
                      {transaction.createdAt
                        ? new Date(
                            transaction.createdAt,
                          ).toLocaleDateString()
                        : "N/A"}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      <VStack
        display={{ base: "flex", md: "none" }}
        spacing={3}
        align="stretch"
      >
        {transactions.map((transaction) => {
          const isDeposit =
            transaction.type === "deposit";
          const status = getStatus(
            transaction.status,
          );

          return (
            <Box
              key={transaction._id}
              p={4}
              borderRadius="15px"
              bg="whiteAlpha.30"
              border="1px solid"
              borderColor="whiteAlpha.80"
            >
              <Flex
                align="flex-start"
                justify="space-between"
                gap={3}
              >
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="700"
                    color="white"
                    textTransform="capitalize"
                  >
                    {transaction.type}
                  </Text>

                  <Text
                    mt={1}
                    fontSize="xs"
                    color="gray.500"
                  >
                    {transaction.createdAt
                      ? new Date(
                          transaction.createdAt,
                        ).toLocaleDateString()
                      : "N/A"}
                  </Text>
                </Box>

                <Text
                  fontSize="md"
                  fontWeight="800"
                  color={
                    isDeposit
                      ? "green.300"
                      : "red.300"
                  }
                >
                  {isDeposit ? "+" : "-"}$
                  {Number(
                    transaction.amount,
                  ).toLocaleString("en-US")}
                </Text>
              </Flex>

              <Flex
                justify="space-between"
                align="center"
                mt={4}
                pt={3}
                borderTop="1px solid"
                borderColor="whiteAlpha.80"
              >
                <Text
                  fontSize="xs"
                  color="gray.500"
                >
                  Status
                </Text>

                <Badge
                  colorScheme={status.colorScheme}
                  variant="subtle"
                  borderRadius="full"
                  px={2.5}
                  fontSize="10px"
                >
                  {status.label}
                </Badge>
              </Flex>
            </Box>
          );
        })}
      </VStack>
    </>
  );
}

export default TransactionTable;