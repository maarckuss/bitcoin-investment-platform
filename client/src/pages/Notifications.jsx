import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Spinner,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  FiBell,
  FiCheck,
  FiDollarSign,
  FiTrendingUp,
  FiUnlock,
  FiX,
} from "react-icons/fi";
import API from "../api/axios";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const toast = useToast();

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

        toast({
          title: "Unable to load notifications",
          description:
            err.response?.data?.message ||
            "Please try again later.",
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "top",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [toast]);

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
      toast({
        title: "Unable to update notification",
        description:
          err.response?.data?.message ||
          "Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const getNotificationIcon = (message) => {
    const text = message.toLowerCase();

    if (text.includes("deposit")) {
      return {
        icon: FiDollarSign,
        color: "green.300",
        bg: "rgba(34,197,94,0.10)",
      };
    }

    if (text.includes("withdraw")) {
      return {
        icon: FiUnlock,
        color: "red.300",
        bg: "rgba(239,68,68,0.10)",
      };
    }

    if (text.includes("investment")) {
      return {
        icon: FiTrendingUp,
        color: "blue.300",
        bg: "rgba(59,130,246,0.10)",
      };
    }

    return {
      icon: FiBell,
      color: "orange.300",
      bg: "rgba(245,158,11,0.10)",
    };
  };

  const unreadCount = notifications.filter(
    (item) => !item.read,
  ).length;

  if (loading) {
    return (
      <Flex
        minH="calc(100vh - 96px)"
        align="center"
        justify="center"
        bg="#0b1220"
      >
        <VStack spacing={4}>
          <Spinner
            size="lg"
            thickness="3px"
            color="orange.300"
            emptyColor="whiteAlpha.200"
          />

          <Text
            color="gray.500"
            fontSize="sm"
          >
            Loading notifications...
          </Text>
        </VStack>
      </Flex>
    );
  }

  return (
    <Box
      minH="calc(100vh - 96px)"
      bg="#0b1220"
      px={{ base: 4, sm: 5, md: 6, lg: 8 }}
      py={{ base: 5, md: 7, lg: 8 }}
      overflowX="hidden"
    >
      <Box maxW="900px" mx="auto" w="100%">
        <Flex
          align={{ base: "flex-start", sm: "center" }}
          justify="space-between"
          direction={{ base: "column", sm: "row" }}
          gap={3}
          mb={2}
        >
          <Text
            fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
            fontWeight="800"
            color="white"
            letterSpacing="-0.03em"
          >
            Notifications
          </Text>

          {unreadCount > 0 && (
            <Flex
              align="center"
              gap={2}
              px={3}
              py={1.5}
              borderRadius="full"
              bg="rgba(59,130,246,0.10)"
              border="1px solid"
              borderColor="rgba(59,130,246,0.14)"
            >
              <Box
                w="6px"
                h="6px"
                borderRadius="full"
                bg="blue.300"
              />

              <Text
                fontSize="xs"
                fontWeight="700"
                color="blue.300"
              >
                {unreadCount} unread
              </Text>
            </Flex>
          )}
        </Flex>

        <Text
          mb={{ base: 5, md: 7 }}
          fontSize={{ base: "sm", md: "md" }}
          color="gray.500"
          lineHeight="1.7"
        >
          Stay updated with your account activity, deposits,
          withdrawals, and investments.
        </Text>

        {notifications.length === 0 ? (
          <Box
            p={{ base: 6, md: 9 }}
            border="1px solid"
            borderColor="whiteAlpha.100"
            borderRadius={{ base: "18px", md: "22px" }}
            bg="rgba(255,255,255,0.035)"
            textAlign="center"
          >
            <Flex
              align="center"
              justify="center"
              w="56px"
              h="56px"
              mx="auto"
              borderRadius="17px"
              bg="whiteAlpha.100"
              color="gray.400"
            >
              <FiBell size={23} />
            </Flex>

            <Text
              mt={5}
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="700"
              color="white"
            >
              You're all caught up
            </Text>

            <Text
              mt={2}
              maxW="440px"
              mx="auto"
              fontSize="sm"
              lineHeight="1.7"
              color="gray.500"
            >
              New account and transaction updates will appear here.
            </Text>
          </Box>
        ) : (
          <VStack spacing={3} align="stretch">
            {notifications.map((notification) => {
              const iconData = getNotificationIcon(
                notification.message,
              );

              const Icon = iconData.icon;

              return (
                <Box
                  key={notification._id}
                  p={{ base: 4, sm: 5 }}
                  border="1px solid"
                  borderColor={
                    notification.read
                      ? "whiteAlpha.100"
                      : "rgba(59,130,246,0.18)"
                  }
                  borderRadius={{ base: "15px", md: "18px" }}
                  bg={
                    notification.read
                      ? "rgba(255,255,255,0.035)"
                      : "rgba(59,130,246,0.055)"
                  }
                  boxShadow={
                    notification.read
                      ? "none"
                      : "0 12px 32px rgba(37,99,235,0.08)"
                  }
                  transition="all 0.2s ease"
                >
                  <Flex
                    align="flex-start"
                    gap={3}
                  >
                    <Flex
                      align="center"
                      justify="center"
                      w="42px"
                      h="42px"
                      flexShrink={0}
                      borderRadius="13px"
                      bg={iconData.bg}
                      color={iconData.color}
                    >
                      <Icon size={18} />
                    </Flex>

                    <Box
                      minW="0"
                      flex="1"
                    >
                      <Flex
                        align={{ base: "flex-start", sm: "center" }}
                        justify="space-between"
                        gap={3}
                        direction={{ base: "column", sm: "row" }}
                      >
                        <Text
                          fontSize="sm"
                          fontWeight={
                            notification.read
                              ? "500"
                              : "700"
                          }
                          color="gray.100"
                          lineHeight="1.6"
                        >
                          {notification.message}
                        </Text>

                        {!notification.read && (
                          <Flex
                            align="center"
                            gap={1.5}
                            flexShrink={0}
                            px={2}
                            py={1}
                            borderRadius="full"
                            bg="blue.400"
                          >
                            <Box
                              w="5px"
                              h="5px"
                              borderRadius="full"
                              bg="white"
                            />

                            <Text
                              fontSize="9px"
                              fontWeight="800"
                              color="white"
                            >
                              NEW
                            </Text>
                          </Flex>
                        )}
                      </Flex>

                      <Text
                        mt={2}
                        fontSize="xs"
                        color="gray.600"
                      >
                        {new Date(
                          notification.createdAt,
                        ).toLocaleString()}
                      </Text>

                      <Button
                        mt={3}
                        size="xs"
                        variant="ghost"
                        leftIcon={
                          notification.read ? (
                            <FiX />
                          ) : (
                            <FiCheck />
                          )
                        }
                        color={
                          notification.read
                            ? "gray.500"
                            : "blue.300"
                        }
                        px={2}
                        _hover={{
                          bg: "whiteAlpha.100",
                          color: "white",
                        }}
                        onClick={() =>
                          toggleReadStatus(notification)
                        }
                      >
                        {notification.read
                          ? "Mark unread"
                          : "Mark as read"}
                      </Button>
                    </Box>
                  </Flex>
                </Box>
              );
            })}
          </VStack>
        )}
      </Box>
    </Box>
  );
}

export default Notifications;