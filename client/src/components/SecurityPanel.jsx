import { Box, Text, VStack, HStack } from "@chakra-ui/react";

import { FiShield, FiCheckCircle, FiLock } from "react-icons/fi";

function SecurityPanel() {
  return (
    <Box
      p={6}
      borderRadius="20px"
      bg="rgba(255,255,255,0.04)"
      border="1px solid rgba(255,255,255,0.08)"
      color="white"
      boxShadow="0 8px 24px rgba(0,0,0,0.25)"
    >
      <Text fontSize="xl" fontWeight="bold" mb={5}>
        Security & Account
      </Text>

      <VStack spacing={4} align="stretch">
        <HStack>
          <FiShield color="green" />

          <Box>
            <Text fontWeight="bold">Account Status</Text>

            <Text fontSize="sm" color="gray.400">
              Your account is active
            </Text>
          </Box>
        </HStack>

        <HStack>
          <FiCheckCircle color="blue" />

          <Box>
            <Text fontWeight="bold">Transaction Tracking</Text>

            <Text fontSize="sm" color="gray.400">
              Deposits and withdrawals are recorded
            </Text>
          </Box>
        </HStack>

        <HStack>
          <FiLock color="orange" />

          <Box>
            <Text fontWeight="bold">Secure Access</Text>

            <Text fontSize="sm" color="gray.400">
              Your session is protected
            </Text>
          </Box>
        </HStack>
      </VStack>
    </Box>
  );
}

export default SecurityPanel;
