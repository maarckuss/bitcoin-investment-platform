import { Box, Text, Flex } from "@chakra-ui/react";
import {
  FiDollarSign,
  FiTrendingUp,
  FiArrowUpRight,
  FiClock,
} from "react-icons/fi";
function DashboardCard({ title, value }) {
  let icon = <FiDollarSign size={22} />;
  let iconColor = "green.400";
let glowColor = "rgba(34,197,94,0.35)";

  if (title.includes("Deposit")) {
    icon = <FiTrendingUp size={22} />;
    iconColor = "blue.400";
glowColor = "rgba(59,130,246,0.35)";
  }

  if (title.includes("Withdrawal")) {
    icon = <FiArrowUpRight size={22} />;
    iconColor = "red.400";
glowColor = "rgba(239,68,68,0.35)";
  }

  if (title.includes("Pending")) {
    icon = <FiClock size={22} />;
    iconColor = "orange.400";
glowColor = "rgba(251,146,60,0.35)";
  }
  return (
    <Box
      p={6}
      borderRadius="20px"
      bg="rgba(255,255,255,0.04)"
      border="1px solid rgba(255,255,255,0.08)"
      color="white"
      transition="all 0.3s ease"
      boxShadow="0 8px 24px rgba(0,0,0,0.25)"
      _hover={{
        transform: "translateY(-8px)",
        boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
        borderColor: "blue.400",
      }}
    >
      <Flex justify="space-between" align="center" mb={4}>
        <Text
          fontSize="sm"
          color="gray.400"
          textTransform="uppercase"
          letterSpacing="1px"
        >
          {title}
        </Text>

        <Box
  p={2.5}
  borderRadius="12px"
  bg="rgba(255,255,255,0.06)"
  color={iconColor}
  boxShadow={`0 0 18px ${glowColor}`}
>
  {icon}
</Box>
      </Flex>

      <Text fontSize="3xl" fontWeight="bold" color="white">
        {value}
      </Text>
    </Box>
  );
}

export default DashboardCard;
