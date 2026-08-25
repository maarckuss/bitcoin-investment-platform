import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Flex,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  FiCalendar,
  FiHash,
  FiUser,
} from "react-icons/fi";
import API from "../api/axios";

function AccountOverview() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  const accountId = user?._id?.slice(-8) || "N/A";
  const accountType = user?.role || "user";

  return (
    <Box
      w="100%"
      h="100%"
      p={{ base: 4, sm: 5, md: 6 }}
      border="1px solid"
      borderColor="whiteAlpha.100"
      borderRadius={{ base: "16px", md: "20px" }}
      bg="rgba(255,255,255,0.035)"
      backdropFilter="blur(12px)"
      boxShadow="0 10px 30px rgba(0,0,0,0.14)"
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
          flexShrink={0}
          borderRadius="14px"
          bg="rgba(59,130,246,0.12)"
          color="blue.300"
        >
          <FiUser size={19} />
        </Flex>

        <Box minW="0">
          <Text
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="700"
            color="white"
          >
            Account Overview
          </Text>

          <Text
            mt={0.5}
            fontSize="xs"
            color="gray.500"
          >
            Your account information
          </Text>
        </Box>
      </Flex>

      <Box
        p={{ base: 4, md: 5 }}
        mb={4}
        borderRadius="16px"
        bg="whiteAlpha.40"
        border="1px solid"
        borderColor="whiteAlpha.80"
      >
        <Text
          fontSize="md"
          fontWeight="700"
          color="white"
          noOfLines={1}
        >
          {user?.name || "Investor Account"}
        </Text>

        <Text
          mt={1}
          fontSize="sm"
          color="gray.500"
          noOfLines={1}
        >
          {user?.email || "Account holder"}
        </Text>
      </Box>

      <VStack spacing={0} align="stretch">
        <Flex
          align="center"
          justify="space-between"
          gap={4}
          py={4}
          borderBottom="1px solid"
          borderColor="whiteAlpha.80"
        >
          <Flex
            align="center"
            gap={3}
            minW="0"
            color="gray.500"
          >
            <FiCalendar size={16} />
            <Text fontSize="sm">
              Member Since
            </Text>
          </Flex>

          <Text
            flexShrink={0}
            fontSize="sm"
            color="gray.200"
            textAlign="right"
          >
            {memberSince}
          </Text>
        </Flex>

        <Flex
          align="center"
          justify="space-between"
          gap={4}
          py={4}
          borderBottom="1px solid"
          borderColor="whiteAlpha.80"
        >
          <Flex
            align="center"
            gap={3}
            color="gray.500"
          >
            <FiHash size={16} />
            <Text fontSize="sm">
              Account ID
            </Text>
          </Flex>

          <Text
            flexShrink={0}
            fontSize="sm"
            fontFamily="mono"
            color="gray.200"
          >
            #{accountId}
          </Text>
        </Flex>

        <Flex
          align="center"
          justify="space-between"
          gap={4}
          py={4}
          borderBottom="1px solid"
          borderColor="whiteAlpha.80"
        >
          <Text
            fontSize="sm"
            color="gray.500"
          >
            Status
          </Text>

          <Badge
            colorScheme="green"
            variant="subtle"
            borderRadius="full"
            px={2.5}
            fontSize="10px"
          >
            ACTIVE
          </Badge>
        </Flex>

        <Flex
          align="center"
          justify="space-between"
          gap={4}
          py={4}
        >
          <Text
            fontSize="sm"
            color="gray.500"
          >
            Account Type
          </Text>

          <Badge
            colorScheme={accountType === "admin" ? "purple" : "blue"}
            variant="subtle"
            borderRadius="full"
            px={2.5}
            fontSize="10px"
            textTransform="capitalize"
          >
            {accountType}
          </Badge>
        </Flex>
      </VStack>
    </Box>
  );
}

export default AccountOverview;