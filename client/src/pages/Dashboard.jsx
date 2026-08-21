import { motion } from "framer-motion";
import {
  Box,
  Text,
  SimpleGrid,
  Spinner,
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
      <Box
        minH="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        bg="#0b1220"
        px={4}
      >
        <VStack spacing={4}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.700"
            color="blue.400"
            size="xl"
          />
          <Text color="gray.300" fontSize="sm">
            Loading dashboard...
          </Text>
        </VStack>
      </Box>
    );
  }

  const cards = [
    {
      title: "Available Balance",
      value: `$${dashboard.balance || 0}`,
    },
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
      bg="#0b1220"
      minH="100vh"
      px={{ base: 4, sm: 5, md: 6 }}
      py={{ base: 4, md: 6 }}
      overflowX="hidden"
    >
      <Box
        maxW="1200px"
        mx="auto"
        w="100%"
      >
        <Box mb={{ base: 5, md: 8 }}>
          <Text
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="bold"
          >
            Dashboard
          </Text>

          <Text
            mt={1}
            fontSize={{ base: "sm", md: "md" }}
            color="gray.400"
          >
            Welcome back. Here's an overview of your account.
          </Text>
        </Box>

        <SimpleGrid
          columns={{
            base: 1,
            sm: 2,
            xl: 3,
          }}
          spacing={{ base: 3, md: 5 }}
        >
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: index * 0.04,
              }}
              whileHover={{
                y: -3,
              }}
            >
              <DashboardCard
                title={card.title}
                value={card.value}
              />
            </motion.div>
          ))}
        </SimpleGrid>

        <Box mt={{ base: 5, md: 8 }}>
          <RecentActivity />
        </Box>

        <SimpleGrid
          mt={{ base: 5, md: 8 }}
          columns={{
            base: 1,
            lg: 2,
          }}
          spacing={{ base: 5, md: 6 }}
        >
          <SecurityPanel />
          <AccountOverview />
        </SimpleGrid>

        <Box
          mt={{ base: 5, md: 8 }}
          w="100%"
          overflow="hidden"
        >
          <BitcoinMarketChart />
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;