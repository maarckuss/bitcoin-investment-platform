import { useEffect, useState } from "react";

import { Box, Text, VStack, Spinner, Button, HStack } from "@chakra-ui/react";

import API from "../api/axios";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get("/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setNotifications(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const toggleReadStatus = async (notification) => {
    try {
      const token = localStorage.getItem("token");

      const endpoint = notification.read
        ? `/notifications/${notification._id}/unread`
        : `/notifications/${notification._id}/read`;

      await API.patch(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notification._id
            ? {
                ...item,
                read: !notification.read,
              }
            : item,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (message) => {
    const text = message.toLowerCase();

    if (text.includes("deposit")) {
      return "💰";
    }

    if (text.includes("withdraw")) {
      return "💸";
    }

    if (text.includes("investment")) {
      return "📈";
    }

    return "🔔";
  };

  const unreadCount = notifications.filter((item) => !item.read).length;

  if (loading) {
    return (
      <Box
        minH="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.400" />

          <Text color="gray.400">Loading notifications...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box p={8} minH="100vh">
      <Box maxW="900px" mx="auto">
        <HStack justify="space-between" mb={2}>
          <Text fontSize="3xl" fontWeight="bold" color="white">
            Notifications
          </Text>

          {unreadCount > 0 && (
            <Box px={4} py={2} borderRadius="full" bg="blue.500">
              <Text color="white" fontWeight="bold" fontSize="sm">
                {unreadCount} New
              </Text>
            </Box>
          )}
        </HStack>

        <Text color="gray.400" mb={8}>
          Stay updated with your deposits, withdrawals, investments and account
          activity.
        </Text>

        <VStack spacing={5} align="stretch">
          {notifications.length === 0 ? (
            <Box
              p={10}
              borderRadius="24px"
              textAlign="center"
              bg="rgba(255,255,255,0.04)"
              border="1px solid rgba(255,255,255,0.08)"
            >
              <Text fontSize="5xl" mb={4}>
                🔔
              </Text>

              <Text color="white" fontSize="xl" fontWeight="bold" mb={2}>
                No Notifications Yet
              </Text>

              <Text color="gray.400">
                Your account activity updates will appear here.
              </Text>
            </Box>
          ) : (
            notifications.map((notification) => (
              <Box
                key={notification._id}
                p={6}
                borderRadius="24px"
                bg={
                  notification.read
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(37,99,235,0.12)"
                }
                border={
                  notification.read
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(59,130,246,0.45)"
                }
                boxShadow={
                  notification.read
                    ? "none"
                    : "0 10px 30px rgba(37,99,235,0.18)"
                }
              >
                <HStack justify="space-between" align="start" mb={4}>
                  <HStack>
                    <Text fontSize="2xl">{getIcon(notification.message)}</Text>

                    <Text
                      color="white"
                      fontWeight={notification.read ? "normal" : "bold"}
                    >
                      {notification.message}
                    </Text>
                  </HStack>

                  {!notification.read && (
                    <Box px={3} py={1} borderRadius="full" bg="blue.400">
                      <Text fontSize="xs" color="white" fontWeight="bold">
                        NEW
                      </Text>
                    </Box>
                  )}
                </HStack>

                <Text fontSize="sm" color="gray.500">
                  {new Date(notification.createdAt).toLocaleString()}
                </Text>

                <Button
                  mt={4}
                  size="sm"
                  colorScheme={notification.read ? "gray" : "blue"}
                  onClick={() => toggleReadStatus(notification)}
                >
                  {notification.read ? "Mark as Unread" : "Mark as Read"}
                </Button>
              </Box>
            ))
          )}
        </VStack>
      </Box>
    </Box>
  );
}

export default Notifications;
