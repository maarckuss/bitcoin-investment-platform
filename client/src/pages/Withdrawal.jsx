import { Box, Flex, Text } from "@chakra-ui/react";
import { FiArrowUpRight, FiShield } from "react-icons/fi";
import WithdrawalForm from "../components/WithdrawalForm";

function Withdrawal() {
  return (
    <Box
      minH="calc(100vh - 96px)"
      bg="#0b1220"
      px={{ base: 4, sm: 5, md: 6, lg: 8 }}
      py={{ base: 5, md: 7, lg: 8 }}
      overflowX="hidden"
    >
      <Box maxW="760px" mx="auto" w="100%">
        <Box mb={{ base: 5, md: 7 }}>
          <Text
            fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
            fontWeight="800"
            letterSpacing="-0.03em"
            color="white"
          >
            Withdraw crypto
          </Text>

          <Text
            mt={2}
            maxW="620px"
            fontSize={{ base: "sm", md: "md" }}
            lineHeight="1.7"
            color="gray.500"
          >
            Request a withdrawal to your external wallet. Review the
            destination address and amount carefully before submitting.
          </Text>
        </Box>

        <Box
          p={{ base: 4, sm: 5, md: 6, lg: 7 }}
          border="1px solid"
          borderColor="whiteAlpha.100"
          borderRadius={{ base: "18px", md: "24px" }}
          bg="rgba(15,23,42,0.72)"
          backdropFilter="blur(18px)"
          boxShadow="0 18px 50px rgba(0,0,0,0.22)"
        >
          <Flex
            direction={{ base: "column", sm: "row" }}
            gap={4}
            mb={{ base: 5, md: 6 }}
            p={{ base: 4, md: 5 }}
            borderRadius="16px"
            bg="linear-gradient(135deg, rgba(59,130,246,0.08), rgba(15,23,42,0.35))"
            border="1px solid"
            borderColor="whiteAlpha.80"
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
              <FiArrowUpRight size={19} />
            </Flex>

            <Box>
              <Text
                fontSize="sm"
                fontWeight="700"
                color="white"
              >
                External wallet withdrawal
              </Text>

              <Text
                mt={1}
                fontSize="xs"
                lineHeight="1.7"
                color="gray.500"
              >
                Confirm that your destination address belongs to the
                correct network before submitting your request.
              </Text>
            </Box>
          </Flex>

          <WithdrawalForm />

          <Flex
            align="flex-start"
            gap={3}
            mt={{ base: 5, md: 6 }}
            p={{ base: 3.5, md: 4 }}
            borderRadius="14px"
            bg="rgba(245,158,11,0.05)"
            border="1px solid"
            borderColor="rgba(245,158,11,0.10)"
          >
            <Box
              mt={0.5}
              color="orange.300"
              flexShrink={0}
            >
              <FiShield size={17} />
            </Box>

            <Box>
              <Text
                fontSize="sm"
                fontWeight="600"
                color="gray.200"
              >
                Review before submitting
              </Text>

              <Text
                mt={1}
                fontSize="xs"
                lineHeight="1.7"
                color="gray.500"
              >
                Blockchain transactions are irreversible. Make sure
                the wallet address and network are correct.
              </Text>
            </Box>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}

export default Withdrawal;