import { Box, Text } from "@chakra-ui/react";
import WithdrawalForm from "../components/WithdrawalForm";

function Withdrawal() {
  return (
    <Box p={8} minH="100vh" bg="transparent">
      <Box maxW="1200px" mx="auto">
        <Text fontSize="3xl" fontWeight="bold" color="white">
          Withdraw Crypto
        </Text>

        <Text color="gray.400" mb={6}>
          Request a withdrawal from your wallet
        </Text>

        <WithdrawalForm />
      </Box>
    </Box>
  );
}

export default Withdrawal;
