import { Box, Flex, Text } from "@chakra-ui/react";
import { FiRepeat } from "react-icons/fi";
import TransactionTable from "../components/TransactionTable";

function Transactions() {
  return (
    <Box
      minH="calc(100vh - 96px)"
      bg="#0b1220"
      px={{ base: 4, sm: 5, md: 6, lg: 8 }}
      py={{ base: 5, md: 7, lg: 8 }}
      overflowX="hidden"
    >
      <Box maxW="1280px" mx="auto" w="100%">
        <Flex
          align="center"
          gap={3}
          mb={{ base: 5, md: 7 }}
        >
          <Flex
            align="center"
            justify="center"
            w="44px"
            h="44px"
            flexShrink={0}
            borderRadius="13px"
            bg="rgba(59,130,246,0.10)"
            color="blue.300"
          >
            <FiRepeat size={20} />
          </Flex>

          <Box>
            <Text
              fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
              fontWeight="800"
              color="white"
              letterSpacing="-0.03em"
            >
              Transaction history
            </Text>

            <Text
              mt={1}
              fontSize={{ base: "sm", md: "md" }}
              color="gray.500"
            >
              Review your deposits and withdrawals.
            </Text>
          </Box>
        </Flex>

        <Box
          w="100%"
          minW="0"
          p={{ base: 3, sm: 4, md: 5, lg: 6 }}
          border="1px solid"
          borderColor="whiteAlpha.100"
          borderRadius={{ base: "16px", md: "20px" }}
          bg="rgba(255,255,255,0.035)"
          backdropFilter="blur(12px)"
          boxShadow="0 10px 30px rgba(0,0,0,0.14)"
          overflow="hidden"
        >
          <TransactionTable />
        </Box>
      </Box>
    </Box>
  );
}

export default Transactions;