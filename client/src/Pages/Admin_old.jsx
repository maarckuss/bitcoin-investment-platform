import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import {
  Input,
  Box,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  SimpleGrid,
} from "@chakra-ui/react";
import API from "../api/axios";

function Admin() {
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [selectedUser, setSelectedUser] = useState(null);
  const [balanceAmount, setBalanceAmount] = useState("");
  const [balanceMode, setBalanceMode] = useState("credit");

  const toggleBlockUser = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");

      await API.patch(
        `/users/${id}/block`,
        { blocked: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error updating user status");
    }
  };

  const rejectDeposit = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.patch(
        `/deposits/${id}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error rejecting deposit");
    }
  };

  const rejectWithdrawal = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.patch(
        `/withdrawals/${id}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error rejecting withdrawal");
    }
  };

  // ---------------- FETCH DATA ----------------
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/admin/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDeposits(res.data.deposits);
      setWithdrawals(res.data.withdrawals);
      const usersRes = await API.get("/users");

      setUsers(usersRes.data);
    } catch (err) {
      console.log("FETCH ERROR:", err);
    }
  };

  // ---------------- APPROVE DEPOSIT ----------------
  const approveDeposit = async (id) => {
    try {
      setLoadingId(id);

      const token = localStorage.getItem("token");

      await API.patch(
        `/deposits/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error approving deposit");
    } finally {
      setLoadingId(null);
    }
  };
  // ---------------- APPROVE WITHDRAWAL ----------------
  const approveWithdrawal = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.patch(
        `/withdrawals/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchData();
    } catch (err) {
      console.log(err);
      console.log(err.response);

      alert(err.response?.data?.message || "Error approving withdrawal");
    }
  };

  const updateRole = async (id, role) => {
    try {
      const token = localStorage.getItem("token");

      await API.patch(
        `/users/${id}/role`,
        { role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error updating role");
    }
  };

  const updateBalance = async (id, amount) => {
    try {
      const token = localStorage.getItem("token");

      await API.patch(
        `/users/${id}/balance`,
        { amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error updating balance");
    }
  };

  const creditUser = (id) => {
    setSelectedUser(id);
    setBalanceMode("credit");
    setBalanceAmount("");
    onOpen();
  };
  const debitUser = (id) => {
    setSelectedUser(id);
    setBalanceMode("debit");
    setBalanceAmount("");
    onOpen();
  };

  const submitBalanceUpdate = async () => {
    if (!balanceAmount || isNaN(balanceAmount)) {
      toast({
        title: "Invalid amount",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    await updateBalance(
      selectedUser,
      balanceMode === "credit" ? Number(balanceAmount) : -Number(balanceAmount),
    );

    toast({
      title: balanceMode === "credit" ? "User Credited" : "User Debited",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    onClose();
  };
  // ---------------- CALCULATIONS ----------------
  const totalDeposits = deposits
    .filter((d) => d.status === "approved")
    .reduce((sum, d) => sum + Number(d.amount || 0), 0);

  const totalWithdrawals = withdrawals
    .filter((w) => w.status === "approved")
    .reduce((sum, w) => sum + Number(w.amount || 0), 0);

  const pendingDeposits = deposits.filter((d) => d.status === "pending").length;

  const pendingWithdrawals = withdrawals.filter(
    (w) => w.status === "pending",
  ).length;

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()),
  );

  // ---------------- UI ----------------
  return (
    <Box p={8} bg="transparent" minH="100vh">
      {/* STATS */}
      <SimpleGrid columns={4} spacing={4} mb={8}>
        <Box
          p={5}
          borderRadius="20px"
          bg="rgba(255,255,255,0.04)"
          border="1px solid rgba(255,255,255,0.08)"
          color="white"
        >
          <Text fontSize="sm" color="gray.400">
            Total Deposits
          </Text>
          <Text color="white" fontSize="2xl" fontWeight="bold">
            ${totalDeposits}
          </Text>
        </Box>

        <Box
          p={5}
          borderRadius="20px"
          bg="rgba(255,255,255,0.04)"
          border="1px solid rgba(255,255,255,0.08)"
          color="white"
        >
          <Text fontSize="sm" color="gray.400">
            Total Withdrawals
          </Text>
          <Text color="white" fontSize="2xl" fontWeight="bold">
            ${totalWithdrawals}
          </Text>
        </Box>

        <Box
          p={5}
          borderRadius="20px"
          bg="rgba(255,255,255,0.04)"
          border="1px solid rgba(255,255,255,0.08)"
          color="white"
        >
          <Text fontSize="sm" color="gray.400">
            Pending Deposits
          </Text>
          <Text color="white" fontSize="2xl" fontWeight="bold">
            {pendingDeposits}
          </Text>
        </Box>

        <Box
          p={5}
          borderRadius="20px"
          bg="rgba(255,255,255,0.04)"
          border="1px solid rgba(255,255,255,0.08)"
          color="white"
        >
          <Text fontSize="sm" color="gray.400">
            Pending Withdrawals
          </Text>
          <Text color="white" fontSize="2xl" fontWeight="bold">
            {pendingWithdrawals}
          </Text>
        </Box>
      </SimpleGrid>

      <Input
        placeholder="Search users..."
        mb={6}
        bg="rgba(255,255,255,0.05)"
        border="1px solid rgba(255,255,255,0.1)"
        color="white"
        _placeholder={{ color: "gray.500" }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Text fontSize="3xl" fontWeight="bold" mb={6}>
        Users
      </Text>

      <Box
        bg="rgba(255,255,255,0.04)"
        border="1px solid rgba(255,255,255,0.08)"
        borderRadius="20px"
        overflowX="auto"
        mb={10}
      >
        <Table variant="simple" color="white">
          <Thead bg="rgba(255,255,255,0.05)">
            <Tr>
              <Th color="gray.300">Name</Th>
              <Th color="gray.300">Email</Th>
              <Th color="gray.300">Balance</Th>
              <Th color="gray.300">Role</Th>
              <Th color="gray.300">Role Action</Th>
              <Th color="gray.300">Balance Action</Th>
              <Th color="gray.300">Status</Th>
              <Th color="gray.300">User Action</Th>
            </Tr>
          </Thead>

          <Tbody>
            {filteredUsers.map((user) => (
              <Tr
                key={user._id}
                opacity={user.blocked ? 0.4 : 1}
                _hover={{
                  bg: "rgba(255,255,255,0.05)",
                }}
              >
                <Td color="white">{user.name}</Td>
                <Td color="white">{user.email}</Td>
                <Td color="white">${user.balance}</Td>
                <Td color="white">{user.role}</Td>

                <Td>
                  {user.role === "user" ? (
                    <Button
                      size="sm"
                      colorScheme="purple"
                      onClick={() => updateRole(user._id, "admin")}
                      isDisabled={user.blocked}
                    >
                      Make Admin
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      colorScheme="orange"
                      onClick={() => updateRole(user._id, "user")}
                      isDisabled={user.blocked}
                    >
                      Remove Admin
                    </Button>
                  )}
                </Td>

                <Td>
                  <Button
                    size="sm"
                    colorScheme="green"
                    mr={2}
                    onClick={() => creditUser(user._id)}
                    isDisabled={user.blocked}
                  >
                    Credit
                  </Button>

                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => debitUser(user._id)}
                    isDisabled={user.blocked}
                  >
                    Debit
                  </Button>
                </Td>
                <Td>
                  <Text
                    color={user.blocked ? "red.500" : "green.500"}
                    fontWeight="bold"
                    textTransform="capitalize"
                  >
                    {user.blocked ? "Blocked" : "Active"}
                  </Text>
                </Td>

                <Td>
                  <Button
                    size="sm"
                    colorScheme={user.blocked ? "green" : "red"}
                    onClick={() => toggleBlockUser(user._id, user.blocked)}
                  >
                    {user.blocked ? "Unblock" : "Block"}
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* DEPOSITS */}
      <Text fontSize="3xl" fontWeight="bold" mb={6}>
        Deposits
      </Text>

      <Box
        bg="rgba(255,255,255,0.04)"
        border="1px solid rgba(255,255,255,0.08)"
        borderRadius="20px"
        overflowX="auto"
        mb={10}
      >
        <Table variant="simple" color="white">
          <Thead bg="rgba(255,255,255,0.05)">
            <Tr>
              <Th color="gray.300">User</Th>
              <Th color="gray.300">Coin</Th>
              <Th color="gray.300">Amount</Th>
              <Th color="gray.300">Status</Th>
              <Th color="gray.300">Action</Th>
            </Tr>
          </Thead>

          <Tbody>
            {deposits.map((d) => (
              <Tr
                key={d._id}
                _hover={{
                  bg: "rgba(255,255,255,0.05)",
                }}
              >
                <Td>{d.userId}</Td>
                <Td>{d.coin}</Td>
                <Td color="green.400" fontWeight="bold">
                  +${d.amount}
                </Td>
                <Td>{d.status}</Td>
                <Td>
                  <Text
                    color={
                      d.status === "approved"
                        ? "green.500"
                        : d.status === "rejected"
                          ? "red.500"
                          : "orange.400"
                    }
                    fontWeight="bold"
                    textTransform="capitalize"
                  >
                    {d.status}
                  </Text>
                </Td>

                <Td>
                  {d.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        colorScheme="green"
                        mr={2}
                        isLoading={loadingId === d._id}
                        onClick={() => approveDeposit(d._id)}
                      >
                        Approve
                      </Button>

                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => rejectDeposit(d._id)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* WITHDRAWALS */}
      <Text fontSize="2xl" fontWeight="bold" mt={10} mb={4}>
        Withdrawals
      </Text>

      <Box
        bg="rgba(255,255,255,0.04)"
        border="1px solid rgba(255,255,255,0.08)"
        borderRadius="20px"
        overflowX="auto"
      >
        <Table variant="simple" color="white">
          <Thead bg="rgba(255,255,255,0.05)">
            <Tr>
              <Th color="gray.300">User</Th>
              <Th color="gray.300">Amount</Th>
              <Th color="gray.300">Wallet</Th>
              <Th color="gray.300">Status</Th>
              <Th color="gray.300">Action</Th>
            </Tr>
          </Thead>

          <Tbody>
            {withdrawals.map((w) => (
              <Tr
                key={w._id}
                _hover={{
                  bg: "rgba(255,255,255,0.05)",
                }}
              >
                <Td>{w.userId}</Td>
                <Td color="red.400" fontWeight="bold">
                  -${w.amount}
                </Td>
                <Td>{w.walletAddress}</Td>
                <Td>{w.status}</Td>
                <Td>
                  <Text
                    color={
                      w.status === "approved"
                        ? "green.500"
                        : w.status === "rejected"
                          ? "red.500"
                          : "orange.400"
                    }
                    fontWeight="bold"
                    textTransform="capitalize"
                  >
                    {w.status}
                  </Text>
                </Td>

                <Td>
                  {w.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        colorScheme="green"
                        mr={2}
                        onClick={() => approveWithdrawal(w._id)}
                      >
                        Approve
                      </Button>

                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => rejectWithdrawal(w._id)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(6px)" />

        <ModalContent
          bg="#111827"
          color="white"
          border="1px solid rgba(255,255,255,0.08)"
        >
          <ModalHeader>
            {balanceMode === "credit" ? "Credit User" : "Debit User"}
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody>
            <Input
              placeholder="Enter amount"
              value={balanceAmount}
              onChange={(e) => setBalanceAmount(e.target.value)}
              bg="rgba(255,255,255,0.05)"
              border="1px solid rgba(255,255,255,0.1)"
              color="white"
              _placeholder={{
                color: "gray.500",
              }}
            />
          </ModalBody>

          <ModalFooter>
            <Button mr={3} variant="ghost" onClick={onClose}>
              Cancel
            </Button>

            <Button
              colorScheme={balanceMode === "credit" ? "green" : "red"}
              onClick={submitBalanceUpdate}
            >
              {balanceMode === "credit" ? "Credit User" : "Debit User"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Admin;
