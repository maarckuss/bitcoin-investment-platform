import { useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  FiCheckCircle,
  FiLock,
  FiSave,
  FiUser,
} from "react-icons/fi";
import API from "../api/axios";

function Profile() {
  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const toast = useToast();

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data);
      setName(res.data.name || "");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateProfile = async () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your full name.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      await API.patch(
        "/profile",
        {
          name: name.trim(),
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast({
        title: "Profile updated",
        description: "Your account details have been updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      setPassword("");
      await fetchProfile();
    } catch (err) {
      toast({
        title: "Update failed",
        description:
          err.response?.data?.message ||
          "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setSaving(false);
    }
  };

  const initials = (user.name || "?")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Box
      minH="calc(100vh - 96px)"
      bg="#0b1220"
      px={{ base: 4, sm: 5, md: 6, lg: 8 }}
      py={{ base: 5, md: 7, lg: 8 }}
      overflowX="hidden"
    >
      <Box maxW="1050px" mx="auto" w="100%">
        <Box mb={{ base: 5, md: 7 }}>
          <Text
            fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
            fontWeight="800"
            color="white"
            letterSpacing="-0.03em"
          >
            Profile
          </Text>

          <Text
            mt={2}
            color="gray.500"
            fontSize={{ base: "sm", md: "md" }}
          >
            Manage your account details and security settings.
          </Text>
        </Box>

        <Box
          p={{ base: 5, sm: 6, md: 7 }}
          mb={{ base: 5, md: 6 }}
          border="1px solid"
          borderColor="whiteAlpha.100"
          borderRadius={{ base: "18px", md: "22px" }}
          bg="linear-gradient(
            135deg,
            rgba(245,158,11,0.08),
            rgba(255,255,255,0.025)
          )"
          backdropFilter="blur(14px)"
          boxShadow="0 16px 42px rgba(0,0,0,0.18)"
        >
          <Flex
            direction={{ base: "column", sm: "row" }}
            align={{ base: "flex-start", sm: "center" }}
            gap={{ base: 4, sm: 5 }}
          >
            <Avatar
              size={{ base: "lg", md: "xl" }}
              name={user.name}
              bg="orange.400"
              color="gray.950"
              fontWeight="800"
              border="3px solid"
              borderColor="rgba(245,158,11,0.22)"
            >
              {initials}
            </Avatar>

            <Box minW="0" flex="1">
              <Flex
                align={{ base: "flex-start", sm: "center" }}
                direction={{ base: "column", sm: "row" }}
                gap={2}
              >
                <Text
                  fontSize={{ base: "xl", md: "2xl" }}
                  fontWeight="800"
                  color="white"
                  noOfLines={1}
                >
                  {user.name || "Investor Account"}
                </Text>

                <Badge
                  colorScheme={
                    user.role === "admin" ? "orange" : "blue"
                  }
                  borderRadius="full"
                  px={2.5}
                  fontSize="10px"
                  textTransform="capitalize"
                >
                  {user.role || "user"}
                </Badge>
              </Flex>

              <Text
                mt={1}
                color="gray.500"
                fontSize="sm"
                noOfLines={1}
              >
                {user.email || "Account holder"}
              </Text>

              <Flex
                wrap="wrap"
                gap={2}
                mt={4}
              >
                <Badge
                  colorScheme={user.blocked ? "red" : "green"}
                  variant="subtle"
                  borderRadius="full"
                  px={2.5}
                  fontSize="10px"
                >
                  {user.blocked ? "Blocked" : "Active"}
                </Badge>

                <Badge
                  variant="subtle"
                  borderRadius="full"
                  px={2.5}
                  fontSize="10px"
                  colorScheme="gray"
                >
                  Member since{" "}
                  {user.createdAt
                    ? new Date(
                        user.createdAt,
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })
                    : "--"}
                </Badge>
              </Flex>
            </Box>
          </Flex>
        </Box>

        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          spacing={{ base: 4, md: 5 }}
          mb={{ base: 5, md: 6 }}
        >
          <Stat
            p={{ base: 5, md: 6 }}
            border="1px solid"
            borderColor="whiteAlpha.100"
            borderRadius="18px"
            bg="rgba(255,255,255,0.035)"
            backdropFilter="blur(12px)"
          >
            <Flex align="center" gap={3}>
              <Flex
                align="center"
                justify="center"
                w="40px"
                h="40px"
                borderRadius="12px"
                bg="rgba(34,197,94,0.10)"
                color="green.300"
              >
                <FiUser />
              </Flex>

              <Box>
                <StatLabel
                  color="gray.500"
                  fontSize="xs"
                >
                  Available balance
                </StatLabel>

                <StatNumber
                  mt={1}
                  color="green.300"
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontWeight="800"
                >
                  ${user.balance || 0}
                </StatNumber>
              </Box>
            </Flex>
          </Stat>

          <Stat
            p={{ base: 5, md: 6 }}
            border="1px solid"
            borderColor="whiteAlpha.100"
            borderRadius="18px"
            bg="rgba(255,255,255,0.035)"
            backdropFilter="blur(12px)"
          >
            <Flex align="center" gap={3}>
              <Flex
                align="center"
                justify="center"
                w="40px"
                h="40px"
                borderRadius="12px"
                bg="rgba(245,158,11,0.10)"
                color="orange.300"
              >
                <FiCheckCircle />
              </Flex>

              <Box>
                <StatLabel
                  color="gray.500"
                  fontSize="xs"
                >
                  Account type
                </StatLabel>

                <StatNumber
                  mt={1}
                  color="orange.300"
                  fontSize={{ base: "xl", md: "2xl" }}
                  fontWeight="800"
                  textTransform="capitalize"
                >
                  {user.role || "user"}
                </StatNumber>
              </Box>
            </Flex>
          </Stat>
        </SimpleGrid>

        <Box
          p={{ base: 5, sm: 6, md: 7 }}
          border="1px solid"
          borderColor="whiteAlpha.100"
          borderRadius={{ base: "18px", md: "22px" }}
          bg="rgba(255,255,255,0.035)"
          backdropFilter="blur(12px)"
          boxShadow="0 12px 32px rgba(0,0,0,0.14)"
        >
          <Flex
            align="center"
            gap={3}
            mb={{ base: 5, md: 6 }}
          >
            <Flex
              align="center"
              justify="center"
              w="42px"
              h="42px"
              borderRadius="13px"
              bg="rgba(59,130,246,0.10)"
              color="blue.300"
            >
              <FiLock size={19} />
            </Flex>

            <Box>
              <Text
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="700"
                color="white"
              >
                Account settings
              </Text>

              <Text
                mt={1}
                fontSize="xs"
                color="gray.500"
              >
                Update your profile and password.
              </Text>
            </Box>
          </Flex>

          <VStack spacing={5} align="stretch">
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
                color="white"
                bg="whiteAlpha.50"
                borderColor="whiteAlpha.100"
                borderRadius="12px"
                _hover={{
                  borderColor: "whiteAlpha.200",
                }}
                _focus={{
                  borderColor: "orange.400",
                  boxShadow:
                    "0 0 0 1px rgba(245,158,11,0.55)",
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
                value={user.email || ""}
                isReadOnly
                color="gray.500"
                bg="whiteAlpha.30"
                borderColor="whiteAlpha.80"
                borderRadius="12px"
              />
            </FormControl>

            <Divider borderColor="whiteAlpha.100" />

            <Box>
              <Text
                fontSize="sm"
                fontWeight="700"
                color="white"
              >
                Security
              </Text>

              <Text
                mt={1}
                fontSize="xs"
                color="gray.500"
              >
                Leave the password field empty if you don't want to
                change it.
              </Text>
            </Box>

            <FormControl>
              <FormLabel
                mb={2}
                fontSize="sm"
                fontWeight="600"
                color="gray.300"
              >
                New password
              </FormLabel>

              <Input
                h="52px"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a new password"
                color="white"
                bg="whiteAlpha.50"
                borderColor="whiteAlpha.100"
                borderRadius="12px"
                _placeholder={{
                  color: "gray.600",
                }}
                _hover={{
                  borderColor: "whiteAlpha.200",
                }}
                _focus={{
                  borderColor: "orange.400",
                  boxShadow:
                    "0 0 0 1px rgba(245,158,11,0.55)",
                }}
              />
            </FormControl>

            <Button
              w="100%"
              h="52px"
              borderRadius="12px"
              bg="orange.400"
              color="gray.950"
              fontWeight="700"
              leftIcon={<FiSave />}
              isLoading={saving}
              loadingText="Saving changes..."
              onClick={updateProfile}
              _hover={{
                bg: "orange.300",
                transform: "translateY(-1px)",
                boxShadow:
                  "0 10px 24px rgba(245,158,11,0.14)",
              }}
              _active={{
                transform: "translateY(0)",
              }}
            >
              Save changes
            </Button>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}

export default Profile;