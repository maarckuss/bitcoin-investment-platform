import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import {
  FiCheckCircle,
  FiLock,
  FiShield,
} from "react-icons/fi";

const securityItems = [
  {
    title: "Account Status",
    description: "Your account is active",
    icon: FiShield,
    color: "green.300",
    bg: "rgba(34,197,94,0.10)",
  },
  {
    title: "Transaction Tracking",
    description: "Deposits and withdrawals are recorded",
    icon: FiCheckCircle,
    color: "blue.300",
    bg: "rgba(59,130,246,0.10)",
  },
  {
    title: "Secure Access",
    description: "Your session is protected",
    icon: FiLock,
    color: "orange.300",
    bg: "rgba(249,115,22,0.10)",
  },
];

function SecurityPanel() {
  return (
    <Box
      w="100%"
      h="100%"
      p={{ base: 4, sm: 5, md: 6 }}
      border="1px solid"
      borderColor="whiteAlpha.100"
      borderRadius={{ base: "16px", md: "20px" }}
      bg="rgba(255,255,255,0.035)"
      backdropFilter="blur(12px)"
      boxShadow="0 10px 30px rgba(0,0,0,0.14)"
    >
      <Flex
        align="center"
        gap={3}
        mb={{ base: 5, md: 6 }}
      >
        <Flex
          align="center"
          justify="center"
          w="42px"
          h="42px"
          flexShrink={0}
          borderRadius="14px"
          bg="rgba(34,197,94,0.10)"
          color="green.300"
        >
          <FiShield size={19} />
        </Flex>

        <Box>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="700"
            color="white"
          >
            Security & Account
          </Text>

          <Text
            mt={0.5}
            fontSize="xs"
            color="gray.500"
          >
            Account protection overview
          </Text>
        </Box>
      </Flex>

      <VStack spacing={3} align="stretch">
        {securityItems.map((item) => {
          const Icon = item.icon;

          return (
            <Flex
              key={item.title}
              align="center"
              gap={3}
              p={{ base: 3, md: 4 }}
              borderRadius="14px"
              bg="whiteAlpha.30"
              border="1px solid"
              borderColor="whiteAlpha.80"
              transition="all 0.2s ease"
              _hover={{
                bg: "whiteAlpha.50",
                borderColor: "whiteAlpha.200",
              }}
            >
              <Flex
                align="center"
                justify="center"
                w="40px"
                h="40px"
                flexShrink={0}
                borderRadius="12px"
                bg={item.bg}
                color={item.color}
              >
                <Icon size={18} />
              </Flex>

              <Box minW="0" flex="1">
                <Text
                  fontSize="sm"
                  fontWeight="600"
                  color="gray.100"
                  noOfLines={1}
                >
                  {item.title}
                </Text>

                <Text
                  mt={1}
                  fontSize="xs"
                  color="gray.500"
                  lineHeight="1.5"
                >
                  {item.description}
                </Text>
              </Box>

              <Box
                flexShrink={0}
                w="7px"
                h="7px"
                borderRadius="full"
                bg={item.color}
                boxShadow={`0 0 10px ${item.color}`}
              />
            </Flex>
          );
        })}
      </VStack>
    </Box>
  );
}

export default SecurityPanel;