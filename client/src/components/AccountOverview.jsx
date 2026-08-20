import { useEffect, useState } from "react";

import { Box, Text, VStack, HStack, Badge } from "@chakra-ui/react";

import { FiUser, FiCalendar, FiHash } from "react-icons/fi";

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
  return (
    <Box
      p={6}
      borderRadius="20px"
      bg="rgba(255,255,255,0.04)"
      border="1px solid rgba(255,255,255,0.08)"
      color="white"
      boxShadow="0 8px 24px rgba(0,0,0,0.25)"
    >
      <Text fontSize="xl" fontWeight="bold" mb={5}>
        Account Overview
      </Text>

      <VStack spacing={5} align="stretch">
        <HStack spacing={4}>
          <Box
            p={3}
            borderRadius="full"
            bg="rgba(59,130,246,0.15)"
            color="blue.400"
          >
            <FiUser />
          </Box>

          <Box>
            <Text fontWeight="bold">{user?.name || "Investor Account"}</Text>

            <Text fontSize="sm" color="gray.400">
              {user?.email || "Account holder"}
            </Text>
          </Box>
        </HStack>

        <HStack justify="space-between">
          <HStack>
            <FiCalendar />

            <Text color="gray.300">Member Since</Text>
          </HStack>

          <Text>
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })
              : "Recently"}
          </Text>
        </HStack>

        <HStack justify="space-between">
          <HStack>
            <FiHash />

            <Text color="gray.300">Account ID</Text>
          </HStack>

          <Text>{user?._id?.slice(-8) || "N/A"}</Text>
        </HStack>

        <HStack justify="space-between">
          <Text color="gray.300">Status</Text>

          <Badge colorScheme="green">ACTIVE</Badge>
        </HStack>

        <HStack justify="space-between">
          <Text color="gray.300">Account Type</Text>

          <Badge colorScheme={user?.role === "admin" ? "purple" : "blue"}>
            {user?.role || "user"}
          </Badge>
        </HStack>
      </VStack>
    </Box>
  );
}

export default AccountOverview;
