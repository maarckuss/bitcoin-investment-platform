import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  Spinner,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  FiActivity,
  FiArrowRight,
  FiDownload,
  FiFileText,
  FiTrendingUp,
  FiUpload,
  FiUsers,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/axios";

function Admin() {
  const navigate = useNavigate();
  const toast = useToast();

  const [stats, setStats] = useState({
    users: 0,
    deposits: 0,
    withdrawals: 0,
    pendingDeposits: 0,
    pendingWithdrawals: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [users, transactions] = await Promise.all([
          API.get("/users", { headers }),
          API.get("/admin/transactions", { headers }),
        ]);

        const deposits = transactions.data.deposits || [];
        const withdrawals = transactions.data.withdrawals || [];

        setStats({
          users: users.data.length,
          deposits: deposits.filter(
            (item) => item.status === "approved",
          ).length,
          withdrawals: withdrawals.filter(
            (item) => item.status === "approved",
          ).length,
          pendingDeposits: deposits.filter(
            (item) => item.status === "pending",
          ).length,
          pendingWithdrawals: withdrawals.filter(
            (item) => item.status === "pending",
          ).length,
        });
      } catch (err) {
        console.error(err);

        toast({
          title: "Unable to load admin statistics",
          description:
            err.response?.data?.message ||
            "Please try again later.",
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "top",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [toast]);

  const cards = [
    {
      title: "Total users",
      value: stats.users,
      icon: FiUsers,
      color: "purple.300",
      bg: "rgba(168,85,247,0.10)",
    },
    {
      title: "Approved deposits",
      value: stats.deposits,
      icon: FiDownload,
      color: "green.300",
      bg: "rgba(34,197,94,0.10)",
    },
    {
      title: "Approved withdrawals",
      value: stats.withdrawals,
      icon: FiUpload,
      color: "red.300",
      bg: "rgba(239,68,68,0.10)",
    },
    {
      title: "Pending deposits",
      value: stats.pendingDeposits,
      icon: FiTrendingUp,
      color: "orange.300",
      bg: "rgba(245,158,11,0.10)",
    },
    {
      title: "Pending withdrawals",
      value: stats.pendingWithdrawals,
      icon: FiFileText,
      color: "blue.300",
      bg: "rgba(59,130,246,0.10)",
    },
  ];

  const actions = [
    {
      label: "Manage users",
      description: "Review and manage platform accounts",
      icon: FiUsers,
      path: "/admin/users",
      color: "purple.300",
    },
    {
      label: "Review deposits",
      description: "Approve or reject deposit requests",
      icon: FiDownload,
      path: "/admin/deposits",
      color: "green.300",
    },
    {
      label: "Review withdrawals",
      description: "Process pending withdrawal requests",
      icon: FiUpload,
      path: "/admin/withdrawals",
      color: "red.300",
    },
    {
      label: "Manage investments",
      description: "Create and manage investment plans",
      icon: FiTrendingUp,
      path: "/admin/investments",
      color: "blue.300",
    },
    {
      label: "Activity logs",
      description: "Monitor important platform activity",
      icon: FiActivity,
      path: "/admin/logs",
      color: "orange.300",
    },
  ];

  if (loading) {
    return (
      <Flex
        minH="calc(100vh - 96px)"
        align="center"
        justify="center"
        bg="#0b1220"
      >
        <VStack spacing={4}>
          <Spinner
            size="lg"
            thickness="3px"
            color="orange.300"
            emptyColor="whiteAlpha.200"
          />
          <Text color="gray.500" fontSize="sm">
            Loading admin dashboard...
          </Text>
        </VStack>
      </Flex>
    );
  }

  return (
    <Box
      minH="calc(100vh - 96px)"
      bg="#0b1220"
      px={{ base: 4, sm: 5, md: 6, lg: 8 }}
      py={{ base: 5, md: 7, lg: 8 }}
      overflowX="hidden"
    >
      <Box maxW="1280px" mx="auto" w="100%">
        <Box mb={{ base: 5, md: 7 }}>
          <Text
            fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
            fontWeight="800"
            color="white"
            letterSpacing="-0.03em"
          >
            Admin dashboard
          </Text>

          <Text
            mt={2}
            maxW="700px"
            color="gray.500"
            fontSize={{ base: "sm", md: "md" }}
            lineHeight="1.7"
          >
            Monitor users, transactions, investment activity, and
            operational tasks from one place.
          </Text>
        </Box>

        <SimpleGrid
          columns={{ base: 1, sm: 2, xl: 5 }}
          spacing={{ base: 3, md: 4 }}
        >
          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.04,
                }}
                whileHover={{ y: -3 }}
              >
                <Box
                  h="100%"
                  p={{ base: 4, md: 5 }}
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  borderRadius="17px"
                  bg="rgba(255,255,255,0.035)"
                  backdropFilter="blur(12px)"
                  boxShadow="0 10px 30px rgba(0,0,0,0.14)"
                >
                  <Flex
                    align="center"
                    justify="center"
                    w="40px"
                    h="40px"
                    mb={4}
                    borderRadius="12px"
                    bg={card.bg}
                    color={card.color}
                  >
                    <Icon size={18} />
                  </Flex>

                  <Text
                    fontSize="xs"
                    fontWeight="600"
                    color="gray.500"
                    textTransform="uppercase"
                    letterSpacing="0.07em"
                  >
                    {card.title}
                  </Text>

                  <Text
                    mt={2}
                    fontSize={{ base: "2xl", md: "3xl" }}
                    fontWeight="800"
                    color="white"
                    letterSpacing="-0.03em"
                  >
                    {card.value}
                  </Text>
                </Box>
              </motion.div>
            );
          })}
        </SimpleGrid>

        <Box
          mt={{ base: 5, md: 7 }}
          p={{ base: 4, sm: 5, md: 6 }}
          border="1px solid"
          borderColor="whiteAlpha.100"
          borderRadius={{ base: "18px", md: "22px" }}
          bg="rgba(255,255,255,0.035)"
          backdropFilter="blur(12px)"
          boxShadow="0 12px 34px rgba(0,0,0,0.15)"
        >
          <Box mb={5}>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="700"
              color="white"
            >
              Quick management
            </Text>

            <Text
              mt={1}
              fontSize="sm"
              color="gray.500"
            >
              Jump directly to the tasks that need attention.
            </Text>
          </Box>

          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            spacing={3}
          >
            {actions.map((action) => {
              const Icon = action.icon;

              return (
                <Button
                  key={action.path}
                  h="auto"
                  minH="68px"
                  p={3.5}
                  justifyContent="flex-start"
                  textAlign="left"
                  variant="ghost"
                  border="1px solid"
                  borderColor="whiteAlpha.80"
                  borderRadius="14px"
                  color="white"
                  onClick={() => navigate(action.path)}
                  _hover={{
                    bg: "whiteAlpha.50",
                    borderColor: "whiteAlpha.200",
                    transform: "translateY(-1px)",
                  }}
                >
                  <Flex
                    align="center"
                    w="100%"
                    gap={3}
                  >
                    <Flex
                      align="center"
                      justify="center"
                      w="40px"
                      h="40px"
                      flexShrink={0}
                      borderRadius="12px"
                      bg={`${action.color.replace(
                        ".300",
                        "",
                      )}.500`}
                      color={action.color}
                    >
                      <Icon size={18} />
                    </Flex>

                    <Box minW="0" flex="1">
                      <Text
                        fontSize="sm"
                        fontWeight="600"
                        noOfLines={1}
                      >
                        {action.label}
                      </Text>

                      <Text
                        mt={1}
                        fontSize="xs"
                        color="gray.500"
                        fontWeight="400"
                        noOfLines={1}
                      >
                        {action.description}
                      </Text>
                    </Box>

                    <Box
                      color="gray.600"
                      flexShrink={0}
                    >
                      <FiArrowRight size={16} />
                    </Box>
                  </Flex>
                </Button>
              );
            })}
          </SimpleGrid>
        </Box>
      </Box>
    </Box>
  );
}

export default Admin;