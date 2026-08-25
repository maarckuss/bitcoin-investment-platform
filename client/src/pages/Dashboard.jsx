import { motion } from "framer-motion";
import {
  Box,
  Flex,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import DashboardCard from "../components/DashboardCard";
import RecentActivity from "../components/RecentActivity";
import AccountOverview from "../components/AccountOverview";
import BitcoinMarketChart from "../components/BitcoinMarketChart";
import SecurityPanel from "../components/SecurityPanel";
import API from "../api/axios";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get("/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDashboard(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboard();
  }, []);

  if (!dashboard) {
    return (
      <Flex
        minH="calc(100vh - 96px)"
        align="center"
        justify="center"
        px={4}
        bg="#0b1220"
      >
        <VStack spacing={4}>
          <Spinner
            size="lg"
            thickness="3px"
            speed="0.7s"
            color="orange.300"
            emptyColor="whiteAlpha.200"
          />
          <Text color="gray.400" fontSize="sm">
            Loading your dashboard...
          </Text>
        </VStack>
      </Flex>
    );
  }

  const metrics = [
    {
      title: "Portfolio Value",
      value: `$${dashboard.portfolioValue || 0}`,
    },
    {
      title: "Total Invested",
      value: `$${dashboard.investedAmount || 0}`,
    },
    {
      title: "Expected Profit",
      value: `$${dashboard.expectedProfit || 0}`,
    },
    {
      title: "Active Investments",
      value: dashboard.activeInvestments || 0,
    },
    {
      title: "Total Deposits",
      value: `$${dashboard.totalDeposits || 0}`,
    },
    {
      title: "Total Withdrawals",
      value: `$${dashboard.totalWithdrawals || 0}`,
    },
    {
      title: "Pending Deposits",
      value: dashboard.pendingDeposits || 0,
    },
    {
      title: "Pending Withdrawals",
      value: dashboard.pendingWithdrawals || 0,
    },
  ];

  return (
    <Box
      minH="calc(100vh - 96px)"
      bg="#0b1220"
      px={{ base: 4, sm: 5, md: 6, lg: 8 }}
      py={{ base: 4, md: 6, lg: 8 }}
      overflowX="hidden"
    >
      <Box maxW="1280px" mx="auto" w="100%">
        <Flex
          direction={{ base: "column", md: "row" }}
          align={{ base: "flex-start", md: "flex-end" }}
          justify="space-between"
          gap={4}
          mb={{ base: 5, md: 8 }}
        >
          <Box>
            <Text
              fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
              fontWeight="800"
              letterSpacing="-0.02em"
            >
              Dashboard
            </Text>

            <Text
              mt={2}
              color="gray.500"
              fontSize={{ base: "sm", md: "md" }}
              maxW="620px"
            >
              Monitor your portfolio, investments, deposits, and account
              activity from one place.
            </Text>
          </Box>
        </Flex>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Box
            position="relative"
            overflow="hidden"
            p={{ base: 5, sm: 6, md: 7 }}
            mb={{ base: 5, md: 7 }}
            border="1px solid"
            borderColor="whiteAlpha.100"
            borderRadius={{ base: "18px", md: "24px" }}
            bg="linear-gradient(135deg, rgba(245,158,11,0.12), rgba(15,23,42,0.78) 45%, rgba(59,130,246,0.08))"
            boxShadow="0 20px 50px rgba(0,0,0,0.18)"
          >
            <Box
              position="absolute"
              top="-90px"
              right="-60px"
              w="220px"
              h="220px"
              borderRadius="full"
              bg="orange.400"
              opacity={0.08}
              filter="blur(80px)"
            />

            <Box position="relative">
              <Text
                fontSize="xs"
                fontWeight="700"
                textTransform="uppercase"
                letterSpacing="0.12em"
                color="gray.500"
              >
                Available Balance
              </Text>

              <Text
                mt={2}
                fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
                fontWeight="800"
                lineHeight="1"
                letterSpacing="-0.03em"
              >
                ${dashboard.balance || 0}
              </Text>

              <Text mt={3} color="gray.400" fontSize="sm">
                Available for investments and withdrawals
              </Text>
            </Box>
          </Box>
        </motion.div>

        <SimpleGrid
          columns={{ base: 1, sm: 2, xl: 4 }}
          spacing={{ base: 3, md: 4 }}
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: index * 0.04,
              }}
              whileHover={{ y: -3 }}
            >
              <DashboardCard
                title={metric.title}
                value={metric.value}
              />
            </motion.div>
          ))}
        </SimpleGrid>

        <Box mt={{ base: 5, md: 7 }}>
          <RecentActivity />
        </Box>

        <SimpleGrid
          mt={{ base: 5, md: 7 }}
          columns={{ base: 1, lg: 2 }}
          spacing={{ base: 5, md: 6 }}
        >
          <AccountOverview />
          <SecurityPanel />
        </SimpleGrid>

        <Box
          mt={{ base: 5, md: 7 }}
          w="100%"
          minW="0"
          overflow="hidden"
        >
          <BitcoinMarketChart />
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;