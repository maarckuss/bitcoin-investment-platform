import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  FiDollarSign,
  FiSearch,
  FiShield,
  FiUser,
} from "react-icons/fi";
import API from "../api/axios";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("credit");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(res.data);
    } catch (err) {
      console.error(err);

      toast({
        title: "Unable to load users",
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleBlockUser = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      await API.patch(
        `/users/${id}/block`,
        {
          blocked: !status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await fetchUsers();

      toast({
        title: status ? "User unblocked" : "User blocked",
        status: "success",
        duration: 2500,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      toast({
        title: "Action failed",
        description:
          err.response?.data?.message ||
          "Unable to update user status.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const updateRole = async (id, role) => {
    try {
      const token = localStorage.getItem("token");

      await API.patch(
        `/users/${id}/role`,
        {
          role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await fetchUsers();

      toast({
        title:
          role === "admin"
            ? "Admin access granted"
            : "Admin access removed",
        status: "success",
        duration: 2500,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      toast({
        title: "Role update failed",
        description:
          err.response?.data?.message ||
          "Unable to update user role.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const updateBalance = async () => {
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Enter an amount greater than zero.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      return;
    }

    try {
      setActionLoading(true);

      const token = localStorage.getItem("token");

      await API.patch(
        `/users/${selectedUser}/balance`,
        {
          amount:
            mode === "credit"
              ? numericAmount
              : -numericAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast({
        title: "Balance updated",
        description:
          mode === "credit"
            ? "Funds were credited successfully."
            : "Funds were debited successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      setAmount("");
      setSelectedUser(null);
      onClose();
      await fetchUsers();
    } catch (err) {
      toast({
        title: "Balance update failed",
        description:
          err.response?.data?.message ||
          "Unable to update the user balance.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const openBalanceModal = (id, type) => {
    setSelectedUser(id);
    setMode(type);
    setAmount("");
    onOpen();
  };

  const filteredUsers = users.filter((user) => {
    const query = search.toLowerCase().trim();

    return (
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    );
  });

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

          <Text color="gray.500" fontSize="sm">
            Loading users...
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
      <Box maxW="1280px" mx="auto" w="100%">
        <Box mb={{ base: 5, md: 7 }}>
          <Text
            fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
            fontWeight="800"
            color="white"
            letterSpacing="-0.03em"
          >
            User management
          </Text>

          <Text
            mt={2}
            color="gray.500"
            fontSize={{ base: "sm", md: "md" }}
          >
            Manage accounts, balances, roles, and access status.
          </Text>
        </Box>

        <Box
          mb={{ base: 4, md: 5 }}
          position="relative"
        >
          <Box
            position="absolute"
            left="14px"
            top="50%"
            transform="translateY(-50%)"
            color="gray.600"
            pointerEvents="none"
          >
            <FiSearch size={17} />
          </Box>

          <Input
            h="52px"
            pl="44px"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            color="white"
            bg="rgba(255,255,255,0.035)"
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
              boxShadow:
                "0 0 0 1px rgba(245,158,11,0.55)",
            }}
          />
        </Box>

        <Box
          border="1px solid"
          borderColor="whiteAlpha.100"
          borderRadius={{ base: "16px", md: "20px" }}
          bg="rgba(255,255,255,0.035)"
          backdropFilter="blur(12px)"
          boxShadow="0 12px 34px rgba(0,0,0,0.15)"
          overflow="hidden"
        >
          <Box display={{ base: "none", lg: "block" }}>
            <Table variant="simple" color="white">
              <Thead bg="whiteAlpha.30">
                <Tr>
                  {[
                    "User",
                    "Balance",
                    "Role",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <Th
                      key={heading}
                      borderColor="whiteAlpha.100"
                      color="gray.500"
                      fontSize="10px"
                      textTransform="uppercase"
                      letterSpacing="0.08em"
                    >
                      {heading}
                    </Th>
                  ))}
                </Tr>
              </Thead>

              <Tbody>
                {filteredUsers.map((user) => (
                  <Tr
                    key={user._id}
                    _hover={{
                      bg: "whiteAlpha.30",
                    }}
                  >
                    <Td borderColor="whiteAlpha.80">
                      <Flex align="center" gap={3}>
                        <Flex
                          align="center"
                          justify="center"
                          w="38px"
                          h="38px"
                          flexShrink={0}
                          borderRadius="11px"
                          bg="rgba(59,130,246,0.10)"
                          color="blue.300"
                        >
                          <FiUser size={16} />
                        </Flex>

                        <Box minW="0">
                          <Text
                            fontSize="sm"
                            fontWeight="600"
                            color="gray.100"
                            noOfLines={1}
                          >
                            {user.name}
                          </Text>

                          <Text
                            mt={0.5}
                            fontSize="xs"
                            color="gray.600"
                            noOfLines={1}
                          >
                            {user.email}
                          </Text>
                        </Box>
                      </Flex>
                    </Td>

                    <Td
                      borderColor="whiteAlpha.80"
                      color="gray.200"
                      fontWeight="600"
                    >
                      ${Number(user.balance || 0).toLocaleString("en-US")}
                    </Td>

                    <Td borderColor="whiteAlpha.80">
                      <Badge
                        colorScheme={
                          user.role === "admin"
                            ? "purple"
                            : "blue"
                        }
                        variant="subtle"
                        borderRadius="full"
                        px={2.5}
                        fontSize="10px"
                        textTransform="capitalize"
                      >
                        {user.role}
                      </Badge>
                    </Td>

                    <Td borderColor="whiteAlpha.80">
                      <Badge
                        colorScheme={
                          user.blocked ? "red" : "green"
                        }
                        variant="subtle"
                        borderRadius="full"
                        px={2.5}
                        fontSize="10px"
                      >
                        {user.blocked ? "Blocked" : "Active"}
                      </Badge>
                    </Td>

                    <Td borderColor="whiteAlpha.80">
                      <Flex gap={2} wrap="wrap">
                        <Button
                          size="xs"
                          colorScheme="green"
                          variant="outline"
                          onClick={() =>
                            openBalanceModal(
                              user._id,
                              "credit",
                            )
                          }
                        >
                          Credit
                        </Button>

                        <Button
                          size="xs"
                          colorScheme="red"
                          variant="outline"
                          onClick={() =>
                            openBalanceModal(
                              user._id,
                              "debit",
                            )
                          }
                        >
                          Debit
                        </Button>

                        <Button
                          size="xs"
                          colorScheme="purple"
                          variant="outline"
                          onClick={() =>
                            updateRole(
                              user._id,
                              user.role === "user"
                                ? "admin"
                                : "user",
                            )
                          }
                        >
                          {user.role === "user"
                            ? "Make Admin"
                            : "Remove Admin"}
                        </Button>

                        <Button
                          size="xs"
                          colorScheme={
                            user.blocked
                              ? "green"
                              : "orange"
                          }
                          variant="outline"
                          onClick={() =>
                            toggleBlockUser(
                              user._id,
                              user.blocked,
                            )
                          }
                        >
                          {user.blocked
                            ? "Unblock"
                            : "Block"}
                        </Button>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          <VStack
            display={{ base: "flex", lg: "none" }}
            align="stretch"
            spacing={3}
            p={{ base: 3, sm: 4 }}
          >
            {filteredUsers.map((user) => (
              <Box
                key={user._id}
                p={4}
                border="1px solid"
                borderColor="whiteAlpha.80"
                borderRadius="15px"
                bg="whiteAlpha.20"
              >
                <Flex
                  align="flex-start"
                  justify="space-between"
                  gap={3}
                >
                  <Flex
                    align="center"
                    gap={3}
                    minW="0"
                  >
                    <Flex
                      align="center"
                      justify="center"
                      w="42px"
                      h="42px"
                      flexShrink={0}
                      borderRadius="12px"
                      bg="rgba(59,130,246,0.10)"
                      color="blue.300"
                    >
                      <FiUser size={17} />
                    </Flex>

                    <Box minW="0">
                      <Text
                        fontSize="sm"
                        fontWeight="700"
                        color="white"
                        noOfLines={1}
                      >
                        {user.name}
                      </Text>

                      <Text
                        mt={1}
                        fontSize="xs"
                        color="gray.600"
                        noOfLines={1}
                      >
                        {user.email}
                      </Text>
                    </Box>
                  </Flex>

                  <Badge
                    colorScheme={
                      user.blocked ? "red" : "green"
                    }
                    variant="subtle"
                    borderRadius="full"
                    px={2}
                    fontSize="9px"
                    flexShrink={0}
                  >
                    {user.blocked ? "Blocked" : "Active"}
                  </Badge>
                </Flex>

                <SimpleGrid
                  columns={2}
                  spacing={2}
                  mt={4}
                >
                  <Box
                    p={3}
                    borderRadius="12px"
                    bg="whiteAlpha.30"
                  >
                    <Text
                      fontSize="10px"
                      color="gray.600"
                      textTransform="uppercase"
                    >
                      Balance
                    </Text>

                    <Text
                      mt={1}
                      fontSize="sm"
                      fontWeight="700"
                      color="gray.100"
                    >
                      ${Number(user.balance || 0).toLocaleString("en-US")}
                    </Text>
                  </Box>

                  <Box
                    p={3}
                    borderRadius="12px"
                    bg="whiteAlpha.30"
                  >
                    <Text
                      fontSize="10px"
                      color="gray.600"
                      textTransform="uppercase"
                    >
                      Role
                    </Text>

                    <Text
                      mt={1}
                      fontSize="sm"
                      fontWeight="700"
                      color="gray.100"
                      textTransform="capitalize"
                    >
                      {user.role}
                    </Text>
                  </Box>
                </SimpleGrid>

                <SimpleGrid
                  columns={{ base: 2, sm: 4 }}
                  spacing={2}
                  mt={3}
                >
                  <Button
                    size="sm"
                    colorScheme="green"
                    variant="outline"
                    leftIcon={<FiDollarSign />}
                    onClick={() =>
                      openBalanceModal(
                        user._id,
                        "credit",
                      )
                    }
                  >
                    Credit
                  </Button>

                  <Button
                    size="sm"
                    colorScheme="red"
                    variant="outline"
                    onClick={() =>
                      openBalanceModal(
                        user._id,
                        "debit",
                      )
                    }
                  >
                    Debit
                  </Button>

                  <Button
                    size="sm"
                    colorScheme="purple"
                    variant="outline"
                    onClick={() =>
                      updateRole(
                        user._id,
                        user.role === "user"
                          ? "admin"
                          : "user",
                      )
                    }
                  >
                    {user.role === "user"
                      ? "Admin"
                      : "User"}
                  </Button>

                  <Button
                    size="sm"
                    colorScheme={
                      user.blocked ? "green" : "orange"
                    }
                    variant="outline"
                    onClick={() =>
                      toggleBlockUser(
                        user._id,
                        user.blocked,
                      )
                    }
                  >
                    {user.blocked
                      ? "Unblock"
                      : "Block"}
                  </Button>
                </SimpleGrid>
              </Box>
            ))}

            {filteredUsers.length === 0 && (
              <Box
                py={10}
                textAlign="center"
              >
                <Text
                  color="gray.400"
                  fontWeight="600"
                >
                  No users found
                </Text>

                <Text
                  mt={1}
                  fontSize="sm"
                  color="gray.600"
                >
                  Try a different name or email search.
                </Text>
              </Box>
            )}
          </VStack>
        </Box>
      </Box>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          if (!actionLoading) {
            onClose();
          }
        }}
        isCentered
      >
        <ModalOverlay bg="blackAlpha.700" />

        <ModalContent
          mx={4}
          bg="#111827"
          color="white"
          border="1px solid"
          borderColor="whiteAlpha.100"
          borderRadius="18px"
        >
          <ModalHeader fontSize="lg">
            {mode === "credit"
              ? "Credit user"
              : "Debit user"}
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody>
            <Text
              mb={3}
              fontSize="sm"
              color="gray.500"
            >
              Enter the amount to{" "}
              {mode === "credit"
                ? "add to"
                : "deduct from"}{" "}
              the user's balance.
            </Text>

            <Input
              h="52px"
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              color="white"
              bg="whiteAlpha.50"
              borderColor="whiteAlpha.100"
              borderRadius="12px"
              _placeholder={{
                color: "gray.600",
              }}
            />
          </ModalBody>

          <ModalFooter gap={2}>
            <Button
              variant="ghost"
              onClick={onClose}
              isDisabled={actionLoading}
            >
              Cancel
            </Button>

            <Button
              colorScheme={mode === "credit" ? "green" : "red"}
              onClick={updateBalance}
              isLoading={actionLoading}
              loadingText="Updating..."
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default AdminUsers;