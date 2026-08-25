import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b"];

function PortfolioChart({ balance = 0, invested = 0, locked = 0 }) {
  const data = [
    {
      name: "Available",
      value: Number(balance) || 0,
    },
    {
      name: "Invested",
      value: Number(invested) || 0,
    },
    {
      name: "Locked",
      value: Number(locked) || 0,
    },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

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
      <Box mb={4}>
        <Text
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="700"
        >
          Portfolio Allocation
        </Text>

        <Text
          mt={1}
          fontSize="sm"
          color="gray.500"
        >
          How your current portfolio is distributed
        </Text>
      </Box>

      <Flex
        position="relative"
        h={{ base: "250px", sm: "280px", md: "310px" }}
        align="center"
        justify="center"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="58%"
              outerRadius="78%"
              paddingAngle={4}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => [
                `$${Number(value).toLocaleString("en-US")}`,
                "Value",
              ]}
              contentStyle={{
                background: "#111827",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: "12px",
                color: "#fff",
                boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          textAlign="center"
          pointerEvents="none"
        >
          <Text
            fontSize="xs"
            color="gray.500"
            mb={1}
          >
            Total
          </Text>

          <Text
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight="800"
          >
            ${total.toLocaleString("en-US")}
          </Text>
        </Box>
      </Flex>

      <SimpleGrid
        columns={3}
        spacing={{ base: 2, sm: 3 }}
        mt={2}
      >
        {data.map((item, index) => {
          const percentage =
            total > 0 ? Math.round((item.value / total) * 100) : 0;

          return (
            <Box
              key={item.name}
              minW="0"
              p={{ base: 2.5, sm: 3 }}
              borderRadius="12px"
              bg="whiteAlpha.30"
              border="1px solid"
              borderColor="whiteAlpha.80"
            >
              <Flex
                align="center"
                gap={2}
                mb={1}
              >
                <Box
                  w="7px"
                  h="7px"
                  flexShrink={0}
                  borderRadius="full"
                  bg={COLORS[index]}
                />

                <Text
                  fontSize="xs"
                  color="gray.500"
                  noOfLines={1}
                >
                  {item.name}
                </Text>
              </Flex>

              <Text
                fontSize={{ base: "sm", sm: "md" }}
                fontWeight="700"
              >
                {percentage}%
              </Text>
            </Box>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}

export default PortfolioChart;