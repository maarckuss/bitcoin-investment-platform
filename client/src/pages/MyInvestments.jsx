import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiTrendingUp,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function MyInvestments() {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get("/my-investments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setInvestments(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, []);

  if (loading) {
    return (
      <Flex
        minH="calc(100vh - 96px)"
        align="center"
        justify="center"
        bg="#0b1220"
      >
        <VStack spacing={4}>
          <Spinner
            size="lg"
            thickness="3px"
            color="orange.300"
            emptyColor="whiteAlpha.200"
          />

          <Text color="gray.500" fontSize="sm">
            Loading your investments...
          </Text>
        </VStack>
      </Flex>
    );
  }

  return (
    <Box
      minH="calc(100vh - 96px)"
      bg="#0b1220"
      px={{ base: 4, sm: 5, md: 6, lg: 8 }}
      py={{ base: 5, md: 7, lg: 8 }}
      overflowX="hidden"
    >
      <Box maxW="1280px" mx="auto" w="100%">
        <Box mb={{ base: 5, md: 7 }}>
          <Text
            fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
            fontWeight="800"
            color="white"
            letterSpacing="-0.03em"
          >
            My investments
          </Text>

          <Text
            mt={2}
            maxW="680px"
            color="gray.500"
            fontSize={{ base: "sm", md: "md" }}
            lineHeight="1.7"
          >
            Track your active investments, expected returns, and
            maturity dates.
          </Text>
        </Box>

        {investments.length === 0 ? (
          <Box
            p={{ base: 6, sm: 8, md: 10 }}
            border="1px solid"
            borderColor="whiteAlpha.100"
            borderRadius={{ base: "18px", md: "22px" }}
            bg="linear-gradient(
              135deg,
              rgba(245,158,11,0.06),
              rgba(255,255,255,0.025)
            )"
            textAlign="center"
            boxShadow="0 18px 45px rgba(0,0,0,0.16)"
          >
            <Flex
              align="center"
              justify="center"
              w="58px"
              h="58px"
              mx="auto"
              borderRadius="17px"
              bg="rgba(245,158,11,0.10)"
              color="orange.300"
            >
              <FiTrendingUp size={24} />
            </Flex>

            <Text
              mt={5}
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="700"
              color="white"
            >
              No investments yet
            </Text>

            <Text
              mt={2}
              mx="auto"
              maxW="480px"
              color="gray.500"
              fontSize="sm"
              lineHeight="1.7"
            >
              Explore the available plans and start building your
              investment portfolio.
            </Text>

            <Button
              mt={6}
              h="50px"
              px={6}
              borderRadius="12px"
              bg="orange.400"
              color="gray.950"
              fontWeight="700"
              rightIcon={<FiArrowRight />}
              onClick={() => navigate("/investments")}
              _hover={{
                bg: "orange.300",
                transform: "translateY(-1px)",
              }}
              _active={{
                transform: "translateY(0)",
              }}
            >
              Explore plans
            </Button>
          </Box>
        ) : (
          <SimpleGrid
            columns={{ base: 1, md: 2, xl: 3 }}
            spacing={{ base: 4, md: 5 }}
          >
            {investments.map((investment, index) => {
              const amount = Number(investment.amount) || 0;
              const expectedReturn =
                Number(investment.expectedReturn) || 0;
              const profit = expectedReturn - amount;
              const roi = Number(investment.planId?.roi) || 0;
              const duration =
                Number(investment.planId?.duration) || 0;

              const isActive = investment.status === "active";

              return (
                <motion.div
                  key={investment._id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: index * 0.05,
                  }}
                  whileHover={{ y: -3 }}
                >
                  <Box
                    h="100%"
                    p={{ base: 5, md: 6 }}
                    border="1px solid"
                    borderColor="whiteAlpha.100"
                    borderRadius={{ base: "18px", md: "20px" }}
                    bg="rgba(255,255,255,0.035)"
                    backdropFilter="blur(12px)"
                    boxShadow="0 12px 32px rgba(0,0,0,0.16)"
                  >
                    <Flex
                      align="flex-start"
                      justify="space-between"
                      gap={3}
                      mb={5}
                    >
                      <Box minW="0">
                        <Text
                          fontSize={{ base: "lg", md: "xl" }}
                          fontWeight="700"
                          color="white"
                          noOfLines={1}
                        >
                          {investment.planId?.name ||
                            "Investment Plan"}
                        </Text>

                        <Text
                          mt={1}
                          fontSize="xs"
                          color="gray.500"
                        >
                          Portfolio investment
                        </Text>
                      </Box>

                      <Flex
                        align="center"
                        gap={2}
                        flexShrink={0}
                        px={2.5}
                        py={1.5}
                        borderRadius="full"
                        bg={
                          isActive
                            ? "rgba(34,197,94,0.10)"
                            : "whiteAlpha.100"
                        }
                        color={
                          isActive
                            ? "green.300"
                            : "gray.400"
                        }
                      >
                        <Box
                          w="6px"
                          h="6px"
                          borderRadius="full"
                          bg="currentColor"
                        />

                        <Text
                          fontSize="10px"
                          fontWeight="700"
                          textTransform="uppercase"
                          letterSpacing="0.08em"
                        >
                          {investment.status}
                        </Text>
                      </Flex>
                    </Flex>

                    <Box
                      p={{ base: 4, md: 5 }}
                      mb={5}
                      borderRadius="16px"
                      bg="rgba(34,197,94,0.06)"
                      border="1px solid"
                      borderColor="rgba(34,197,94,0.10)"
                    >
                      <Text
                        fontSize="xs"
                        color="gray.500"
                      >
                        Expected return
                      </Text>

                      <Text
                        mt={1}
                        fontSize={{ base: "2xl", md: "3xl" }}
                        fontWeight="800"
                        color="green.300"
                        letterSpacing="-0.03em"
                      >
                        ${expectedReturn.toLocaleString("en-US")}
                      </Text>
                    </Box>

                    <VStack spacing={0} align="stretch">
                      <Flex
                        align="center"
                        justify="space-between"
                        gap={3}
                        py={3}
                        borderBottom="1px solid"
                        borderColor="whiteAlpha.80"
                      >
                        <Flex
                          align="center"
                          gap={2.5}
                          color="gray.500"
                        >
                          <FiDollarSign size={15} />
                          <Text fontSize="xs">
                            Invested
                          </Text>
                        </Flex>

                        <Text
                          fontSize="sm"
                          fontWeight="600"
                          color="gray.200"
                        >
                          ${amount.toLocaleString("en-US")}
                        </Text>
                      </Flex>

                      <Flex
                        align="center"
                        justify="space-between"
                        gap={3}
                        py={3}
                        borderBottom="1px solid"
                        borderColor="whiteAlpha.80"
                      >
                        <Flex
                          align="center"
                          gap={2.5}
                          color="gray.500"
                        >
                          <FiTrendingUp size={15} />
                          <Text fontSize="xs">
                            ROI
                          </Text>
                        </Flex>

                        <Text
                          fontSize="sm"
                          fontWeight="600"
                          color="green.300"
                        >
                          {roi}%
                        </Text>
                      </Flex>

                      <Flex
                        align="center"
                        justify="space-between"
                        gap={3}
                        py={3}
                        borderBottom="1px solid"
                        borderColor="whiteAlpha.80"
                      >
                        <Flex
                          align="center"
                          gap={2.5}
                          color="gray.500"
                        >
                          <FiCheckCircle size={15} />
                          <Text fontSize="xs">
                            Estimated profit
                          </Text>
                        </Flex>

                        <Text
                          fontSize="sm"
                          fontWeight="600"
                          color="green.300"
                        >
                          ${profit.toFixed(2)}
                        </Text>
                      </Flex>

                      <Flex
                        align="center"
                        justify="space-between"
                        gap={3}
                        py={3}
                      >
                        <Flex
                          align="center"
                          gap={2.5}
                          color="gray.500"
                        >
                          <FiClock size={15} />
                          <Text fontSize="xs">
                            Duration
                          </Text>
                        </Flex>

                        <Text
                          fontSize="sm"
                          fontWeight="600"
                          color="gray.200"
                        >
                          {duration} days
                        </Text>
                      </Flex>
                    </VStack>

                    <Box
                      mt={4}
                      p={4}
                      borderRadius="14px"
                      bg="whiteAlpha.30"
                      border="1px solid"
                      borderColor="whiteAlpha.80"
                    >
                      <Text
                        fontSize="xs"
                        color="gray.500"
                      >
                        Investment timeline
                      </Text>

                      <Flex
                        mt={3}
                        direction={{ base: "column", sm: "row" }}
                        gap={{ base: 2, sm: 4 }}
                      >
                        <Box flex="1">
                          <Flex
                            align="center"
                            gap={2}
                            color="gray.500"
                          >
                            <FiCalendar size={13} />
                            <Text fontSize="xs">
                              Started
                            </Text>
                          </Flex>

                          <Text
                            mt={1}
                            fontSize="sm"
                            color="gray.200"
                          >
                            {new Date(
                              investment.startDate,
                            ).toLocaleDateString()}
                          </Text>
                        </Box>

                        <Box flex="1">
                          <Flex
                            align="center"
                            gap={2}
                            color="gray.500"
                          >
                            <FiCalendar size={13} />
                            <Text fontSize="xs">
                              Maturity
                            </Text>
                          </Flex>

                          <Text
                            mt={1}
                            fontSize="sm"
                            color="gray.200"
                          >
                            {new Date(
                              investment.endDate,
                            ).toLocaleDateString()}
                          </Text>
                        </Box>
                      </Flex>
                    </Box>
                  </Box>
                </motion.div>
              );
            })}
          </SimpleGrid>
        )}
      </Box>
    </Box>
  );
}

export default MyInvestments;