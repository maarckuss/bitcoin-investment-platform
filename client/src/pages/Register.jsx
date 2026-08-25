import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
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

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password) {
      toast({
        title: "Missing information",
        description: "Complete all fields to create your account.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setLoading(true);

    try {
      await API.post("/register", {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      toast({
        title: "Account created",
        description: "Your account is ready. You can now sign in.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      navigate("/login");
    } catch (err) {
      toast({
        title: "Registration failed",
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
          maxW="480px"
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
                  Create your account
                </Text>

                <Text
                  mt={2}
                  fontSize="sm"
                  color="gray.500"
                  lineHeight="1.7"
                >
                  Set up your BitcoinVault account and start managing
                  your portfolio.
                </Text>
              </Box>

              <Divider borderColor="whiteAlpha.100" />

              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel
                    mb={2}
                    fontSize="sm"
                    fontWeight="600"
                    color="gray.300"
                  >
                    Full name
                  </FormLabel>

                  <Input
                    h="52px"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    type="text"
                    autoComplete="name"
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
                </FormControl>

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
                </FormControl>

                <FormControl>
                  <FormLabel
                    mb={2}
                    fontSize="sm"
                    fontWeight="600"
                    color="gray.300"
                  >
                    Password
                  </FormLabel>

                  <InputGroup>
                    <Input
                      h="52px"
                      pr="48px"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
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
                </FormControl>
              </VStack>

              <Button
                h="54px"
                color="gray.950"
                bg="orange.400"
                borderRadius="13px"
                fontSize="md"
                fontWeight="700"
                rightIcon={<FiArrowRight />}
                isLoading={loading}
                loadingText="Creating account..."
                onClick={handleRegister}
                _hover={{
                  bg: "orange.300",
                  transform: "translateY(-1px)",
                  boxShadow: "0 10px 26px rgba(245,158,11,0.18)",
                }}
                _active={{
                  transform: "translateY(0)",
                }}
              >
                Create account
              </Button>

              <Flex
                align="center"
                justify="center"
                gap={2}
                color="gray.500"
                fontSize="xs"
              >
                <FiShield />
                Secure account creation
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
                      Secure registration
                    </Text>

                    <Text
                      mt={1}
                      fontSize="xs"
                      lineHeight="1.7"
                      color="gray.500"
                    >
                      Your account credentials are protected with
                      secure authentication and encrypted access.
                    </Text>
                  </Box>
                </Flex>
              </Box>

              <Text
                textAlign="center"
                fontSize="sm"
                color="gray.500"
              >
                Already have an account?{" "}
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
            </VStack>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

export default Register;