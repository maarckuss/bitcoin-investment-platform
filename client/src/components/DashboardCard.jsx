import { Box, Flex, Text } from "@chakra-ui/react";
import {
  FiArrowUpRight,
  FiClock,
  FiDollarSign,
  FiTrendingUp,
} from "react-icons/fi";

function DashboardCard({ title, value }) {
  let icon = <FiDollarSign size={19} />;
  let iconColor = "green.300";
  let glowColor = "rgba(34,197,94,0.18)";

  if (title.includes("Deposit")) {
    icon = <FiTrendingUp size={19} />;
    iconColor = "blue.300";
    glowColor = "rgba(59,130,246,0.18)";
  }

  if (title.includes("Withdrawal")) {
    icon = <FiArrowUpRight size={19} />;
    iconColor = "red.300";
    glowColor = "rgba(239,68,68,0.18)";
  }

  if (title.includes("Pending")) {
    icon = <FiClock size={19} />;
    iconColor = "orange.300";
    glowColor = "rgba(251,146,60,0.18)";
  }

  return (
    <Box
      h="100%"
      minW="0"
      p={{ base: 4, sm: 5, md: 5 }}
      border="1px solid"
      borderColor="whiteAlpha.100"
      borderRadius={{ base: "16px", md: "18px" }}
      bg="rgba(255,255,255,0.035)"
      backdropFilter="blur(12px)"
      boxShadow="0 10px 30px rgba(0,0,0,0.14)"
      transition="all 0.2s ease"
      _hover={{
        transform: "translateY(-3px)",
        borderColor: "whiteAlpha.200",
        boxShadow: "0 16px 34px rgba(0,0,0,0.20)",
        bg: "rgba(255,255,255,0.05)",
      }}
    >
      <Flex
        align="center"
        justify="space-between"
        gap={3}
        mb={{ base: 4, md: 5 }}
      >
        <Text
          minW="0"
          fontSize={{ base: "xs", md: "sm" }}
          fontWeight="600"
          color="gray.500"
          textTransform="uppercase"
          letterSpacing="0.08em"
          noOfLines={1}
        >
          {title}
        </Text>

        <Flex
          flexShrink={0}
          align="center"
          justify="center"
          w={{ base: "38px", md: "40px" }}
          h={{ base: "38px", md: "40px" }}
          borderRadius="12px"
          bg="whiteAlpha.50"
          color={iconColor}
          boxShadow={`0 0 22px ${glowColor}`}
        >
          {icon}
        </Flex>
      </Flex>

      <Text
        fontSize={{ base: "2xl", sm: "3xl" }}
        fontWeight="800"
        letterSpacing="-0.03em"
        lineHeight="1.05"
        color="white"
        noOfLines={1}
      >
        {value}
      </Text>
    </Box>
  );
}

export default DashboardCard;