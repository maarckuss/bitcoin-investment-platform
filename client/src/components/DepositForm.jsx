import QRCode from "react-qr-code";
import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Text,
  SimpleGrid,
} from "@chakra-ui/react";

function DepositForm() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const BTC_WALLET = "bc1qxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://bitcoin-investment-platform-ovvr.onrender.com/api/deposit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            coin: "BTC",
            amount: Number(amount),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Deposit failed");
      }

      toast({
        title: "Deposit Submitted",
        description: "Your Bitcoin deposit has been submitted for review.",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });

      setAmount("");
    } catch (error) {
      toast({
        title: "Deposit Failed",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyWallet = async () => {
    await navigator.clipboard.writeText(BTC_WALLET);

    toast({
      title: "Wallet Address Copied",
      description: "Bitcoin wallet address copied to clipboard.",
      status: "success",
      duration: 2500,
      isClosable: true,
      position: "top-right",
    });
  };

  return (
    <Box
      bg="rgba(255,255,255,0.04)"
      border="1px solid rgba(255,255,255,0.08)"
      p={8}
      borderRadius="20px"
      boxShadow="0 8px 24px rgba(0,0,0,0.25)"
      maxW="500px"
      color="white"
    >
      <VStack spacing={6} align="stretch">
        <Box
          p={5}
          borderRadius="18px"
          bg="linear-gradient(135deg,#F59E0B,#D97706)"
          color="white"
          boxShadow="0 12px 30px rgba(245,158,11,0.35)"
          transform="translateY(0)"
          transition="all 0.3s ease"
          _hover={{
            transform: "translateY(-4px)",
          }}
        >
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            ₿ Personal Bitcoin Wallet
          </Text>

          <Text color="blue.100" fontSize="sm" lineHeight="1.8">
            This Bitcoin wallet address has been assigned for funding your
            investment account. Send Bitcoin (BTC) only using the Bitcoin
            network. Deposits are credited after blockchain confirmation.
          </Text>
        </Box>
        <Box
          p={5}
          borderRadius="18px"
          bg="rgba(255,255,255,0.03)"
          border="1px solid rgba(255,255,255,0.08)"
        >
          <FormControl>
            <FormLabel color="gray.300">Network</FormLabel>

            <Input
              value="Bitcoin"
              isReadOnly
              bg="rgba(255,255,255,0.05)"
              border="1px solid rgba(255,255,255,0.1)"
              color="white"
            />
          </FormControl>

          <FormControl>
            <FormLabel color="gray.300">Bitcoin Wallet Address</FormLabel>

            <Box position="relative">
              <Input
                value={BTC_WALLET}
                isReadOnly
                pr="90px"
                bg="rgba(255,255,255,0.05)"
                border="1px solid rgba(255,255,255,0.1)"
                color="white"
              />

              <Button
                position="absolute"
                right="6px"
                top="6px"
                size="sm"
                colorScheme="blue"
                onClick={copyWallet}
              >
                Copy
              </Button>
            </Box>
          </FormControl>

          <Box
            bg="white"
            p={5}
            borderRadius="18px"
            width="fit-content"
            mx="auto"
            boxShadow="0 10px 30px rgba(0,0,0,0.25)"
          >
            <QRCode
              value={BTC_WALLET}
              size={window.innerWidth < 480 ? 150 : 180}
            />
          </Box>
          <SimpleGrid
            columns={{
              base: 1,
              sm: 2,
            }}
            spacing={4}
          >
            {[
              {
                title: "Network",
                value: "Bitcoin (BTC)",
              },
              {
                title: "Confirmations",
                value: "2 Blocks",
              },
              {
                title: "Minimum Deposit",
                value: "$100",
              },
              {
                title: "Processing Time",
                value: "10-30 Minutes",
              },
            ].map((item) => (
              <Box
                key={item.title}
                p={4}
                borderRadius="14px"
                bg="rgba(255,255,255,0.04)"
                border="1px solid rgba(255,255,255,0.08)"
              >
                <Text fontSize="sm" color="gray.400" mb={1}>
                  {item.title}
                </Text>

                <Text fontWeight="bold" color="white">
                  {item.value}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
          <Box
            mt={5}
            p={5}
            borderRadius="16px"
            bg="rgba(245,158,11,0.08)"
            border="1px solid rgba(245,158,11,0.25)"
          >
            <HStack align="flex-start" spacing={3}>
              <Box color="orange.400" mt={1}>
                <FiAlertTriangle size={22} />
              </Box>

              <Box>
                <Text color="orange.300" fontWeight="bold" mb={2}>
                  Important Deposit Information
                </Text>

                <Text color="gray.300" fontSize="sm" lineHeight="1.7">
                  • Send Bitcoin (BTC) only.
                  <br />
                  • Use the Bitcoin network when making your transfer.
                  <br />
                  • Deposits are credited after blockchain confirmation.
                  <br />• Unsupported transfers may result in loss of funds.
                </Text>
              </Box>
            </HStack>
          </Box>
        </Box>

        <FormControl>
          <FormLabel color="gray.300">Amount Sent</FormLabel>

          <Input
            placeholder="e.g. 0.005 BTC"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            bg="rgba(255,255,255,0.05)"
            border="1px solid rgba(255,255,255,0.1)"
            color="white"
            _placeholder={{ color: "gray.500" }}
          />
        </FormControl>

        <Button
          bg="blue.500"
          color="white"
          _hover={{ bg: "blue.600" }}
          w="full"
          onClick={handleSubmit}
          isLoading={loading}
          loadingText="Submitting Deposit..."
        >
          Submit Deposit
        </Button>
      </VStack>
    </Box>
  );
}

export default DepositForm;
