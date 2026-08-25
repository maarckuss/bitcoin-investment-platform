import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { FiDollarSign, FiFileText, FiPercent, FiPlus, FiShield, FiClock } from "react-icons/fi";
import API from "../api/axios";

function AdminPlans() {
  const toast = useToast();

  const [form, setForm] = useState({
    name: "",
    minimumAmount: "",
    roi: "",
    duration: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const createPlan = async () => {
    const minimumAmount = Number(form.minimumAmount);
    const roi = Number(form.roi);
    const duration = Number(form.duration);

    if (!form.name.trim()) {
      toast({
        title: "Plan name required",
        description: "Enter a name for the investment plan.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (!minimumAmount || minimumAmount <= 0) {
      toast({
        title: "Invalid minimum amount",
        description: "Enter a minimum investment greater than zero.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (!roi || roi <= 0) {
      toast({
        title: "Invalid ROI",
        description: "Enter an ROI percentage greater than zero.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (!duration || duration <= 0) {
      toast({
        title: "Invalid duration",
        description: "Enter a duration greater than zero.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await API.post(
        "/admin/plans",
        {
          name: form.name.trim(),
          minimumAmount,
          roi,
          duration,
          description: form.description.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast({
        title: "Plan created",
        description: "The investment plan is now available.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      setForm({
        name: "",
        minimumAmount: "",
        roi: "",
        duration: "",
        description: "",
      });
    } catch (err) {
      toast({
        title: "Unable to create plan",
        description:
          err.response?.data?.message ||
          "Something went wrong.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

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
            color="white"
            letterSpacing="-0.03em"
          >
            Create investment plan
          </Text>

          <Text
            mt={2}
            maxW="650px"
            color="gray.500"
            fontSize={{ base: "sm", md: "md" }}
            lineHeight="1.7"
          >
            Configure a new plan that users can select from the
            investment marketplace.
          </Text>
        </Box>

        <Box
          p={{ base: 4, sm: 5, md: 6, lg: 7 }}
          border="1px solid"
          borderColor="whiteAlpha.100"
          borderRadius={{ base: "18px", md: "22px" }}
          bg="rgba(255,255,255,0.035)"
          backdropFilter="blur(14px)"
          boxShadow="0 16px 42px rgba(0,0,0,0.18)"
        >
          <Flex
            align="flex-start"
            gap={3}
            mb={{ base: 5, md: 6 }}
            p={{ base: 4, md: 5 }}
            borderRadius="16px"
            bg="linear-gradient(135deg, rgba(59,130,246,0.07), rgba(245,158,11,0.05))"
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
              <FiPlus size={19} />
            </Flex>

            <Box>
              <Text
                fontSize="sm"
                fontWeight="700"
                color="white"
              >
                Plan configuration
              </Text>

              <Text
                mt={1}
                fontSize="xs"
                lineHeight="1.7"
                color="gray.500"
              >
                Set the investment threshold, expected return,
                duration, and description.
              </Text>
            </Box>
          </Flex>

          <VStack spacing={5} align="stretch">
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="600" color="gray.300">
                Plan name
              </FormLabel>

              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Growth Plan"
                h="52px"
                color="white"
                bg="whiteAlpha.50"
                borderColor="whiteAlpha.100"
                borderRadius="12px"
                _placeholder={{ color: "gray.600" }}
                _hover={{ borderColor: "whiteAlpha.200" }}
                _focus={{
                  borderColor: "orange.400",
                  boxShadow: "0 0 0 1px rgba(245,158,11,0.55)",
                }}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm" fontWeight="600" color="gray.300">
                Minimum investment
              </FormLabel>

              <Box position="relative">
                <Box
                  position="absolute"
                  left="14px"
                  top="50%"
                  transform="translateY(-50%)"
                  color="gray.600"
                  pointerEvents="none"
                >
                  <FiDollarSign size={16} />
                </Box>

                <Input
                  name="minimumAmount"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  value={form.minimumAmount}
                  onChange={handleChange}
                  placeholder="100"
                  pl="40px"
                  h="52px"
                  color="white"
                  bg="whiteAlpha.50"
                  borderColor="whiteAlpha.100"
                  borderRadius="12px"
                  _placeholder={{ color: "gray.600" }}
                  _hover={{ borderColor: "whiteAlpha.200" }}
                  _focus={{
                    borderColor: "orange.400",
                    boxShadow: "0 0 0 1px rgba(245,158,11,0.55)",
                  }}
                />
              </Box>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm" fontWeight="600" color="gray.300">
                ROI percentage
              </FormLabel>

              <Box position="relative">
                <Box
                  position="absolute"
                  left="14px"
                  top="50%"
                  transform="translateY(-50%)"
                  color="gray.600"
                  pointerEvents="none"
                >
                  <FiPercent size={16} />
                </Box>

                <Input
                  name="roi"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  value={form.roi}
                  onChange={handleChange}
                  placeholder="15"
                  pl="40px"
                  h="52px"
                  color="white"
                  bg="whiteAlpha.50"
                  borderColor="whiteAlpha.100"
                  borderRadius="12px"
                  _placeholder={{ color: "gray.600" }}
                  _hover={{ borderColor: "whiteAlpha.200" }}
                  _focus={{
                    borderColor: "orange.400",
                    boxShadow: "0 0 0 1px rgba(245,158,11,0.55)",
                  }}
                />
              </Box>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm" fontWeight="600" color="gray.300">
                Duration
              </FormLabel>

              <Box position="relative">
                <Box
                  position="absolute"
                  left="14px"
                  top="50%"
                  transform="translateY(-50%)"
                  color="gray.600"
                  pointerEvents="none"
                >
                  <FiClock size={16} />
                </Box>

                <Input
                  name="duration"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  step="1"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="30"
                  pl="40px"
                  h="52px"
                  color="white"
                  bg="whiteAlpha.50"
                  borderColor="whiteAlpha.100"
                  borderRadius="12px"
                  _placeholder={{ color: "gray.600" }}
                  _hover={{ borderColor: "whiteAlpha.200" }}
                  _focus={{
                    borderColor: "orange.400",
                    boxShadow: "0 0 0 1px rgba(245,158,11,0.55)",
                  }}
                />
              </Box>

              <Text mt={2} fontSize="xs" color="gray.600">
                Enter the plan duration in days.
              </Text>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm" fontWeight="600" color="gray.300">
                Description
              </FormLabel>

              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the plan and what investors can expect..."
                minH="120px"
                resize="vertical"
                color="white"
                bg="whiteAlpha.50"
                borderColor="whiteAlpha.100"
                borderRadius="12px"
                _placeholder={{ color: "gray.600" }}
                _hover={{ borderColor: "whiteAlpha.200" }}
                _focus={{
                  borderColor: "orange.400",
                  boxShadow: "0 0 0 1px rgba(245,158,11,0.55)",
                }}
              />
            </FormControl>

            <Box
              p={4}
              borderRadius="14px"
              bg="rgba(34,197,94,0.05)"
              border="1px solid"
              borderColor="rgba(34,197,94,0.10)"
            >
              <Flex align="flex-start" gap={3}>
                <Box mt={0.5} color="green.300">
                  <FiShield size={17} />
                </Box>

                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="600"
                    color="gray.200"
                  >
                    Admin-only configuration
                  </Text>

                  <Text
                    mt={1}
                    fontSize="xs"
                    lineHeight="1.7"
                    color="gray.500"
                  >
                    Review the ROI, minimum investment, and duration
                    carefully before publishing the plan.
                  </Text>
                </Box>
              </Flex>
            </Box>

            <Button
              h="54px"
              w="100%"
              borderRadius="12px"
              bg="orange.400"
              color="gray.950"
              fontWeight="700"
              isLoading={loading}
              loadingText="Creating plan..."
              onClick={createPlan}
              _hover={{
                bg: "orange.300",
                transform: "translateY(-1px)",
                boxShadow: "0 10px 24px rgba(245,158,11,0.14)",
              }}
              _active={{
                transform: "translateY(0)",
              }}
            >
              Create investment plan
            </Button>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}

export default AdminPlans;