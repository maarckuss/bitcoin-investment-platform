import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Flex,
  SimpleGrid,
  Spinner,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  FiActivity,
  FiDollarSign,
  FiUser,
} from "react-icons/fi";
import API from "../api/axios";

function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/admin/logs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLogs(res.data || []);
    } catch (err) {
      console.error(err);

      toast({
        title: "Unable to load activity logs",
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
            Loading activity logs...
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
            bg="rgba(245,158,11,0.10)"
            color="orange.300"
          >
            <FiActivity size={20} />
          </Flex>

          <Box>
            <Text
              fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
              fontWeight="800"
              color="white"
              letterSpacing="-0.03em"
            >
              Activity logs
            </Text>

            <Text
              mt={1}
              fontSize={{ base: "sm", md: "md" }}
              color="gray.500"
            >
              Review important administrative activity and account changes.
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
          {logs.length === 0 ? (
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
                <FiActivity size={22} />
              </Flex>

              <Text
                mt={5}
                fontWeight="700"
                color="white"
              >
                No activity yet
              </Text>

              <Text
                mt={2}
                maxW="460px"
                fontSize="sm"
                color="gray.600"
              >
                Administrative actions will appear here as they occur.
              </Text>
            </Flex>
          ) : (
            <>
              {/* Desktop */}
              <Box display={{ base: "none", lg: "block" }}>
                <Box as="table" w="100%">
                  <Box as="thead" bg="whiteAlpha.30">
                    <Box as="tr">
                      {["Action", "Target user", "Amount", "Date"].map(
                        (heading) => (
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
                        ),
                      )}
                    </Box>
                  </Box>

                  <Box as="tbody">
                    {logs.map((log) => (
                      <Box as="tr" key={log._id}>
                        <Box
                          as="td"
                          px={6}
                          py={4}
                          borderTop="1px solid"
                          borderColor="whiteAlpha.80"
                        >
                          <Badge
                            colorScheme="orange"
                            variant="subtle"
                            borderRadius="full"
                            px={2.5}
                            fontSize="10px"
                          >
                            {log.action}
                          </Badge>
                        </Box>

                        <Box
                          as="td"
                          px={6}
                          py={4}
                          borderTop="1px solid"
                          borderColor="whiteAlpha.80"
                        >
                          <Text
                            fontSize="sm"
                            color="gray.300"
                            wordBreak="break-word"
                          >
                            {log.targetUserId || "N/A"}
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
                            color="gray.200"
                            fontWeight="600"
                          >
                            {log.amount || "-"}
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
                            fontSize="sm"
                            color="gray.500"
                          >
                            {log.createdAt
                              ? new Date(
                                  log.createdAt,
                                ).toLocaleString()
                              : "N/A"}
                          </Text>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>

              {/* Mobile / Tablet */}
              <VStack
                display={{ base: "flex", lg: "none" }}
                align="stretch"
                spacing={3}
                p={{ base: 3, sm: 4 }}
              >
                {logs.map((log) => (
                  <Box
                    key={log._id}
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
                      <Flex
                        align="center"
                        gap={3}
                        minW="0"
                      >
                        <Flex
                          align="center"
                          justify="center"
                          w="40px"
                          h="40px"
                          flexShrink={0}
                          borderRadius="12px"
                          bg="rgba(245,158,11,0.10)"
                          color="orange.300"
                        >
                          <FiActivity size={17} />
                        </Flex>

                        <Box minW="0">
                          <Text
                            fontSize="sm"
                            fontWeight="700"
                            color="white"
                            wordBreak="break-word"
                          >
                            {log.action}
                          </Text>

                          <Text
                            mt={1}
                            fontSize="xs"
                            color="gray.600"
                          >
                            {log.createdAt
                              ? new Date(
                                  log.createdAt,
                                ).toLocaleString()
                              : "N/A"}
                          </Text>
                        </Box>
                      </Flex>
                    </Flex>

                    <SimpleGrid
                      columns={2}
                      spacing={2}
                      mt={4}
                    >
                      <Box
                        p={3}
                        borderRadius="12px"
                        bg="whiteAlpha.30"
                      >
                        <Flex
                          align="center"
                          gap={2}
                          color="gray.600"
                        >
                          <FiUser size={13} />
                          <Text
                            fontSize="10px"
                            textTransform="uppercase"
                          >
                            Target user
                          </Text>
                        </Flex>

                        <Text
                          mt={1}
                          fontSize="xs"
                          color="gray.200"
                          wordBreak="break-word"
                        >
                          {log.targetUserId || "N/A"}
                        </Text>
                      </Box>

                      <Box
                        p={3}
                        borderRadius="12px"
                        bg="whiteAlpha.30"
                      >
                        <Flex
                          align="center"
                          gap={2}
                          color="gray.600"
                        >
                          <FiDollarSign size={13} />
                          <Text
                            fontSize="10px"
                            textTransform="uppercase"
                          >
                            Amount
                          </Text>
                        </Flex>

                        <Text
                          mt={1}
                          fontSize="sm"
                          fontWeight="600"
                          color="gray.200"
                        >
                          {log.amount || "-"}
                        </Text>
                      </Box>
                    </SimpleGrid>
                  </Box>
                ))}
              </VStack>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default ActivityLogs;