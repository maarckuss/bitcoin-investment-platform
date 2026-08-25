import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Box, Flex, Text } from "@chakra-ui/react";

const bitcoinData = [
  { day: "Mon", price: 104200 },
  { day: "Tue", price: 105800 },
  { day: "Wed", price: 103900 },
  { day: "Thu", price: 108500 },
  { day: "Fri", price: 111200 },
  { day: "Sat", price: 109700 },
  { day: "Sun", price: 113400 },
];

const formatPrice = (value) =>
  `$${Number(value).toLocaleString("en-US")}`;

function BitcoinMarketChart() {
  return (
    <Box
      w="100%"
      minW="0"
      p={{ base: 4, sm: 5, md: 6 }}
      border="1px solid"
      borderColor="whiteAlpha.100"
      borderRadius={{ base: "16px", md: "20px" }}
      bg="rgba(255,255,255,0.035)"
      backdropFilter="blur(12px)"
      boxShadow="0 10px 30px rgba(0,0,0,0.14)"
      color="white"
    >
      <Flex
        direction={{ base: "column", sm: "row" }}
        align={{ base: "flex-start", sm: "center" }}
        justify="space-between"
        gap={3}
        mb={5}
      >
        <Box>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="700"
          >
            Bitcoin Market Overview
          </Text>

          <Text
            mt={1}
            fontSize="sm"
            color="gray.500"
          >
            BTC price movement over the last 7 days
          </Text>
        </Box>

        <Box
          px={3}
          py={1.5}
          borderRadius="full"
          bg="rgba(245,158,11,0.10)"
          border="1px solid"
          borderColor="rgba(245,158,11,0.16)"
        >
          <Text
            fontSize="xs"
            fontWeight="600"
            color="orange.300"
          >
            BTC / USD
          </Text>
        </Box>
      </Flex>

      <Box
        h={{ base: "250px", sm: "285px", md: "320px" }}
        w="100%"
        minW="0"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={bitcoinData}
            margin={{
              top: 8,
              right: 4,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient
                id="bitcoinArea"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#f59e0b"
                  stopOpacity={0.28}
                />
                <stop
                  offset="100%"
                  stopColor="#f59e0b"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 11 }}
              padding={{ left: 6, right: 6 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 11 }}
              tickFormatter={(value) =>
                `$${Math.round(value / 1000)}k`
              }
              width={42}
            />

            <Tooltip
              cursor={{
                stroke: "rgba(255,255,255,0.12)",
              }}
              contentStyle={{
                background: "#111827",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: "12px",
                color: "#fff",
                boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
              }}
              labelStyle={{
                color: "#94a3b8",
                marginBottom: "4px",
              }}
              formatter={(value) => [
                formatPrice(value),
                "BTC Price",
              ]}
            />

            <Area
              type="monotone"
              dataKey="price"
              stroke="#f59e0b"
              fill="url(#bitcoinArea)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 4,
                strokeWidth: 2,
                fill: "#0b1220",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}

export default BitcoinMarketChart;