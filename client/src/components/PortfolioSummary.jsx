import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import {
  FiBriefcase,
  FiDollarSign,
  FiLock,
  FiTrendingUp,
} from "react-icons/fi";
function PortfolioSummary({ balance, invested, profit, locked, active }) {
  const items = [
    {
      title: "Available Balance",
      value: `$${balance || 0}`,
      icon: FiDollarSign,
      color: "green.300",
      background: "rgba(34,197,94,0.10)",
    },
    {
      title: "Total Invested",
      value: `$${invested || 0}`,
      icon: FiTrendingUp,
      color: "blue.300",
      background: "rgba(59,130,246,0.10)",
    },
    {
      title: "Expected Profit",
      value: `$${profit || 0}`,
      icon: FiBriefcase,
      color: "purple.300",
      background: "rgba(168,85,247,0.10)",
    },
    {
      title: "Locked Funds",
      value: `$${locked || 0}`,
      icon: FiLock,
      color: "orange.300",
      background: "rgba(249,115,22,0.10)",
    },
  ];
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
      color="white"
    >
      {" "}
      <Box mb={{ base: 5, md: 6 }}>
        {" "}
        <Text fontSize={{ base: "md", md: "lg" }} fontWeight="700">
          {" "}
          Portfolio Summary{" "}
        </Text>{" "}
        <Text mt={1} fontSize="sm" color="gray.500">
          {" "}
          A snapshot of your current portfolio{" "}
        </Text>{" "}
      </Box>{" "}
      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={{ base: 3, md: 4 }}>
        {" "}
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Flex
              key={item.title}
              align="center"
              gap={3}
              minW="0"
              p={{ base: 3.5, md: 4 }}
              border="1px solid"
              borderColor="whiteAlpha.80"
              borderRadius={{ base: "14px", md: "16px" }}
              bg="whiteAlpha.30"
              transition="all 0.2s ease"
              _hover={{
                bg: "whiteAlpha.50",
                borderColor: "whiteAlpha.200",
                transform: "translateY(-2px)",
              }}
            >
              {" "}
              <Flex
                align="center"
                justify="center"
                w={{ base: "42px", md: "44px" }}
                h={{ base: "42px", md: "44px" }}
                flexShrink={0}
                borderRadius="13px"
                bg={item.background}
                color={item.color}
              >
                {" "}
                <Icon size={19} />{" "}
              </Flex>{" "}
              <Box minW="0">
                {" "}
                <Text fontSize="xs" color="gray.500" noOfLines={1}>
                  {" "}
                  {item.title}{" "}
                </Text>{" "}
                <Text
                  mt={1}
                  fontSize={{ base: "lg", md: "xl" }}
                  fontWeight="800"
                  letterSpacing="-0.02em"
                  noOfLines={1}
                >
                  {" "}
                  {item.value}{" "}
                </Text>{" "}
              </Box>{" "}
            </Flex>
          );
        })}{" "}
      </SimpleGrid>{" "}
      {active !== undefined && (
        <Flex
          align="center"
          justify="space-between"
          mt={{ base: 4, md: 5 }}
          px={4}
          py={3}
          borderRadius="14px"
          bg="whiteAlpha.30"
          border="1px solid"
          borderColor="whiteAlpha.80"
        >
          {" "}
          <Text fontSize="sm" color="gray.500">
            {" "}
            Active Investments{" "}
          </Text>{" "}
          <Text fontSize="sm" fontWeight="700" color="white">
            {" "}
            {active}{" "}
          </Text>{" "}
        </Flex>
      )}{" "}
    </Box>
  );
}
export default PortfolioSummary;
