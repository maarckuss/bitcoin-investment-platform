import { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import API from "../api/axios";

function WithdrawalForm() {
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState(0);

  const toast = useToast();
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBalance(res.data.balance || 0);
      } catch (err) {
        console.error("Failed to fetch balance", err);
      }
    };

    fetchBalance();
  }, []);
  const handleMax = () => {
    setAmount(balance);
  };
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/withdraw",
        {
          amount: Number(amount),
          walletAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast({
        title: "Withdrawal Submitted",
        description: "Your withdrawal request is pending approval.",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });

      setAmount("");
      setWalletAddress("");
    } catch (err) {
      toast({
        title: "Withdrawal Failed",
        description: err.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (
    <Box
      p={8}
      borderRadius="20px"
      bg="rgba(255,255,255,0.04)"
      border="1px solid rgba(255,255,255,0.08)"
      maxW="500px"
    >
      <VStack spacing={5} align="stretch">
        <Box
          p={5}
          borderRadius="18px"
          bg="linear-gradient(135deg,#991B1B,#DC2626)"
          color="white"
          boxShadow="0 10px 30px rgba(220,38,38,0.25)"
        >
          <Text fontSize="sm" color="red.100" mb={1}>
            Available Balance
          </Text>

          <Text fontSize="3xl" fontWeight="bold">
            ${Number(balance).toLocaleString()}
          </Text>
        </Box>
        <FormControl>
          <FormLabel color="gray.300">Amount</FormLabel>

          <HStack>
            <Input
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              bg="rgba(255,255,255,0.05)"
              color="white"
            />

            <Button colorScheme="red" variant="outline" onClick={handleMax}>
              MAX
            </Button>
          </HStack>
        </FormControl>

        <FormControl>
          <FormLabel color="gray.300">Wallet Address</FormLabel>

          <Input
            placeholder="Enter wallet address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            bg="rgba(255,255,255,0.05)"
            color="white"
          />
        </FormControl>

        <Button colorScheme="red" onClick={handleSubmit}>
          Request Withdrawal
        </Button>
      </VStack>
    </Box>
  );
}

export default WithdrawalForm;
