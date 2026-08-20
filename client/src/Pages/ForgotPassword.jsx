import { useState } from "react";
import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await API.post("/forgot-password", {
        email,
      });

      toast({
        title: "Reset Email Sent",
        description:
          "If an account exists with that email address, we've sent a password reset link.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setEmail("");
    } catch (err) {
      toast({
        title: "Request Failed",
        description: err.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg="#07111f"
      px={5}
    >
      <Box
        as={motion.div}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        p={10}
        maxW="480px"
        w="100%"
        borderRadius="30px"
        bg="rgba(255,255,255,.05)"
        border="1px solid rgba(255,255,255,.08)"
        backdropFilter="blur(20px)"
        boxShadow="0 20px 60px rgba(0,0,0,.45)"
      >
        <Text color="white" fontSize="3xl" fontWeight="bold" mb={2}>
          Forgot Password
        </Text>

        <Text color="gray.400" mb={8}>
          Enter your email address below and we'll send you a secure password
          reset link.
        </Text>

        <VStack spacing={5}>
          <FormControl>
            <FormLabel color="gray.300">Email Address</FormLabel>

            <Input
              type="email"
              value={email}
              color="white"
              bg="rgba(255,255,255,.04)"
              border="1px solid rgba(255,255,255,.08)"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                borderColor: "orange.400",
                boxShadow: "0 0 0 1px orange",
              }}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <Button
            w="100%"
            h="55px"
            bg="orange.400"
            color="black"
            fontWeight="bold"
            isLoading={loading}
            loadingText="Sending..."
            _hover={{
              bg: "orange.300",
              transform: "translateY(-2px)",
            }}
            onClick={handleSubmit}
          >
            Send Reset Link
          </Button>

          <Text color="gray.400" textAlign="center" fontSize="sm">
            Check your inbox (and spam folder if necessary) for the password
            reset email.
          </Text>

          <Text color="gray.400">
            Remember your password?{" "}
            <Text as={Link} to="/login" color="orange.300" fontWeight="bold">
              Login
            </Text>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}

export default ForgotPassword;
