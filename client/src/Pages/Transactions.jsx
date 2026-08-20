import { Box, Text } from "@chakra-ui/react";
import TransactionTable from "../components/TransactionTable";

function Transactions() {
  return (
    <Box
      p={8}
      flex={1}
      minH="100vh"
      bg="transparent"
    >
      <Box maxW="1200px" mx="auto">
        <Text
          fontSize="3xl"
          fontWeight="bold"
          color="white"
        >
          Transaction History
        </Text>

        <Text
          fontSize="sm"
          color="gray.400"
          mb={6}
        >
          All deposits and withdrawals in one place
        </Text>

        <Box
          p={6}
          borderRadius="20px"
          bg="rgba(255,255,255,0.04)"
          border="1px solid rgba(255,255,255,0.08)"
          boxShadow="0 8px 24px rgba(0,0,0,0.25)"
        >
          <TransactionTable />
        </Box>
      </Box>
    </Box>
  );
}

export default Transactions;