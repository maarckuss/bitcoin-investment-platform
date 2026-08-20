import { Flex, Text, Spacer, Avatar, Button, Box } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar({ setIsOpen, isOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Flex
      align="center"
      justify="space-between"
      px={6}
      py={4}
      mb={8}
      borderRadius="16px"
      bg="rgba(255,255,255,0.04)"
      border="1px solid rgba(255,255,255,0.08)"
      boxShadow="0 8px 24px rgba(0,0,0,0.25)"
      backdropFilter="blur(12px)"
      color="white"
    >
      {/* Left Section */}
      <Flex align="center" gap={3}>
        <Button
          size="sm"
          bg="rgba(255,255,255,0.08)"
          color="white"
          _hover={{
            bg: "rgba(255,255,255,0.15)",
          }}
          onClick={() => setIsOpen(!isOpen)}
          mr={3}
        >
          ☰
        </Button>

        <Box>
          <Text
            fontWeight="extrabold"
            bgGradient="linear(to-r, orange.300, yellow.400)"
            bgClip="text"
            letterSpacing="1px"
            mb={1}
          >
            BitcoinVault
          </Text>

          <Text fontSize="xs" color="gray.400">
            Investment Dashboard
          </Text>
        </Box>
      </Flex>

      <Spacer />

      {/* Right Section */}
      <Flex align="center" gap={4}>
        <Avatar
          name="Marcus"
          size="sm"
          cursor="pointer"
          onClick={() => navigate("/profile")}
        />

        <Button
          size="sm"
          onClick={() => navigate("/profile")}
          bg={
            location.pathname === "/profile"
              ? "orange.400"
              : "rgba(255,255,255,0.08)"
          }
          color={location.pathname === "/profile" ? "black" : "white"}
          _hover={{
            bg:
              location.pathname === "/profile"
                ? "orange.300"
                : "rgba(255,255,255,0.15)",
          }}
        >
          Profile
        </Button>

        <Button size="sm" colorScheme="red" onClick={handleLogout}>
          Logout
        </Button>
      </Flex>
    </Flex>
  );
}

export default Navbar;
