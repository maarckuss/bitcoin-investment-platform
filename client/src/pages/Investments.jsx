import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Text,
  SimpleGrid,
  Button,
  Spinner,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";

import API from "../api/axios";

function Investments() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleInvest = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.post(
        "/invest",
        {
          planId: selectedPlan._id,
          amount: Number(amount),
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
      });

      setAmount("");
      setSelectedPlan(null);
    } catch (err) {
      toast({
        title: "Investment failed",
        description: err.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

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
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <Box
        minH="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Spinner size="xl" color="blue.400" />
      </Box>
    );
  }

  return (
    <Box p={8} minH="100vh" bg="transparent">
      <Box maxW="1200px" mx="auto">
        <Text fontSize="3xl" fontWeight="bold" color="white" mb={2}>
          Investment Plans
        </Text>

        <Text color="gray.400" mb={8}>
          Choose a plan and grow your portfolio
        </Text>

        <SimpleGrid
          columns={{
            base: 1,
            md: 2,
            lg: 3,
          }}
          spacing={6}
        >
          {plans.map((plan, index) => (
            <Box
              key={plan._id}
              as={motion.div}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Box
                p={7}
                borderRadius="24px"
                bg="linear-gradient(
        145deg,
        rgba(255,255,255,0.08),
        rgba(255,255,255,0.03)
      )"
                border="1px solid rgba(255,255,255,0.1)"
                color="white"
                boxShadow="0 15px 35px rgba(0,0,0,0.35)"
                position="relative"
                overflow="hidden"
              >
                <Box
                  position="absolute"
                  top="0"
                  right="0"
                  bg="orange.400"
                  px={4}
                  py={1}
                  borderBottomLeftRadius="15px"
                >
                  <Text fontSize="xs" fontWeight="bold" color="black">
                    {index === 1 ? "POPULAR" : "BITCOIN PLAN"}
                  </Text>
                </Box>

                <Text fontSize="2xl" fontWeight="bold" mb={5}>
                  {plan.name}
                </Text>

                <Box
                  display="inline-flex"
                  px={5}
                  py={2}
                  borderRadius="full"
                  bg="rgba(34,197,94,0.15)"
                  border="1px solid rgba(34,197,94,0.4)"
                  mb={3}
                >
                  <Text fontSize="3xl" fontWeight="bold" color="green.300">
                    {plan.roi}% ROI
                  </Text>
                </Box>

                <Text color="gray.400" mb={6}>
                  Expected Return
                </Text>

                <Text color="gray.300" fontSize="sm" mb={5} lineHeight="1.7">
                  {plan.description}
                </Text>

                <VStack align="stretch" spacing={3} mb={7}>
                  <Text color="gray.300">
                    💰 Minimum Investment:
                    <b> ${plan.minimumAmount}</b>
                  </Text>

                  <Text color="gray.300">
                    ⏳ Duration:
                    <b> {plan.duration} days</b>
                  </Text>

                  <Text color="gray.300">🔒 Secure Bitcoin Allocation</Text>

                  <Text color="gray.300">
                    📊 Professional Portfolio Management
                  </Text>
                </VStack>

                <Button
                  width="100%"
                  size="lg"
                  bg="orange.400"
                  color="black"
                  fontWeight="bold"
                  _hover={{
                    bg: "orange.300",
                    transform: "scale(1.03)",
                  }}
                  onClick={() => setSelectedPlan(plan)}
                >
                  Start Investing
                </Button>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
      {selectedPlan && (
        <Box
          mt={10}
          p={8}
          borderRadius="24px"
          bg="linear-gradient(
      145deg,
      rgba(255,255,255,0.08),
      rgba(255,255,255,0.03)
    )"
          border="1px solid rgba(255,255,255,0.1)"
          color="white"
          boxShadow="0 15px 35px rgba(0,0,0,0.35)"
        >
          <Text fontSize="2xl" fontWeight="bold" mb={6}>
            Confirm Your Investment
          </Text>

          <VStack spacing={4} align="stretch">
            <Box
              p={4}
              borderRadius="16px"
              bg="rgba(255,255,255,0.04)"
              border="1px solid rgba(255,255,255,0.08)"
            >
              <Text color="gray.400" fontSize="sm">
                Selected Plan
              </Text>

              <Text fontSize="xl" fontWeight="bold">
                {selectedPlan.name}
              </Text>
            </Box>

            <Box
              display="flex"
              gap={4}
              flexDirection={{
                base: "column",
                md: "row",
              }}
            >
              <Box
                flex="1"
                p={4}
                borderRadius="16px"
                bg="rgba(255,255,255,0.04)"
              >
                <Text color="gray.400" fontSize="sm">
                  ROI
                </Text>

                <Text fontSize="2xl" fontWeight="bold" color="green.300">
                  {selectedPlan.roi}%
                </Text>
              </Box>

              <Box
                flex="1"
                p={4}
                borderRadius="16px"
                bg="rgba(255,255,255,0.04)"
              >
                <Text color="gray.400" fontSize="sm">
                  Duration
                </Text>

                <Text fontSize="2xl" fontWeight="bold">
                  {selectedPlan.duration} Days
                </Text>
              </Box>
            </Box>

            <Box>
              <Text color="gray.300" mb={2} fontWeight="medium">
                Investment Amount
              </Text>

              <Input
                placeholder={`Minimum $${selectedPlan.minimumAmount}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                bg="rgba(255,255,255,0.05)"
                border="1px solid rgba(255,255,255,0.15)"
                color="white"
                _placeholder={{
                  color: "gray.500",
                }}
              />
            </Box>

            {amount && (
              <Box
                p={5}
                borderRadius="18px"
                bg="rgba(34,197,94,0.12)"
                border="1px solid rgba(34,197,94,0.3)"
              >
                <Text color="gray.300" fontSize="sm">
                  Expected Return
                </Text>

                <Text fontSize="3xl" fontWeight="bold" color="green.300">
                  $
                  {(
                    Number(amount) +
                    (Number(amount) * Number(selectedPlan.roi)) / 100
                  ).toFixed(2)}
                </Text>
              </Box>
            )}

            <Button
              colorScheme="green"
              size="lg"
              width="100%"
              isDisabled={!amount}
              onClick={handleInvest}
            >
              Confirm Investment
            </Button>

            <Button
              width="100%"
              variant="ghost"
              onClick={() => {
                setSelectedPlan(null);
                setAmount("");
              }}
            >
              Cancel
            </Button>
          </VStack>
        </Box>
      )}{" "}
    </Box>
  );
}

export default Investments;
