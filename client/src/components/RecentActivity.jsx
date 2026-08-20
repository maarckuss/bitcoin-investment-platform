import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import { Box, Heading, Text, VStack, HStack, Badge } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";

const getActivityTitle = (transaction) => {
  if (transaction.type === "deposit") {
    return "Bitcoin Deposit";
  }

  if (transaction.type === "withdrawal") {
    return "Withdrawal Request";
  }

  return "Account Activity";
};
const getStatusLabel = (status) => {
  if (status === "approved") {
    return "Completed";
  }

  if (status === "pending") {
    return "Pending Review";
  }

  if (status === "rejected") {
    return "Failed";
  }

  return status;
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

  return (
    <Box
      mt={10}
      p={6}
      borderRadius="20px"
      bg="rgba(255,255,255,0.04)"
      border="1px solid rgba(255,255,255,0.08)"
      boxShadow="0 8px 24px rgba(0,0,0,0.25)"
    >
      <Heading size="md" color="white" mb={5}>
        Recent Activity
      </Heading>

      <VStack spacing={4} align="stretch">
        {transactions.length === 0 ? (
          <Box textAlign="center" py={10}>
            <Box fontSize="4xl" mb={4}>
              📊
            </Box>

            <Text color="white" fontWeight="bold" fontSize="lg" mb={2}>
              No activity yet
            </Text>

            <Text color="gray.400" fontSize="sm">
              Your deposits, withdrawals, and investments will appear here.
            </Text>
          </Box>
        ) : (
          transactions
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map((transaction) => (
              <Box key={transaction._id} position="relative">
                <motion.div
                  initial={{
                    opacity: 0,
                    x: -20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    duration: 0.35,
                  }}
                >
                  <HStack align="flex-start" spacing={5}>
                    {/* Timeline Icon */}
                    <Box position="relative">
                      <Box
                        p={3}
                        borderRadius="full"
                        bg={
                          transaction.type === "deposit"
                            ? "green.500"
                            : "red.500"
                        }
                        color="white"
                        boxShadow={
                          transaction.type === "deposit"
                            ? "0 0 20px rgba(34,197,94,0.5)"
                            : "0 0 20px rgba(239,68,68,0.5)"
                        }
                      >
                        {transaction.type === "deposit" ? (
                          <FiArrowDownLeft />
                        ) : (
                          <FiArrowUpRight />
                        )}
                      </Box>

                      <Box
                        position="absolute"
                        top="45px"
                        left="50%"
                        transform="translateX(-50%)"
                        height="65px"
                        width="2px"
                        bg="rgba(255,255,255,0.15)"
                      />
                    </Box>

                    {/* Activity Content */}
                    <Box
                      flex="1"
                      p={4}
                      borderRadius="16px"
                      bg="rgba(255,255,255,0.04)"
                      border="1px solid rgba(255,255,255,0.08)"
                      _hover={{
                        bg: "rgba(255,255,255,0.07)",
                      }}
                    >
                      <HStack justify="space-between">
                        <Box>
                          <Text
                            color="white"
                            fontWeight="bold"
                            textTransform="capitalize"
                          >
                            {getActivityTitle(transaction)}
                          </Text>

                          <Text fontSize="sm" color="gray.400">
                            {new Date(transaction.createdAt).toLocaleString()}
                          </Text>
                        </Box>

                        <Box textAlign="right">
                          <Text
                            fontWeight="bold"
                            color={
                              transaction.type === "deposit"
                                ? "green.400"
                                : "red.400"
                            }
                          >
                            {transaction.type === "deposit" ? "+" : "-"}$
                            {transaction.amount}
                          </Text>

                          <Badge
                            colorScheme={
                              transaction.status === "approved"
                                ? "green"
                                : transaction.status === "pending"
                                  ? "orange"
                                  : "red"
                            }
                          >
                            {getStatusLabel(transaction.status)}
                          </Badge>
                        </Box>
                      </HStack>
                    </Box>
                  </HStack>
                </motion.div>
              </Box>
            ))
        )}
      </VStack>
    </Box>
  );
}

export default RecentActivity;
