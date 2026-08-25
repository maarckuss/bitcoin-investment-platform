import { FiArrowDownLeft, FiArrowUpRight, FiActivity } from "react-icons/fi";
import {
  Badge,
  Box,
  Flex,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";

const getActivityTitle = (transaction) => {
  if (transaction.type === "deposit") return "Bitcoin Deposit";
  if (transaction.type === "withdrawal") return "Withdrawal Request";
  return "Account Activity";
};

const getStatus = (status) => {
  if (status === "approved") {
    return {
      label: "Completed",
      colorScheme: "green",
    };
  }

  if (status === "pending") {
    return {
      label: "Pending Review",
      colorScheme: "orange",
    };
  }

  if (status === "rejected") {
    return {
      label: "Failed",
      colorScheme: "red",
    };
  }

  return {
    label: status,
    colorScheme: "gray",
  };
};

function RecentActivity() {
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

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <Box
      w="100%"
      p={{ base: 4, sm: 5, md: 6 }}
      border="1px solid"
      borderColor="whiteAlpha.100"
      borderRadius={{ base: "16px", md: "20px" }}
      bg="rgba(255,255,255,0.035)"
      backdropFilter="blur(12px)"
      boxShadow="0 10px 30px rgba(0,0,0,0.14)"
    >
      <Flex
        align={{ base: "flex-start", sm: "center" }}
        justify="space-between"
        direction={{ base: "column", sm: "row" }}
        gap={2}
        mb={5}
      >
        <Box>
          <Heading
            size={{ base: "sm", md: "md" }}
            color="white"
            fontWeight="700"
          >
            Recent Activity
          </Heading>

          <Text
            mt={1}
            fontSize="sm"
            color="gray.500"
          >
            Your latest account transactions
          </Text>
        </Box>
      </Flex>

      {recentTransactions.length === 0 ? (
        <Flex
          direction="column"
          align="center"
          justify="center"
          py={{ base: 8, md: 12 }}
          px={4}
          textAlign="center"
        >
          <Flex
            align="center"
            justify="center"
            w="52px"
            h="52px"
            mb={4}
            borderRadius="16px"
            bg="whiteAlpha.100"
            color="gray.400"
          >
            <FiActivity size={22} />
          </Flex>

          <Text
            color="white"
            fontWeight="600"
            fontSize="md"
          >
            No activity yet
          </Text>

          <Text
            mt={2}
            maxW="420px"
            color="gray.500"
            fontSize="sm"
            lineHeight="1.7"
          >
            Your deposits, withdrawals, and account activity will appear
            here.
          </Text>
        </Flex>
      ) : (
        <VStack spacing={3} align="stretch">
          {recentTransactions.map((transaction, index) => {
            const isDeposit = transaction.type === "deposit";
            const status = getStatus(transaction.status);

            return (
              <motion.div
                key={transaction._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                }}
              >
                <Flex
                  align={{ base: "flex-start", sm: "center" }}
                  gap={{ base: 3, sm: 4 }}
                  p={{ base: 3, sm: 4 }}
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  borderRadius={{ base: "14px", md: "16px" }}
                  bg="whiteAlpha.30"
                  transition="all 0.2s ease"
                  _hover={{
                    bg: "whiteAlpha.50",
                    borderColor: "whiteAlpha.200",
                  }}
                >
                  <Flex
                    flexShrink={0}
                    align="center"
                    justify="center"
                    w={{ base: "40px", sm: "44px" }}
                    h={{ base: "40px", sm: "44px" }}
                    borderRadius="14px"
                    bg={
                      isDeposit
                        ? "rgba(34,197,94,0.12)"
                        : "rgba(239,68,68,0.12)"
                    }
                    color={isDeposit ? "green.300" : "red.300"}
                  >
                    {isDeposit ? (
                      <FiArrowDownLeft size={19} />
                    ) : (
                      <FiArrowUpRight size={19} />
                    )}
                  </Flex>

                  <Box flex="1" minW="0">
                    <Text
                      color="white"
                      fontSize={{ base: "sm", md: "md" }}
                      fontWeight="600"
                      noOfLines={1}
                    >
                      {getActivityTitle(transaction)}
                    </Text>

                    <Text
                      mt={1}
                      color="gray.500"
                      fontSize="xs"
                      noOfLines={1}
                    >
                      {new Date(transaction.createdAt).toLocaleString()}
                    </Text>
                  </Box>

                  <Flex
                    direction="column"
                    align="flex-end"
                    gap={1.5}
                    flexShrink={0}
                  >
                    <Text
                      fontSize={{ base: "sm", md: "md" }}
                      fontWeight="700"
                      color={isDeposit ? "green.300" : "red.300"}
                      whiteSpace="nowrap"
                    >
                      {isDeposit ? "+" : "-"}${transaction.amount}
                    </Text>

                    <Badge
                      colorScheme={status.colorScheme}
                      variant="subtle"
                      borderRadius="full"
                      px={2}
                      fontSize="10px"
                    >
                      {status.label}
                    </Badge>
                  </Flex>
                </Flex>
              </motion.div>
            );
          })}
        </VStack>
      )}
    </Box>
  );
}

export default RecentActivity;