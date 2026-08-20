import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Input,
  Button,
  Text,
  VStack,
  InputGroup,
  InputRightElement,
  IconButton,
  HStack,
  Checkbox,
  Divider,
} from "@chakra-ui/react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { motion } from "framer-motion";
import API from "../api/axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    }
  }, []);

  const handleLogin = async () => {
    setLoading(true);

    try {
      const res = await API.post("/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
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
      bg="linear-gradient(180deg,#050816,#0B1120)"
      px={6}
      position="relative"
      overflow="hidden"
    >
      {/* Background Glow */}
      <Box
        position="absolute"
        w="500px"
        h="500px"
        bg="orange.400"
        opacity={0.08}
        filter="blur(180px)"
        top="-120px"
        left="-120px"
      />

      <Box
        position="absolute"
        w="400px"
        h="400px"
        bg="green.400"
        opacity={0.05}
        filter="blur(170px)"
        bottom="-80px"
        right="-80px"
      />

      <Box
        as={motion.div}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        w="100%"
        maxW="470px"
      >
        <Box
          p={9}
          borderRadius="30px"
          bg="rgba(255,255,255,0.05)"
          border="1px solid rgba(255,255,255,0.08)"
          backdropFilter="blur(18px)"
          boxShadow="0 20px 60px rgba(0,0,0,.45)"
        >
          <VStack spacing={6} align="stretch">
            <Box textAlign="center">
              <Text fontSize="5xl">₿</Text>

              <Text fontSize="3xl" color="white" fontWeight="bold">
                BitcoinVault
              </Text>

              <Text color="gray.400" mt={2}>
                Welcome back.
              </Text>

              <Text color="gray.500" fontSize="sm">
                Secure access to your crypto investment portfolio.
              </Text>
            </Box>

            <Divider borderColor="whiteAlpha.200" />

            <Input
              placeholder="Email Address"
              size="lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              color="white"
              bg="rgba(255,255,255,.04)"
              border="1px solid rgba(255,255,255,.08)"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                borderColor: "orange.400",
                boxShadow: "0 0 0 1px orange",
              }}
            />

            <InputGroup size="lg">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                color="white"
                bg="rgba(255,255,255,.04)"
                border="1px solid rgba(255,255,255,.08)"
                _placeholder={{ color: "gray.500" }}
                _focus={{
                  borderColor: "orange.400",
                  boxShadow: "0 0 0 1px orange",
                }}
              />

              <InputRightElement>
                <IconButton
                  size="sm"
                  variant="ghost"
                  color="gray.400"
                  icon={showPassword ? <FiEyeOff /> : <FiEye />}
                  onClick={() => setShowPassword(!showPassword)}
                />
              </InputRightElement>
            </InputGroup>

            <HStack justify="space-between">
              <Checkbox colorScheme="orange" color="gray.300">
                Remember me
              </Checkbox>

              <Text
                as={Link}
                to="/forgot-password"
                fontSize="sm"
                color="orange.300"
                cursor="pointer"
                fontWeight="bold"
                _hover={{
                  color: "orange.200",
                }}
              >
                Forgot Password?
              </Text>
            </HStack>

            <Button
              h="56px"
              bg="orange.400"
              color="black"
              fontWeight="bold"
              fontSize="lg"
              _hover={{
                bg: "orange.300",
                transform: "translateY(-2px)",
              }}
              isLoading={loading}
              loadingText="Signing In..."
              onClick={handleLogin}
            >
              Login
            </Button>

            <Box
              p={5}
              borderRadius="18px"
              bg="rgba(255,255,255,.03)"
              border="1px solid rgba(255,255,255,.06)"
            >
              <Text color="green.300" fontWeight="bold" mb={2}>
                🔒 Secure Login
              </Text>

              <Text color="gray.400" fontSize="sm" lineHeight="1.8">
                Your account is protected using encrypted authentication and
                secure access controls.
              </Text>
            </Box>

            <Text textAlign="center" color="gray.400">
              Don't have an account?{" "}
              <Text
                as={Link}
                to="/register"
                color="orange.300"
                fontWeight="bold"
              >
                Create Account
              </Text>
            </Text>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
