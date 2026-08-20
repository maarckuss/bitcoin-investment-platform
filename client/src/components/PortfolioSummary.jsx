import { Box, Text, SimpleGrid, Flex } from "@chakra-ui/react";
import {
  FiDollarSign,
  FiTrendingUp,
  FiBriefcase,
  FiLock,
} from "react-icons/fi";

function PortfolioSummary({
  balance,
  invested,
  profit,
  locked,
  active,
}) {
  const items = [
    {
      title: "Available Balance",
      value: `$${balance}`,
      icon: <FiDollarSign />,
      color: "green.400",
    },
    {
      title: "Total Invested",
      value: `$${invested}`,
      icon: <FiTrendingUp />,
      color: "blue.400",
    },
    {
      title: "Expected Profit",
      value: `$${profit}`,
      icon: <FiBriefcase />,
      color: "purple.400",
    },
    {
      title: "Locked Funds",
      value: `$${locked}`,
      icon: <FiLock />,
      color: "orange.400",
    },
  ];

  return (
    <Box
      bg="rgba(255,255,255,0.04)"
      border="1px solid rgba(255,255,255,0.08)"
      borderRadius="20px"
      p={6}
      color="white"
    >
      <Text
        fontSize="xl"
        fontWeight="bold"
        mb={6}
      >
        Portfolio Summary
      </Text>

      <SimpleGrid
        columns={{
          base: 1,
          sm: 2,
        }}
        spacing={5}
      >
        {items.map((item) => (
          <Flex
            key={item.title}
            p={4}
            borderRadius="15px"
            bg="rgba(255,255,255,0.05)"
            align="center"
            gap={4}
          >
            <Box
              p={3}
              borderRadius="12px"
              bg="rgba(255,255,255,0.08)"
              color={item.color}
              fontSize="22px"
            >
              {item.icon}
            </Box>

            <Box>
              <Text
                fontSize="sm"
                color="gray.400"
              >
                {item.title}
              </Text>

              <Text
                fontSize="xl"
                fontWeight="bold"
              >
                {item.value}
              </Text>
            </Box>
          </Flex>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default PortfolioSummary;