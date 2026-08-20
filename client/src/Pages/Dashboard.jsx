import { motion } from "framer-motion";
import { Box, Text, SimpleGrid, Spinner, VStack } from "@chakra-ui/react";
import DashboardCard from "../components/DashboardCard";
import RecentActivity from "../components/RecentActivity";
import PortfolioChart from "../components/PortfolioChart";
import PortfolioSummary from "../components/PortfolioSummary";
import AccountOverview from "../components/AccountOverview";
import BitcoinMarketChart from "../components/BitcoinMarketChart";

import SecurityPanel from "../components/SecurityPanel";
import { useEffect, useState } from "react";
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
      >
        <VStack spacing={4}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.700"
            color="blue.400"
            size="xl"
          />
          <Text color="gray.300">Loading dashboard...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box bg="transparent" minH="100vh" p={6}>
      <Box maxW="1200px" mx="auto">
        <Text fontSize="3xl" fontWeight="bold" mb={8}>
          Dashboard
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0 }}
            whileHover={{ scale: 1.05 }}
          >
            <DashboardCard
              title="Available Balance"
              value={`$${dashboard.balance || 0}`}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            whileHover={{ scale: 1.05 }}
          >
            <DashboardCard
              title="Portfolio Value"
              value={`$${dashboard.portfolioValue || 0}`}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <DashboardCard
              title="Total Invested"
              value={`$${dashboard.investedAmount || 0}`}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            whileHover={{ scale: 1.05 }}
          >
            <DashboardCard
              title="Expected Profit"
              value={`$${dashboard.expectedProfit || 0}`}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <DashboardCard
              title="Active Investments"
              value={dashboard.activeInvestments || 0}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <DashboardCard
              title="Total Deposits"
              value={`$${dashboard.totalDeposits || 0}`}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <DashboardCard
              title="Total Withdrawals"
              value={`$${dashboard.totalWithdrawals || 0}`}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            <DashboardCard
              title="Pending Deposits"
              value={dashboard.pendingDeposits || 0}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
          >
            <DashboardCard
              title="Pending Withdrawals"
              value={dashboard.pendingWithdrawals || 0}
            />
          </motion.div>
        </SimpleGrid>

        <Box mt={8}>
          <RecentActivity />
        </Box>

        <SimpleGrid
          mt={8}
          columns={{
            base: 1,
            lg: 2,
          }}
          spacing={6}
        >
          <SecurityPanel />

          <AccountOverview />
        </SimpleGrid>
        <Box mt={8}>
          <BitcoinMarketChart />
        </Box>

        <SimpleGrid
          mt={8}
          columns={{
            base: 1,
            lg: 2,
          }}
          spacing={6}
        >
          <RecentActivity />

          <SecurityPanel />
        </SimpleGrid>
      </Box>
    </Box>
  );
}

export default Dashboard;
