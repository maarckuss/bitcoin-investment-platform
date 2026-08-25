import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import {
  FiArrowUpRight,
  FiShield,
} from "react-icons/fi";
import API from "../api/axios";

function WithdrawalForm() {
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

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

        setBalance(Number(res.data.balance) || 0);
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
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      toast({
        title: "Enter a valid amount",
        description: "Please enter the amount you want to withdraw.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (numericAmount > balance) {
      toast({
        title: "Insufficient balance",
        description: "The requested amount exceeds your available balance.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (!walletAddress.trim()) {
      toast({
        title: "Wallet address required",
        description: "Enter the destination wallet address.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await API.post(
        "/withdraw",
        {
          amount: numericAmount,
          walletAddress: walletAddress.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast({
        title: "Withdrawal submitted",
        description: "Your withdrawal request is pending approval.",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });

      setAmount("");
      setWalletAddress("");
    } catch (err) {
      toast({
        title: "Withdrawal failed",
        description:
          err.response?.data?.message ||
          "Something went wrong. Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      w="100%"
      p={{ base: 4, sm: 5, md: 6 }}
      border="1px solid"
      borderColor="whiteAlpha.100"
      borderRadius={{ base: "16px", md: "20px" }}
      bg="rgba(255,255,255,0.035)"
      backdropFilter="blur(12px)"
      boxShadow="0 10px 30px rgba(0,0,0,0.14)"
    >
      <VStack spacing={{ base: 5, md: 6 }} align="stretch">
        <Flex
          align="center"
          justify="space-between"
          gap={3}
          p={{ base: 4, md: 5 }}
          borderRadius="16px"
          bg="linear-gradient(135deg, rgba(239,68,68,0.10), rgba(15,23,42,0.25))"
          border="1px solid"
          borderColor="rgba(239,68,68,0.12)"
        >
          <Box>
            <Text
              fontSize="xs"
              fontWeight="700"
              textTransform="uppercase"
              letterSpacing="0.1em"
              color="gray.500"
            >
              Available balance
            </Text>

            <Text
              mt={1}
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="800"
              color="white"
              letterSpacing="-0.03em"
            >
              ${balance.toLocaleString("en-US")}
            </Text>
          </Box>

          <Flex
            align="center"
            justify="center"
            w="42px"
            h="42px"
            flexShrink={0}
            borderRadius="13px"
            bg="rgba(239,68,68,0.10)"
            color="red.300"
          >
            <FiArrowUpRight size={19} />
          </Flex>
        </Flex>

        <FormControl>
          <FormLabel
            mb={2}
            fontSize="sm"
            fontWeight="600"
            color="gray.300"
          >
            Withdrawal amount
          </FormLabel>

          <Flex
            gap={2}
            align="center"
          >
            <Input
              h="52px"
              flex="1"
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              bg="whiteAlpha.50"
              borderColor="whiteAlpha.100"
              borderRadius="12px"
              color="white"
              _placeholder={{
                color: "gray.600",
              }}
              _hover={{
                borderColor: "whiteAlpha.200",
              }}
              _focus={{
                borderColor: "red.400",
                boxShadow: "0 0 0 1px rgba(248,113,113,0.45)",
              }}
            />

            <Button
              h="52px"
              px={{ base: 4, md: 5 }}
              borderRadius="12px"
              variant="outline"
              borderColor="whiteAlpha.200"
              color="gray.200"
              onClick={handleMax}
              _hover={{
                bg: "whiteAlpha.100",
                borderColor: "whiteAlpha.300",
              }}
            >
              MAX
            </Button>
          </Flex>
        </FormControl>

        <FormControl>
          <FormLabel
            mb={2}
            fontSize="sm"
            fontWeight="600"
            color="gray.300"
          >
            Destination wallet
          </FormLabel>

          <Input
            h="52px"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="Enter wallet address"
            color="white"
            fontFamily="mono"
            fontSize="sm"
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
              borderColor: "red.400",
              boxShadow: "0 0 0 1px rgba(248,113,113,0.45)",
            }}
          />
        </FormControl>

        <Box
          p={{ base: 3.5, md: 4 }}
          borderRadius="14px"
          bg="rgba(245,158,11,0.05)"
          border="1px solid"
          borderColor="rgba(245,158,11,0.10)"
        >
          <Flex align="flex-start" gap={3}>
            <Box
              mt={0.5}
              color="orange.300"
              flexShrink={0}
            >
              <FiShield size={17} />
            </Box>

            <Box>
              <Text
                fontSize="sm"
                fontWeight="600"
                color="gray.200"
              >
                Check the destination carefully
              </Text>

              <Text
                mt={1}
                fontSize="xs"
                lineHeight="1.7"
                color="gray.500"
              >
                Blockchain transactions are irreversible. Verify the
                wallet address before submitting your request.
              </Text>
            </Box>
          </Flex>
        </Box>

        <Button
          h="54px"
          w="100%"
          borderRadius="12px"
          bg="red.500"
          color="white"
          fontWeight="700"
          isLoading={loading}
          loadingText="Submitting withdrawal..."
          onClick={handleSubmit}
          _hover={{
            bg: "red.400",
            transform: "translateY(-1px)",
            boxShadow: "0 10px 24px rgba(239,68,68,0.16)",
          }}
          _active={{
            transform: "translateY(0)",
          }}
        >
          Request withdrawal
        </Button>
      </VStack>
    </Box>
  );
}

export default WithdrawalForm;