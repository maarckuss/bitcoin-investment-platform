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
import {
  FiCheck,
  FiCopy,
  FiUpload,
  FiX,
} from "react-icons/fi";
import API from "../api/axios";

function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);

  const toast = useToast();

  const fetchWithdrawals = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/admin/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWithdrawals(res.data.withdrawals || []);
    } catch (err) {
      console.error(err);

      toast({
        title: "Unable to load withdrawals",
        description:
          err.response?.data?.message ||
          "Please try again later.",
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
    fetchWithdrawals();
  }, []);

  const updateWithdrawal = async (id, action) => {
    try {
      setLoadingId(id);

      const token = localStorage.getItem("token");

      await API.patch(
        `/withdrawals/${id}/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await fetchWithdrawals();

      toast({
        title:
          action === "approve"
            ? "Withdrawal approved"
            : "Withdrawal rejected",
        status: "success",
        duration: 2500,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      toast({
        title: "Action failed",
        description:
          err.response?.data?.message ||
          "Unable to update this withdrawal.",
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
    if (status === "approved") {
      return {
        label: "Approved",
        colorScheme: "green",
      };
    }

    if (status === "rejected") {
      return {
        label: "Rejected",
        colorScheme: "red",
      };
    }

    return {
      label: "Pending",
      colorScheme: "orange",
    };
  };

  const copyAddress = async (address) => {
    try {
      await navigator.clipboard.writeText(address);

      toast({
        title: "Wallet address copied",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Please copy the address manually.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
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
            Loading withdrawals...
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
            bg="rgba(239,68,68,0.10)"
            color="red.300"
          >
            <FiUpload size={20} />
          </Flex>

          <Box>
            <Text
              fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
              fontWeight="800"
              color="white"
              letterSpacing="-0.03em"
            >
              Bitcoin withdrawals
            </Text>

            <Text
              mt={1}
              fontSize={{ base: "sm", md: "md" }}
              color="gray.500"
            >
              Review and process outgoing withdrawal requests.
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
          {withdrawals.length === 0 ? (
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
                <FiUpload size={22} />
              </Flex>

              <Text
                mt={5}
                fontWeight="700"
                color="white"
              >
                No withdrawals found
              </Text>

              <Text
                mt={2}
                maxW="440px"
                fontSize="sm"
                color="gray.600"
              >
                Withdrawal requests will appear here when users
                submit them.
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
                        "Wallet address",
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
                    {withdrawals.map((withdrawal) => {
                      const status = getStatus(withdrawal.status);

                      return (
                        <Box as="tr" key={withdrawal._id}>
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
                            >
                              {withdrawal.userId}
                            </Text>
                          </Box>

                          <Box
                            as="td"
                            px={6}
                            py={4}
                            borderTop="1px solid"
                            borderColor="whiteAlpha.80"
                          >
                            <Text
                              color="red.300"
                              fontWeight="700"
                            >
                              -$
                              {Number(
                                withdrawal.amount,
                              ).toLocaleString("en-US")}
                            </Text>
                          </Box>

                          <Box
                            as="td"
                            px={6}
                            py={4}
                            borderTop="1px solid"
                            borderColor="whiteAlpha.80"
                            maxW="360px"
                          >
                            <Flex align="center" gap={2}>
                              <Text
                                fontSize="xs"
                                fontFamily="mono"
                                color="gray.400"
                                wordBreak="break-all"
                              >
                                {withdrawal.walletAddress}
                              </Text>

                              <Button
                                size="xs"
                                variant="ghost"
                                color="gray.500"
                                flexShrink={0}
                                onClick={() =>
                                  copyAddress(
                                    withdrawal.walletAddress,
                                  )
                                }
                              >
                                <FiCopy />
                              </Button>
                            </Flex>
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
                            {withdrawal.status === "pending" && (
                              <Flex gap={2}>
                                <Button
                                  size="xs"
                                  colorScheme="green"
                                  variant="outline"
                                  leftIcon={<FiCheck />}
                                  isLoading={
                                    loadingId === withdrawal._id
                                  }
                                  onClick={() =>
                                    updateWithdrawal(
                                      withdrawal._id,
                                      "approve",
                                    )
                                  }
                                >
                                  Approve
                                </Button>

                                <Button
                                  size="xs"
                                  colorScheme="red"
                                  variant="outline"
                                  leftIcon={<FiX />}
                                  isDisabled={
                                    loadingId === withdrawal._id
                                  }
                                  onClick={() =>
                                    updateWithdrawal(
                                      withdrawal._id,
                                      "reject",
                                    )
                                  }
                                >
                                  Reject
                                </Button>
                              </Flex>
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
                {withdrawals.map((withdrawal) => {
                  const status = getStatus(withdrawal.status);

                  return (
                    <Box
                      key={withdrawal._id}
                      p={4}
                      border="1px solid"
                      borderColor="whiteAlpha.80"
                      borderRadius="15px"
                      bg="whiteAlpha.20"
                    >
                      <Flex
                        align="flex-start"
                        justify="space-between"
                        gap={3}
                      >
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
                            {withdrawal.userId}
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

                      <Box
                        mt={4}
                        p={3}
                        borderRadius="12px"
                        bg="whiteAlpha.30"
                      >
                        <Text
                          fontSize="10px"
                          color="gray.600"
                          textTransform="uppercase"
                        >
                          Amount
                        </Text>

                        <Text
                          mt={1}
                          fontSize="md"
                          fontWeight="700"
                          color="red.300"
                        >
                          -$
                          {Number(
                            withdrawal.amount,
                          ).toLocaleString("en-US")}
                        </Text>
                      </Box>

                      <Box
                        mt={2}
                        p={3}
                        borderRadius="12px"
                        bg="whiteAlpha.30"
                      >
                        <Flex
                          align="flex-start"
                          justify="space-between"
                          gap={2}
                        >
                          <Box minW="0">
                            <Text
                              fontSize="10px"
                              color="gray.600"
                              textTransform="uppercase"
                            >
                              Wallet address
                            </Text>

                            <Text
                              mt={1}
                              fontSize="xs"
                              fontFamily="mono"
                              color="gray.300"
                              wordBreak="break-all"
                            >
                              {withdrawal.walletAddress}
                            </Text>
                          </Box>

                          <Button
                            size="xs"
                            variant="ghost"
                            color="gray.500"
                            flexShrink={0}
                            onClick={() =>
                              copyAddress(
                                withdrawal.walletAddress,
                              )
                            }
                          >
                            <FiCopy />
                          </Button>
                        </Flex>
                      </Box>

                      {withdrawal.status === "pending" && (
                        <SimpleGrid
                          columns={2}
                          spacing={2}
                          mt={3}
                        >
                          <Button
                            size="sm"
                            colorScheme="green"
                            leftIcon={<FiCheck />}
                            isLoading={
                              loadingId === withdrawal._id
                            }
                            onClick={() =>
                              updateWithdrawal(
                                withdrawal._id,
                                "approve",
                              )
                            }
                          >
                            Approve
                          </Button>

                          <Button
                            size="sm"
                            colorScheme="red"
                            variant="outline"
                            leftIcon={<FiX />}
                            isDisabled={
                              loadingId === withdrawal._id
                            }
                            onClick={() =>
                              updateWithdrawal(
                                withdrawal._id,
                                "reject",
                              )
                            }
                          >
                            Reject
                          </Button>
                        </SimpleGrid>
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

export default AdminWithdrawals;