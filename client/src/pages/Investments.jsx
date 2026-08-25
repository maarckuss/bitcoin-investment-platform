import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Spinner,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiShield,
  FiTrendingUp,
  FiX,
} from "react-icons/fi";

import API from "../api/axios";

function Investments() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const toast = useToast();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get("/plans", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPlans(res.data);
      } catch (err) {
        console.error(err);

        toast({
          title: "Unable to load investment plans",
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

    fetchPlans();
  }, [toast]);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setAmount("");
  };

  const handleInvest = async () => {
    if (!selectedPlan) return;

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      toast({
        title: "Enter an investment amount",
        description: "Please enter a valid amount to continue.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (numericAmount < Number(selectedPlan.minimumAmount)) {
      toast({
        title: "Amount below minimum",
        description: `Minimum investment is $${selectedPlan.minimumAmount}.`,
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");

      const res = await API.post(
        "/invest",
        {
          planId: selectedPlan._id,
          amount: numericAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast({
        title: "Investment successful",
        description: `Expected return: $${res.data.investment.expectedReturn}`,
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });

      setAmount("");
      setSelectedPlan(null);
    } catch (err) {
      toast({
        title: "Investment failed",
        description:
          err.response?.data?.message ||
          "Something went wrong. Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const expectedReturn = selectedPlan && amount
    ? (
        Number(amount) +
        (Number(amount) * Number(selectedPlan.roi)) / 100
      ).toFixed(2)
    : null;

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
            Loading investment plans...
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
            Investment plans
          </Text>

          <Text
            mt={2}
            maxW="680px"
            fontSize={{ base: "sm", md: "md" }}
            color="gray.500"
            lineHeight="1.7"
          >
            Choose an investment plan based on the amount you want to
            allocate and the expected return.
          </Text>
        </Box>

        {plans.length === 0 ? (
          <Box
            p={{ base: 6, md: 8 }}
            border="1px solid"
            borderColor="whiteAlpha.100"
            borderRadius="20px"
            bg="whiteAlpha.30"
            textAlign="center"
          >
            <Text
              color="white"
              fontWeight="700"
              fontSize="lg"
            >
              No investment plans available
            </Text>

            <Text
              mt={2}
              color="gray.500"
              fontSize="sm"
            >
              Please check back later.
            </Text>
          </Box>
        ) : (
          <SimpleGrid
            columns={{ base: 1, md: 2, xl: 3 }}
            spacing={{ base: 4, md: 5 }}
          >
            {plans.map((plan, index) => {
              const isSelected =
                selectedPlan?._id === plan._id;

              return (
                <motion.div
                  key={plan._id}
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
                    borderColor={
                      isSelected
                        ? "orange.400"
                        : "whiteAlpha.100"
                    }
                    borderRadius="20px"
                    bg={
                      isSelected
                        ? "rgba(245,158,11,0.05)"
                        : "rgba(255,255,255,0.035)"
                    }
                    backdropFilter="blur(12px)"
                    boxShadow={
                      isSelected
                        ? "0 16px 40px rgba(245,158,11,0.10)"
                        : "0 10px 30px rgba(0,0,0,0.14)"
                    }
                    transition="all 0.2s ease"
                  >
                    <Flex
                      align="center"
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
                          {plan.name}
                        </Text>

                        <Text
                          mt={1}
                          fontSize="xs"
                          color="gray.500"
                        >
                          Investment plan
                        </Text>
                      </Box>

                      {index === 1 ? (
                        <Box
                          px={2.5}
                          py={1}
                          borderRadius="full"
                          bg="rgba(245,158,11,0.10)"
                          color="orange.300"
                          fontSize="10px"
                          fontWeight="700"
                          textTransform="uppercase"
                          letterSpacing="0.08em"
                          whiteSpace="nowrap"
                        >
                          Popular
                        </Box>
                      ) : null}
                    </Flex>

                    <Box
                      mb={4}
                      p={{ base: 4, md: 5 }}
                      borderRadius="16px"
                      bg="rgba(34,197,94,0.07)"
                      border="1px solid"
                      borderColor="rgba(34,197,94,0.10)"
                    >
                      <Text
                        fontSize="xs"
                        color="gray.500"
                        mb={1}
                      >
                        Expected ROI
                      </Text>

                      <Text
                        fontSize={{ base: "3xl", md: "4xl" }}
                        fontWeight="800"
                        color="green.300"
                        letterSpacing="-0.03em"
                      >
                        {plan.roi}%
                      </Text>
                    </Box>

                    <Text
                      color="gray.500"
                      fontSize="sm"
                      lineHeight="1.7"
                      minH={{ base: "auto", md: "58px" }}
                      mb={5}
                    >
                      {plan.description}
                    </Text>

                    <VStack
                      align="stretch"
                      spacing={0}
                      mb={6}
                    >
                      {[
                        {
                          icon: FiDollarSign,
                          label: "Minimum investment",
                          value: `$${plan.minimumAmount}`,
                        },
                        {
                          icon: FiClock,
                          label: "Duration",
                          value: `${plan.duration} days`,
                        },
                        {
                          icon: FiShield,
                          label: "Allocation",
                          value: "Bitcoin",
                        },
                      ].map((item) => {
                        const Icon = item.icon;

                        return (
                          <Flex
                            key={item.label}
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
                              minW="0"
                            >
                              <Box color="gray.500">
                                <Icon size={15} />
                              </Box>

                              <Text
                                color="gray.500"
                                fontSize="xs"
                                noOfLines={1}
                              >
                                {item.label}
                              </Text>
                            </Flex>

                            <Text
                              flexShrink={0}
                              color="gray.200"
                              fontSize="sm"
                              fontWeight="600"
                            >
                              {item.value}
                            </Text>
                          </Flex>
                        );
                      })}
                    </VStack>

                    <Button
                      w="100%"
                      h="50px"
                      borderRadius="12px"
                      bg={
                        isSelected
                          ? "orange.300"
                          : "orange.400"
                      }
                      color="gray.950"
                      rightIcon={<FiArrowRight />}
                      fontWeight="700"
                      onClick={() => handleSelectPlan(plan)}
                      _hover={{
                        bg: "orange.300",
                        transform: "translateY(-1px)",
                        boxShadow:
                          "0 10px 24px rgba(245,158,11,0.14)",
                      }}
                      _active={{
                        transform: "translateY(0)",
                      }}
                    >
                      {isSelected
                        ? "Selected"
                        : "Start investing"}
                    </Button>
                  </Box>
                </motion.div>
              );
            })}
          </SimpleGrid>
        )}

        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Box
              mt={{ base: 6, md: 8 }}
              p={{ base: 5, sm: 6, md: 7 }}
              border="1px solid"
              borderColor="rgba(245,158,11,0.16)"
              borderRadius={{ base: "18px", md: "22px" }}
              bg="linear-gradient(135deg, rgba(245,158,11,0.06), rgba(15,23,42,0.45))"
              boxShadow="0 18px 50px rgba(0,0,0,0.18)"
            >
              <Flex
                align={{ base: "flex-start", sm: "center" }}
                justify="space-between"
                direction={{ base: "column", sm: "row" }}
                gap={3}
                mb={6}
              >
                <Box>
                  <Text
                    fontSize={{ base: "lg", md: "xl" }}
                    fontWeight="700"
                    color="white"
                  >
                    Review your investment
                  </Text>

                  <Text
                    mt={1}
                    fontSize="sm"
                    color="gray.500"
                  >
                    Confirm the plan and amount before submitting.
                  </Text>
                </Box>

                <Button
                  size="sm"
                  variant="ghost"
                  color="gray.500"
                  leftIcon={<FiX />}
                  onClick={() => {
                    setSelectedPlan(null);
                    setAmount("");
                  }}
                  _hover={{
                    color: "white",
                    bg: "whiteAlpha.100",
                  }}
                >
                  Cancel
                </Button>
              </Flex>

              <SimpleGrid
                columns={{ base: 1, sm: 3 }}
                spacing={3}
                mb={5}
              >
                {[
                  {
                    label: "Plan",
                    value: selectedPlan.name,
                  },
                  {
                    label: "ROI",
                    value: `${selectedPlan.roi}%`,
                  },
                  {
                    label: "Duration",
                    value: `${selectedPlan.duration} days`,
                  },
                ].map((item) => (
                  <Box
                    key={item.label}
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
                      {item.label}
                    </Text>

                    <Text
                      mt={1}
                      fontSize="md"
                      fontWeight="700"
                      color="white"
                      noOfLines={1}
                    >
                      {item.value}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>

              <FormControl mb={5}>
                <FormLabel
                  fontSize="sm"
                  fontWeight="600"
                  color="gray.300"
                >
                  Investment amount
                </FormLabel>

                <Input
                  h="52px"
                  type="number"
                  inputMode="decimal"
                  min={selectedPlan.minimumAmount}
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`Minimum $${selectedPlan.minimumAmount}`}
                  color="white"
                  bg="whiteAlpha.50"
                  borderColor="whiteAlpha.100"
                  borderRadius="12px"
                  _placeholder={{
                    color: "gray.600",
                  }}
                  _hover={{
                    borderColor: "whiteAlpha.200",
                  }}
                  _focus={{
                    borderColor: "orange.400",
                    boxShadow:
                      "0 0 0 1px rgba(245,158,11,0.55)",
                  }}
                />
              </FormControl>

              {expectedReturn && (
                <Box
                  mb={5}
                  p={{ base: 4, md: 5 }}
                  borderRadius="16px"
                  bg="rgba(34,197,94,0.07)"
                  border="1px solid"
                  borderColor="rgba(34,197,94,0.12)"
                >
                  <Text
                    fontSize="xs"
                    color="gray.500"
                  >
                    Estimated total return
                  </Text>

                  <Text
                    mt={1}
                    fontSize={{ base: "2xl", md: "3xl" }}
                    fontWeight="800"
                    color="green.300"
                  >
                    ${expectedReturn}
                  </Text>
                </Box>
              )}

              <Button
                w="100%"
                h="54px"
                borderRadius="12px"
                bg="green.500"
                color="white"
                fontWeight="700"
                isDisabled={!amount}
                isLoading={submitting}
                loadingText="Confirming investment..."
                onClick={handleInvest}
                _hover={{
                  bg: "green.400",
                  transform: "translateY(-1px)",
                }}
                _active={{
                  transform: "translateY(0)",
                }}
              >
                Confirm investment
              </Button>

              <Flex
                align="center"
                justify="center"
                gap={2}
                mt={4}
                color="gray.600"
                fontSize="xs"
              >
                <FiCheckCircle />
                Review the amount before confirming
              </Flex>
            </Box>
          </motion.div>
        )}
      </Box>
    </Box>
  );
}

export default Investments;