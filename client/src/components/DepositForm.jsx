import QRCode from "react-qr-code";
import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  FiAlertTriangle,
  FiCheck,
  FiCopy,
  FiShield,
} from "react-icons/fi";

function DepositForm() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const toast = useToast();
  const BTC_WALLET = "bc1qxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

  const handleSubmit = async () => {
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      toast({
        title: "Enter a valid amount",
        description: "Please enter the amount of BTC you sent.",
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
            amount: numericAmount,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Deposit failed");
      }

      toast({
        title: "Deposit submitted",
        description:
          "Your Bitcoin deposit has been submitted for review.",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });

      setAmount("");
    } catch (error) {
      toast({
        title: "Deposit failed",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyWallet = async () => {
    try {
      await navigator.clipboard.writeText(BTC_WALLET);
      setCopied(true);

      toast({
        title: "Address copied",
        description: "Bitcoin wallet address copied to clipboard.",
        status: "success",
        duration: 2500,
        isClosable: true,
        position: "top",
      });

      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast({
        title: "Copy failed",
        description: "Please copy the wallet address manually.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <VStack spacing={{ base: 4, md: 5 }} align="stretch">
      <Box
        p={{ base: 4, md: 5 }}
        borderRadius="16px"
        bg="linear-gradient(135deg, rgba(245,158,11,0.10), rgba(59,130,246,0.05))"
        border="1px solid"
        borderColor="whiteAlpha.100"
      >
        <Flex align="flex-start" gap={3}>
          <Flex
            align="center"
            justify="center"
            w="42px"
            h="42px"
            flexShrink={0}
            borderRadius="13px"
            bg="rgba(245,158,11,0.10)"
            color="orange.300"
          >
            ₿
          </Flex>

          <Box>
            <Text
              fontSize="md"
              fontWeight="700"
              color="white"
            >
              Bitcoin deposit address
            </Text>

            <Text
              mt={1}
              fontSize="xs"
              color="gray.500"
              lineHeight="1.7"
            >
              Send BTC only through the Bitcoin network to the
              address below.
            </Text>
          </Box>
        </Flex>
      </Box>

      <Box
        p={{ base: 4, md: 5 }}
        border="1px solid"
        borderColor="whiteAlpha.100"
        borderRadius="16px"
        bg="whiteAlpha.30"
      >
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel
              fontSize="sm"
              fontWeight="600"
              color="gray.300"
            >
              Network
            </FormLabel>

            <Input
              value="Bitcoin (BTC)"
              isReadOnly
              h="50px"
              bg="whiteAlpha.50"
              borderColor="whiteAlpha.100"
              color="gray.200"
              borderRadius="12px"
            />
          </FormControl>

          <FormControl>
            <FormLabel
              fontSize="sm"
              fontWeight="600"
              color="gray.300"
            >
              Deposit address
            </FormLabel>

            <Box
              position="relative"
              p={3}
              pr={{ base: 3, sm: "92px" }}
              minH="52px"
              borderRadius="12px"
              bg="whiteAlpha.50"
              border="1px solid"
              borderColor="whiteAlpha.100"
            >
              <Text
                fontSize="xs"
                lineHeight="1.7"
                color="gray.200"
                fontFamily="mono"
                wordBreak="break-all"
              >
                {BTC_WALLET}
              </Text>

              <Button
                position={{ base: "static", sm: "absolute" }}
                right="6px"
                top="6px"
                mt={{ base: 3, sm: 0 }}
                w={{ base: "100%", sm: "auto" }}
                size="sm"
                borderRadius="9px"
                colorScheme={copied ? "green" : "blue"}
                leftIcon={copied ? <FiCheck /> : <FiCopy />}
                onClick={copyWallet}
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            </Box>
          </FormControl>

          <Flex
            justify="center"
            py={{ base: 3, md: 5 }}
          >
            <Box
              p={{ base: 4, md: 5 }}
              borderRadius="18px"
              bg="white"
              boxShadow="0 14px 35px rgba(0,0,0,0.22)"
            >
              <QRCode
                value={BTC_WALLET}
                size={typeof window !== "undefined" && window.innerWidth < 480 ? 150 : 180}
              />
            </Box>
          </Flex>

          <SimpleGrid
            columns={{ base: 1, sm: 2 }}
            spacing={3}
          >
            {[
              ["Network", "Bitcoin (BTC)"],
              ["Confirmations", "2 blocks"],
              ["Minimum deposit", "$100"],
              ["Processing time", "10–30 minutes"],
            ].map(([label, value]) => (
              <Box
                key={label}
                p={3.5}
                borderRadius="13px"
                bg="whiteAlpha.30"
                border="1px solid"
                borderColor="whiteAlpha.80"
              >
                <Text fontSize="xs" color="gray.500">
                  {label}
                </Text>

                <Text
                  mt={1}
                  fontSize="sm"
                  fontWeight="600"
                  color="gray.100"
                >
                  {value}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Box>

      <Box
        p={{ base: 4, md: 5 }}
        borderRadius="15px"
        bg="rgba(245,158,11,0.06)"
        border="1px solid"
        borderColor="rgba(245,158,11,0.14)"
      >
        <Flex align="flex-start" gap={3}>
          <Box
            mt={0.5}
            color="orange.300"
            flexShrink={0}
          >
            <FiAlertTriangle size={18} />
          </Box>

          <Box>
            <Text
              fontSize="sm"
              fontWeight="700"
              color="orange.200"
            >
              Important
            </Text>

            <Text
              mt={1}
              fontSize="xs"
              color="gray.400"
              lineHeight="1.7"
            >
              Send BTC only. Verify the network and wallet address
              before confirming your transfer. Unsupported transfers
              may result in loss of funds.
            </Text>
          </Box>
        </Flex>
      </Box>

      <FormControl>
        <FormLabel
          fontSize="sm"
          fontWeight="600"
          color="gray.300"
        >
          Amount sent
        </FormLabel>

        <Input
          h="52px"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.005"
          type="number"
          inputMode="decimal"
          min="0"
          step="any"
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
            borderColor: "orange.400",
            boxShadow: "0 0 0 1px rgba(245,158,11,0.6)",
          }}
        />
      </FormControl>

      <Button
        h="54px"
        w="100%"
        borderRadius="12px"
        bg="orange.400"
        color="gray.950"
        fontWeight="700"
        isLoading={loading}
        loadingText="Submitting deposit..."
        onClick={handleSubmit}
        _hover={{
          bg: "orange.300",
          transform: "translateY(-1px)",
          boxShadow: "0 10px 24px rgba(245,158,11,0.16)",
        }}
        _active={{
          transform: "translateY(0)",
        }}
      >
        Submit deposit
      </Button>

      <Flex
        align="center"
        justify="center"
        gap={2}
        color="gray.600"
        fontSize="xs"
      >
        <FiShield />
        Deposits are reviewed before funds are credited.
      </Flex>
    </VStack>
  );
}

export default DepositForm;