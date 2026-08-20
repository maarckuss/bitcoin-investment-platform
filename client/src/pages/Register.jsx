import { useState } from "react";
import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  IconButton,
  Divider,
} from "@chakra-ui/react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@chakra-ui/react";

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
    setLoading(true);

    try {
      await API.post("/register", {
        name,
        email,
        password,
      });

      toast({
        title: "Account Created",
        description: "Your CryptoVest account is ready. You can now login.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      navigate("/login");

    } catch (err) {
      toast({
        title: "Registration Failed",
        description:
          err.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
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
        initial={{ opacity:0, y:40 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:0.5 }}
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

              <Text fontSize="5xl">
                ₿
              </Text>

              <Text
                fontSize="3xl"
                color="white"
                fontWeight="bold"
              >
                Create CryptoVest Account
              </Text>

              <Text color="gray.400" mt={2}>
                Start managing your digital investments securely.
              </Text>

            </Box>


            <Divider borderColor="whiteAlpha.200"/>


            <FormControl>
              <FormLabel color="gray.300">
                Full Name
              </FormLabel>

              <Input
                size="lg"
                placeholder="Enter your name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                color="white"
                bg="rgba(255,255,255,.04)"
                border="1px solid rgba(255,255,255,.08)"
                _placeholder={{
                  color:"gray.500"
                }}
                _focus={{
                  borderColor:"orange.400",
                  boxShadow:"0 0 0 1px orange"
                }}
              />

            </FormControl>



            <FormControl>
              <FormLabel color="gray.300">
                Email Address
              </FormLabel>

              <Input
                size="lg"
                placeholder="Enter your email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                color="white"
                bg="rgba(255,255,255,.04)"
                border="1px solid rgba(255,255,255,.08)"
                _placeholder={{
                  color:"gray.500"
                }}
                _focus={{
                  borderColor:"orange.400",
                  boxShadow:"0 0 0 1px orange"
                }}
              />

            </FormControl>



            <FormControl>

              <FormLabel color="gray.300">
                Password
              </FormLabel>


              <InputGroup size="lg">

                <Input
                  type={showPassword ? "text":"password"}
                  placeholder="Create password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  color="white"
                  bg="rgba(255,255,255,.04)"
                  border="1px solid rgba(255,255,255,.08)"
                  _placeholder={{
                    color:"gray.500"
                  }}
                  _focus={{
                    borderColor:"orange.400",
                    boxShadow:"0 0 0 1px orange"
                  }}
                />


                <InputRightElement>

                  <IconButton
                    size="sm"
                    variant="ghost"
                    color="gray.400"
                    icon={
                      showPassword
                      ? <FiEyeOff/>
                      : <FiEye/>
                    }
                    onClick={()=>
                      setShowPassword(!showPassword)
                    }
                  />

                </InputRightElement>

              </InputGroup>

            </FormControl>



            <Button
              h="56px"
              bg="orange.400"
              color="black"
              fontSize="lg"
              fontWeight="bold"
              isLoading={loading}
              loadingText="Creating Account..."
              onClick={handleRegister}
              _hover={{
                bg:"orange.300",
                transform:"translateY(-2px)"
              }}
            >
              Create Account
            </Button>



            <Box
              p={5}
              borderRadius="18px"
              bg="rgba(255,255,255,.03)"
              border="1px solid rgba(255,255,255,.06)"
            >

              <Text
                color="green.300"
                fontWeight="bold"
                mb={2}
              >
                🔒 Secure Registration
              </Text>


              <Text
                color="gray.400"
                fontSize="sm"
                lineHeight="1.8"
              >
                Your personal information is protected with
                secure authentication and encrypted account access.
              </Text>

            </Box>



            <Text
              textAlign="center"
              color="gray.400"
            >
              Already have an account?{" "}

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

    </Box>
  );
}

export default Register;