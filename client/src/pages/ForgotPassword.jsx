import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiMail,
  FiShield,
} from "react-icons/fi";
import { motion } from "framer-motion";
import API from "../api/axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast({
        title: "Email required",
        description: "Enter your account email to continue.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      return;
    }

    setLoading(true);

    try {
      await API.post("/forgot-password", {
        email: trimmedEmail,
      });

      toast({
        title: "Check your inbox",
        description:
          "If an account exists with that email, a password reset link has been sent.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      setEmail("");
    } catch (err) {
      toast({
        title: "Request failed",
        description:
          err.response?.data?.message ||
          "Something went wrong. Please try again.",
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
      minH="100vh"
      bg="#070b14"
      position="relative"
      overflow="hidden"
      color="white"
    >
      <Box
        position="absolute"
        top="-160px"
        left="-120px"
        w={{ base: "280px", md: "520px" }}
        h={{ base: "280px", md: "520px" }}
        borderRadius="full"
        bg="orange.400"
        opacity={0.08}
        filter="blur(140px)"
        pointerEvents="none"
      />

      <Box
        position="absolute"
        right="-140px"
        bottom="-160px"
        w={{ base: "300px", md: "520px" }}
        h={{ base: "300px", md: "520px" }}
        borderRadius="full"
        bg="blue.500"
        opacity={0.06}
        filter="blur(150px)"
        pointerEvents="none"
      />

      <Flex
        minH="100vh"
        align="center"
        justify="center"
        px={{ base: 4, sm: 6, md: 8 }}
        py={{ base: 6, md: 10 }}
      >
        <Box
          as={motion.div}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          w="100%"
          maxW="460px"
        >
          <Box
            p={{ base: 5, sm: 7, md: 8 }}
            border="1px solid"
            borderColor="whiteAlpha.100"
            borderRadius={{ base: "20px", md: "26px" }}
            bg="rgba(15,23,42,0.78)"
            backdropFilter="blur(20px)"
            boxShadow="0 24px 70px rgba(0,0,0,0.36)"
          >
            <VStack spacing={{ base: 5, md: 6 }} align="stretch">
              <Box textAlign="center">
                <Flex
                  align="center"
                  justify="center"
                  w="54px"
                  h="54px"
                  mx="auto"
                  borderRadius="16px"
                  bg="rgba(245,158,11,0.10)"
                  border="1px solid"
                  borderColor="rgba(245,158,11,0.18)"
                  color="orange.300"
                >
                  <FiMail size={23} />
                </Flex>

                <Text
                  mt={5}
                  fontSize={{ base: "2xl", sm: "3xl" }}
                  fontWeight="800"
                  letterSpacing="-0.03em"
                >
                  Reset your password
                </Text>

                <Text
                  mt={2}
                  fontSize="sm"
                  color="gray.500"
                  lineHeight="1.7"
                >
                  Enter your account email and we'll send you a secure
                  password reset link.
                </Text>
              </Box>

              <Divider borderColor="whiteAlpha.100" />

              <FormControl>
                <FormLabel
                  mb={2}
                  fontSize="sm"
                  fontWeight="600"
                  color="gray.300"
                >
                  Email address
                </FormLabel>

                <Input
                  h="52px"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  color="white"
                  bg="whiteAlpha.50"
                  borderColor="whiteAlpha.100"
                  borderRadius="13px"
                  _placeholder={{
                    color: "gray.600",
                  }}
                  _hover={{
                    borderColor: "whiteAlpha.200",
                  }}
                  _focus={{
                    borderColor: "orange.400",
                    boxShadow:
                      "0 0 0 1px rgba(245,158,11,0.6)",
                  }}
                />
              </FormControl>

              <Button
                h="54px"
                w="100%"
                borderRadius="13px"
                bg="orange.400"
                color="gray.950"
                fontWeight="700"
                rightIcon={<FiArrowRight />}
                isLoading={loading}
                loadingText="Sending..."
                onClick={handleSubmit}
                _hover={{
                  bg: "orange.300",
                  transform: "translateY(-1px)",
                  boxShadow:
                    "0 10px 26px rgba(245,158,11,0.18)",
                }}
                _active={{
                  transform: "translateY(0)",
                }}
              >
                Send reset link
              </Button>

              <Box
                p={4}
                borderRadius="15px"
                bg="rgba(59,130,246,0.05)"
                border="1px solid"
                borderColor="rgba(59,130,246,0.10)"
              >
                <Flex align="flex-start" gap={3}>
                  <Box
                    mt={0.5}
                    color="blue.300"
                    flexShrink={0}
                  >
                    <FiCheckCircle />
                  </Box>

                  <Box>
                    <Text
                      fontSize="sm"
                      fontWeight="600"
                      color="gray.200"
                    >
                      Check your inbox
                    </Text>

                    <Text
                      mt={1}
                      fontSize="xs"
                      lineHeight="1.7"
                      color="gray.500"
                    >
                      Check your inbox and spam folder if the reset
                      email doesn't appear shortly.
                    </Text>
                  </Box>
                </Flex>
              </Box>

              <Flex
                align="center"
                justify="center"
                gap={2}
                color="gray.600"
                fontSize="xs"
              >
                <FiShield />
                Secure password recovery
              </Flex>

              <Text
                textAlign="center"
                fontSize="sm"
                color="gray.500"
              >
                Remember your password?{" "}
                <Text
                  as={Link}
                  to="/login"
                  color="orange.300"
                  fontWeight="700"
                  _hover={{
                    color: "orange.200",
                  }}
                >
                  Sign in
                </Text>
              </Text>

              <Text
                as={Link}
                to="/login"
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={2}
                color="gray.600"
                fontSize="xs"
                _hover={{
                  color: "gray.300",
                }}
              >
                <FiArrowLeft />
                Back to login
              </Text>
            </VStack>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

export default ForgotPassword;