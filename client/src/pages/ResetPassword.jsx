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
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/axios";

function ResetPassword() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const toast = useToast();
  const navigate = useNavigate();

  const handleReset = async () => {
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      return;
    }

    try {
      await API.post("/reset-password", {
        token,
        password,
      });

      toast({
        title: "Password Reset Successful",
        description: "You can now login with your new password.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      toast({
        title: "Reset Failed",
        description:
          err.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };


  return (
    <Box
      minH="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg="linear-gradient(180deg,#050816,#0B1120)"
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

        <Text
          color="white"
          fontSize="3xl"
          fontWeight="bold"
          mb={2}
        >
          Reset Password
        </Text>

        <Text color="gray.400" mb={8}>
          Enter your reset token and create a new password.
        </Text>


        <VStack spacing={5}>

          <FormControl>
            <FormLabel color="gray.300">
              Reset Token
            </FormLabel>

            <Input
              value={token}
              onChange={(e)=>setToken(e.target.value)}
              color="white"
              bg="rgba(255,255,255,.04)"
              border="1px solid rgba(255,255,255,.08)"
            />
          </FormControl>


          <FormControl>
            <FormLabel color="gray.300">
              New Password
            </FormLabel>

            <Input
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              color="white"
              bg="rgba(255,255,255,.04)"
              border="1px solid rgba(255,255,255,.08)"
            />
          </FormControl>


          <FormControl>
            <FormLabel color="gray.300">
              Confirm Password
            </FormLabel>

            <Input
              type="password"
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
              color="white"
              bg="rgba(255,255,255,.04)"
              border="1px solid rgba(255,255,255,.08)"
            />
          </FormControl>


          <Button
            w="100%"
            h="55px"
            bg="orange.400"
            color="black"
            fontWeight="bold"
            _hover={{
              bg:"orange.300",
              transform:"translateY(-2px)"
            }}
            onClick={handleReset}
          >
            Reset Password
          </Button>


          <Text color="gray.400">
            Remember your password?{" "}
            <Text
              as={Link}
              to="/login"
              color="orange.300"
              fontWeight="bold"
            >
              Login
            </Text>
          </Text>


        </VStack>

      </Box>

    </Box>
  );
}

export default ResetPassword;