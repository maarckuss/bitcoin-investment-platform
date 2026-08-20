import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Text,
} from "@chakra-ui/react";
import DepositForm from "../components/DepositForm";

function Deposit() {
  return (
    <Box
      px={{ base: 4, md: 8 }}
      py={{ base: 6, md: 8 }}
      flex={1}
      minH="100vh"
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
    >
      <Box
        w="100%"
        maxW="520px"
        p={6}
        borderRadius="20px"
        bg="rgba(255,255,255,0.04)"
        border="1px solid rgba(255,255,255,0.08)"
        boxShadow="0 8px 24px rgba(0,0,0,0.25)"
      >
        <Text fontSize="3xl" fontWeight="bold" color="white" mb={2}>
          Fund Your Account
        </Text>

        <Text fontSize="sm" color="gray.400" mb={6}>
          Use your personal Bitcoin wallet below to securely deposit funds into
          your investment account.
        </Text>

        <DepositForm />
      </Box>
    </Box>
  );
}

export default Deposit;
