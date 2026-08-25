import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiLock,
  FiShield,
} from "react-icons/fi";
import { motion } from "framer-motion";
import API from "../api/axios";

function ResetPassword() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const urlToken = searchParams.get("token");

    if (urlToken) {
      setToken(urlToken);
    }
  }, [searchParams]);

  const handleReset = async () => {
    if (!token.trim()) {
      toast({
        title: "Reset link missing",
        description: "Open the password reset link from your email again.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      return;
    }

    if (!password || !confirmPassword) {
      toast({
        title: "Password required",
        description: "Enter and confirm your new password.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Make sure both password fields are identical.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Your new password should contain at least 6 characters.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      return;
    }

    try {
      setLoading(true);

      await API.post("/reset-password", {
        token: token.trim(),
        password,
      });

      toast({
        title: "Password reset successful",
        description: "Your password has been updated. You can now sign in.",
        status: "success",
        duration: 3500,
        isClosable: true,
        position: "top",
      });

      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      toast({
        title: "Reset failed",
        description:
          err.response?.data?.message ||
          "The reset link may have expired. Please request a new one.",
        status: "error",
        duration: 5000,
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
          maxW="470px"
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
                  <FiLock size={23} />
                </Flex>

                <Text
                  mt={5}
                  fontSize={{ base: "2xl", sm: "3xl" }}
                  fontWeight="800"
                  letterSpacing="-0.03em"
                >
                  Create a new password
                </Text>

                <Text mt={2} fontSize="sm" color="gray.500" lineHeight="1.7">
                  Choose a secure password for your BitcoinVault account.
                </Text>
              </Box>

              <Divider borderColor="whiteAlpha.100" />

              {!searchParams.get("token") && (
                <FormControl>
                  <FormLabel
                    mb={2}
                    fontSize="sm"
                    fontWeight="600"
                    color="gray.300"
                  >
                    Reset token
                  </FormLabel>

                  <Input
                    h="52px"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Paste your reset token"
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
              )}

              <FormControl>
                <FormLabel
                  mb={2}
                  fontSize="sm"
                  fontWeight="600"
                  color="gray.300"
                >
                  New password
                </FormLabel>

                <InputGroup>
                  <Input
                    h="52px"
                    pr="48px"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a new password"
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
                        showPassword ? "Hide password" : "Show password"
                      }
                      icon={showPassword ? <FiEyeOff /> : <FiEye />}
                      variant="ghost"
                      color="gray.500"
                      size="sm"
                      borderRadius="10px"
                      onClick={() => setShowPassword(!showPassword)}
                      _hover={{
                        color: "white",
                        bg: "whiteAlpha.100",
                      }}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl>
                <FormLabel
                  mb={2}
                  fontSize="sm"
                  fontWeight="600"
                  color="gray.300"
                >
                  Confirm password
                </FormLabel>

                <InputGroup>
                  <Input
                    h="52px"
                    pr="48px"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
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
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                      icon={showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                      variant="ghost"
                      color="gray.500"
                      size="sm"
                      borderRadius="10px"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      _hover={{
                        color: "white",
                        bg: "whiteAlpha.100",
                      }}
                    />
                  </InputRightElement>
                </InputGroup>
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
                loadingText="Updating password..."
                onClick={handleReset}
                _hover={{
                  bg: "orange.300",
                  transform: "translateY(-1px)",
                  boxShadow: "0 10px 26px rgba(245,158,11,0.18)",
                }}
                _active={{
                  transform: "translateY(0)",
                }}
              >
                Reset password
              </Button>

              <Box
                p={4}
                borderRadius="15px"
                bg="rgba(34,197,94,0.06)"
                border="1px solid"
                borderColor="rgba(34,197,94,0.10)"
              >
                <Flex align="flex-start" gap={3}>
                  <Box mt={0.5} color="green.300" flexShrink={0}>
                    <FiCheckCircle />
                  </Box>

                  <Box>
                    <Text fontSize="sm" fontWeight="600" color="gray.200">
                      Secure password recovery
                    </Text>

                    <Text
                      mt={1}
                      fontSize="xs"
                      lineHeight="1.7"
                      color="gray.500"
                    >
                      Use a strong password that you don't reuse on other
                      services.
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
                Protected account recovery
              </Flex>

              <Text textAlign="center" fontSize="sm" color="gray.500">
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

export default ResetPassword;
