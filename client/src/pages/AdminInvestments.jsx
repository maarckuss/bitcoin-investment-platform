import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  SimpleGrid,
  Spinner,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { FiCheck, FiClock, FiTrendingUp } from "react-icons/fi";
import API from "../api/axios";

function AdminInvestments() {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);

  const toast = useToast();

  const fetchInvestments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/admin/investments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setInvestments(res.data || []);
    } catch (err) {
      console.error(err);

      toast({
        title: "Unable to load investments",
        description: err.response?.data?.message || "Please try again later.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  const completeInvestment = async (id) => {
    try {
      setLoadingId(id);

      const token = localStorage.getItem("token");

      await API.patch(
        `/admin/complete-investment/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await fetchInvestments();

      toast({
        title: "Investment completed",
        status: "success",
        duration: 2500,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      toast({
        title: "Unable to complete investment",
        description: err.response?.data?.message || "Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setLoadingId(null);
    }
  };

  const getStatus = (status) => {
    if (status === "active") {
      return {
        label: "Active",
        colorScheme: "green",
      };
    }

    if (status === "completed") {
      return {
        label: "Completed",
        colorScheme: "blue",
      };
    }

    return {
      label: status || "Unknown",
      colorScheme: "gray",
    };
  };

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
            Loading investments...
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
        <Flex align="center" gap={3} mb={2}>
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
            <FiTrendingUp size={20} />
          </Flex>

          <Box>
            <Text
              fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
              fontWeight="800"
              color="white"
              letterSpacing="-0.03em"
            >
              Investment management
            </Text>

            <Text mt={1} fontSize={{ base: "sm", md: "md" }} color="gray.500">
              Monitor active investments and finalize matured positions.
            </Text>
          </Box>
        </Flex>

        <Box
          mt={{ base: 5, md: 7 }}
          border="1px solid"
          borderColor="whiteAlpha.100"
          borderRadius={{ base: "16px", md: "20px" }}
          bg="rgba(255,255,255,0.035)"
          backdropFilter="blur(12px)"
          boxShadow="0 12px 34px rgba(0,0,0,0.15)"
          overflow="hidden"
        >
          {investments.length === 0 ? (
            <Flex
              direction="column"
              align="center"
              justify="center"
              py={{ base: 10, md: 14 }}
              px={5}
              textAlign="center"
            >
              <Flex
                align="center"
                justify="center"
                w="54px"
                h="54px"
                borderRadius="16px"
                bg="whiteAlpha.100"
                color="gray.400"
              >
                <FiTrendingUp size={22} />
              </Flex>

              <Text mt={5} fontWeight="700" color="white">
                No investments found
              </Text>

              <Text mt={2} maxW="460px" fontSize="sm" color="gray.600">
                Investment activity will appear here once users start investing.
              </Text>
            </Flex>
          ) : (
            <>
              <Box display={{ base: "none", lg: "block" }}>
                <Box as="table" w="100%">
                  <Box as="thead" bg="whiteAlpha.30">
                    <Box as="tr">
                      {[
                        "User",
                        "Amount",
                        "Expected return",
                        "Status",
                        "Action",
                      ].map((heading) => (
                        <Box
                          as="th"
                          key={heading}
                          textAlign="left"
                          px={6}
                          py={4}
                          color="gray.500"
                          fontSize="10px"
                          textTransform="uppercase"
                          letterSpacing="0.08em"
                        >
                          {heading}
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  <Box as="tbody">
                    {investments.map((investment) => {
                      const status = getStatus(investment.status);

                      return (
                        <Box as="tr" key={investment._id}>
                          <Box
                            as="td"
                            px={6}
                            py={4}
                            borderTop="1px solid"
                            borderColor="whiteAlpha.80"
                          >
                            <Text
                              fontSize="sm"
                              fontWeight="600"
                              color="gray.200"
                              wordBreak="break-word"
                            >
                              {investment.userId?.email ||
                                investment.userId ||
                                "Unknown user"}
                            </Text>
                          </Box>

                          <Box
                            as="td"
                            px={6}
                            py={4}
                            borderTop="1px solid"
                            borderColor="whiteAlpha.80"
                          >
                            <Text color="gray.200" fontWeight="600">
                              $
                              {Number(investment.amount).toLocaleString(
                                "en-US",
                              )}
                            </Text>
                          </Box>

                          <Box
                            as="td"
                            px={6}
                            py={4}
                            borderTop="1px solid"
                            borderColor="whiteAlpha.80"
                          >
                            <Text color="green.300" fontWeight="700">
                              $
                              {Number(investment.expectedReturn).toLocaleString(
                                "en-US",
                              )}
                            </Text>
                          </Box>

                          <Box
                            as="td"
                            px={6}
                            py={4}
                            borderTop="1px solid"
                            borderColor="whiteAlpha.80"
                          >
                            <Badge
                              colorScheme={status.colorScheme}
                              variant="subtle"
                              borderRadius="full"
                              px={2.5}
                              fontSize="10px"
                            >
                              {status.label}
                            </Badge>
                          </Box>

                          <Box
                            as="td"
                            px={6}
                            py={4}
                            borderTop="1px solid"
                            borderColor="whiteAlpha.80"
                          >
                            {investment.status === "active" && (
                              <Button
                                size="xs"
                                colorScheme="green"
                                variant="outline"
                                leftIcon={<FiCheck />}
                                isLoading={loadingId === investment._id}
                                onClick={() =>
                                  completeInvestment(investment._id)
                                }
                              >
                                Complete
                              </Button>
                            )}
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </Box>

              <VStack
                display={{ base: "flex", lg: "none" }}
                align="stretch"
                spacing={3}
                p={{ base: 3, sm: 4 }}
              >
                {investments.map((investment) => {
                  const status = getStatus(investment.status);

                  return (
                    <Box
                      key={investment._id}
                      p={4}
                      border="1px solid"
                      borderColor="whiteAlpha.80"
                      borderRadius="15px"
                      bg="whiteAlpha.20"
                    >
                      <Flex align="flex-start" justify="space-between" gap={3}>
                        <Box minW="0">
                          <Text
                            fontSize="10px"
                            color="gray.600"
                            textTransform="uppercase"
                          >
                            User
                          </Text>

                          <Text
                            mt={1}
                            fontSize="sm"
                            fontWeight="600"
                            color="gray.100"
                            wordBreak="break-word"
                          >
                            {investment.userId?.email ||
                              investment.userId ||
                              "Unknown user"}
                          </Text>
                        </Box>

                        <Badge
                          colorScheme={status.colorScheme}
                          variant="subtle"
                          borderRadius="full"
                          px={2.5}
                          fontSize="9px"
                          flexShrink={0}
                        >
                          {status.label}
                        </Badge>
                      </Flex>

                      <SimpleGrid columns={2} spacing={2} mt={4}>
                        <Box p={3} borderRadius="12px" bg="whiteAlpha.30">
                          <Text
                            fontSize="10px"
                            color="gray.600"
                            textTransform="uppercase"
                          >
                            Amount
                          </Text>

                          <Text
                            mt={1}
                            fontSize="sm"
                            fontWeight="700"
                            color="gray.200"
                          >
                            ${Number(investment.amount).toLocaleString("en-US")}
                          </Text>
                        </Box>

                        <Box p={3} borderRadius="12px" bg="whiteAlpha.30">
                          <Text
                            fontSize="10px"
                            color="gray.600"
                            textTransform="uppercase"
                          >
                            Return
                          </Text>

                          <Text
                            mt={1}
                            fontSize="sm"
                            fontWeight="700"
                            color="green.300"
                          >
                            $
                            {Number(investment.expectedReturn).toLocaleString(
                              "en-US",
                            )}
                          </Text>
                        </Box>
                      </SimpleGrid>

                      {investment.status === "active" && (
                        <Button
                          mt={3}
                          w="100%"
                          size="sm"
                          colorScheme="green"
                          leftIcon={<FiCheck />}
                          isLoading={loadingId === investment._id}
                          onClick={() => completeInvestment(investment._id)}
                        >
                          Complete investment
                        </Button>
                      )}
                    </Box>
                  );
                })}
              </VStack>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default AdminInvestments;
