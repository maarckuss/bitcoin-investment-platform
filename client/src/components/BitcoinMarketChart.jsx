import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { Box, Text } from "@chakra-ui/react";

const bitcoinData = [
  {
    day: "Mon",
    price: 104200,
  },
  {
    day: "Tue",
    price: 105800,
  },
  {
    day: "Wed",
    price: 103900,
  },
  {
    day: "Thu",
    price: 108500,
  },
  {
    day: "Fri",
    price: 111200,
  },
  {
    day: "Sat",
    price: 109700,
  },
  {
    day: "Sun",
    price: 113400,
  },
];

function BitcoinMarketChart() {
  return (
    <Box
      bg="rgba(255,255,255,0.04)"
      border="1px solid rgba(255,255,255,0.08)"
      borderRadius="20px"
      p={6}
      color="white"
      h="400px"
    >
      <Text fontSize="xl" fontWeight="bold" mb={2}>
        Bitcoin Market Overview
      </Text>

      <Text fontSize="sm" color="gray.400" mb={6}>
        BTC price movement overview
      </Text>

      <ResponsiveContainer width="100%" height="75%">
        <AreaChart data={bitcoinData}>
          <XAxis dataKey="day" stroke="#94a3b8" />

          <YAxis stroke="#94a3b8" />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="price"
            stroke="#f59e0b"
            fill="rgba(245,158,11,0.25)"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default BitcoinMarketChart;
