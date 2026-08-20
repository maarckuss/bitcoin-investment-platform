import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

import { Box, Text } from "@chakra-ui/react";

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b"];

function PortfolioChart({ balance, invested, locked }) {
  const data = [
    {
      name: "Available",
      value: balance,
    },
    {
      name: "Invested",
      value: invested,
    },
    {
      name: "Locked",
      value: locked,
    },
  ];

  return (
    <Box
      bg="rgba(255,255,255,0.04)"
      border="1px solid rgba(255,255,255,0.08)"
      borderRadius="20px"
      p={6}
      h="420px"
    >
      <Text color="white" fontSize="xl" fontWeight="bold" mb={5}>
        Portfolio Allocation
      </Text>

      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={80}
            outerRadius={120}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default PortfolioChart;
