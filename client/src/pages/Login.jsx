import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  FiArrowRight,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiShield,
} from "react-icons/fi";
import { motion } from "framer-motion";
import API from "../api/axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      toast({
        title: "Missing information",
        description: "Enter your email and password to continue.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/login", {
        email: email.trim(),
        password,
      });

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch (err) {
      toast({
        title: "Unable to sign in",
        description:
          err.response?.data?.message ||
          "Please check your credentials and try again.",
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
                  fontSize="2xl"
                  fontWeight="800"
                >
                  ₿
                </Flex>

                <Text
                  mt={5}
                  fontSize={{ base: "2xl", sm: "3xl" }}
                  fontWeight="800"
                  letterSpacing="-0.03em"
                >
                  Welcome back
                </Text>

                <Text
                  mt={2}
                  fontSize="sm"
                  color="gray.500"
                  lineHeight="1.7"
                >
                  Sign in to manage your portfolio and investments.
                </Text>
              </Box>

              <Divider borderColor="whiteAlpha.100" />

              <VStack spacing={4} align="stretch">
                <Box>
                  <Text
                    mb={2}
                    fontSize="sm"
                    fontWeight="600"
                    color="gray.300"
                  >
                    Email address
                  </Text>

                  <Input
                    h="52px"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    type="email"
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
                      boxShadow: "0 0 0 1px rgba(245,158,11,0.6)",
                    }}
                  />
                </Box>

                <Box>
                  <Text
                    mb={2}
                    fontSize="sm"
                    fontWeight="600"
                    color="gray.300"
                  >
                    Password
                  </Text>

                  <InputGroup>
                    <Input
                      h="52px"
                      pr="48px"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
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
                        boxShadow: "0 0 0 1px rgba(245,158,11,0.6)",
                      }}
                    />

                    <InputRightElement h="52px" w="48px">
                      <IconButton
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        icon={
                          showPassword ? <FiEyeOff /> : <FiEye />
                        }
                        variant="ghost"
                        color="gray.500"
                        size="sm"
                        borderRadius="10px"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        _hover={{
                          color: "white",
                          bg: "whiteAlpha.100",
                        }}
                      />
                    </InputRightElement>
                  </InputGroup>
                </Box>
              </VStack>

              <Flex
                align={{ base: "flex-start", sm: "center" }}
                justify="space-between"
                direction={{ base: "column", sm: "row" }}
                gap={3}
              >
                <Checkbox
                  colorScheme="orange"
                  color="gray.400"
                  size="sm"
                >
                  Remember me
                </Checkbox>

                <Text
                  as={Link}
                  to="/forgot-password"
                  fontSize="sm"
                  fontWeight="600"
                  color="orange.300"
                  _hover={{
                    color: "orange.200",
                  }}
                >
                  Forgot password?
                </Text>
              </Flex>

              <Button
                h="54px"
                color="gray.950"
                bg="orange.400"
                borderRadius="13px"
                fontSize="md"
                fontWeight="700"
                rightIcon={<FiArrowRight />}
                isLoading={loading}
                loadingText="Signing in..."
                onClick={handleLogin}
                _hover={{
                  bg: "orange.300",
                  transform: "translateY(-1px)",
                  boxShadow: "0 10px 26px rgba(245,158,11,0.18)",
                }}
                _active={{
                  transform: "translateY(0)",
                }}
              >
                Sign in
              </Button>

              <Flex
                align="center"
                justify="center"
                gap={2}
                color="gray.500"
                fontSize="xs"
              >
                <FiShield />
                Secure account access
              </Flex>

              <Box
                p={4}
                borderRadius="15px"
                bg="rgba(34,197,94,0.06)"
                border="1px solid"
                borderColor="rgba(34,197,94,0.10)"
              >
                <Flex align="flex-start" gap={3}>
                  <Box
                    mt={0.5}
                    color="green.300"
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
                      Protected access
                    </Text>

                    <Text
                      mt={1}
                      fontSize="xs"
                      lineHeight="1.7"
                      color="gray.500"
                    >
                      Your account is protected with secure
                      authentication and encrypted access controls.
                    </Text>
                  </Box>
                </Flex>
              </Box>

              <Text
                textAlign="center"
                fontSize="sm"
                color="gray.500"
              >
                Don't have an account?{" "}
                <Text
                  as={Link}
                  to="/register"
                  color="orange.300"
                  fontWeight="700"
                  _hover={{
                    color: "orange.200",
                  }}
                >
                  Create one
                </Text>
              </Text>
            </VStack>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

export default Login;