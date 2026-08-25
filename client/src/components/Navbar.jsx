import {
  Flex,
  Text,
  Avatar,
  IconButton,
  Button,
  Box,
  Tooltip,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  FiMenu,
  FiChevronLeft,
  FiBell,
  FiUser,
  FiLogOut,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
function Navbar({ setIsOpen, isOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const showProfileText = useBreakpointValue({ base: false, sm: true });
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <Box
      px={{ base: 3, sm: 4, md: 6, lg: 8 }}
      pt={{ base: 3, md: 5 }}
      position="sticky"
      top="0"
      zIndex="900"
    >
      {" "}
      <Flex
        h={{ base: "64px", md: "72px" }}
        align="center"
        justify="space-between"
        gap={3}
        px={{ base: 3, sm: 4, md: 5 }}
        border="1px solid"
        borderColor="whiteAlpha.100"
        borderRadius={{ base: "16px", md: "20px" }}
        bg="rgba(15, 23, 42, 0.82)"
        backdropFilter="blur(18px)"
        boxShadow="0 12px 40px rgba(0,0,0,0.22)"
        color="white"
      >
        {" "}
        <Flex align="center" minW="0" gap={{ base: 2, md: 3 }}>
          {" "}
          <Tooltip
            label={isOpen ? "Collapse sidebar" : "Open sidebar"}
            placement="bottom"
          >
            {" "}
            <IconButton
              aria-label={isOpen ? "Collapse sidebar" : "Open sidebar"}
              icon={isOpen ? <FiChevronLeft /> : <FiMenu />}
              onClick={() => setIsOpen(!isOpen)}
              size={{ base: "sm", md: "md" }}
              variant="ghost"
              color="white"
              borderRadius="12px"
              _hover={{ bg: "whiteAlpha.100" }}
            />{" "}
          </Tooltip>{" "}
          <Box minW="0">
            {" "}
            <Text
              fontSize={{ base: "md", sm: "lg", md: "xl" }}
              fontWeight="800"
              bgGradient="linear(to-r, orange.300, yellow.400)"
              bgClip="text"
              noOfLines={1}
            >
              {" "}
              BitcoinVault{" "}
            </Text>{" "}
            <Text
              display={{ base: "none", sm: "block" }}
              fontSize="xs"
              color="gray.500"
              mt={0.5}
              noOfLines={1}
            >
              {" "}
              Investment Dashboard{" "}
            </Text>{" "}
          </Box>{" "}
        </Flex>{" "}
        <Flex align="center" gap={{ base: 1, sm: 2, md: 3 }}>
          {" "}
          <Tooltip label="Notifications" placement="bottom">
            {" "}
            <IconButton
              aria-label="Notifications"
              icon={<FiBell />}
              size={{ base: "sm", md: "md" }}
              variant="ghost"
              color="gray.300"
              borderRadius="12px"
              onClick={() => navigate("/notifications")}
              bg={
                location.pathname === "/notifications"
                  ? "whiteAlpha.100"
                  : "transparent"
              }
              _hover={{ color: "white", bg: "whiteAlpha.100" }}
            />{" "}
          </Tooltip>{" "}
          <Flex
            align="center"
            gap={2}
            px={{ base: 1, sm: 2 }}
            py={1}
            borderRadius="14px"
            cursor="pointer"
            onClick={() => navigate("/profile")}
            bg={location.pathname === "/profile" ? "orange.400" : "transparent"}
            color={location.pathname === "/profile" ? "gray.900" : "white"}
            _hover={{
              bg:
                location.pathname === "/profile"
                  ? "orange.300"
                  : "whiteAlpha.100",
            }}
          >
            {" "}
            <Avatar name="Marcus" size={{ base: "xs", md: "sm" }} />{" "}
            {showProfileText && (
              <Text
                fontSize="sm"
                fontWeight="600"
                display={{ base: "none", sm: "block" }}
              >
                {" "}
                Profile{" "}
              </Text>
            )}{" "}
          </Flex>{" "}
          <Tooltip label="Logout" placement="bottom">
            {" "}
            <IconButton
              aria-label="Logout"
              icon={<FiLogOut />}
              size={{ base: "sm", md: "md" }}
              variant="ghost"
              color="gray.300"
              borderRadius="12px"
              onClick={handleLogout}
              _hover={{ color: "red.300", bg: "red.500", bgOpacity: 0.12 }}
            />{" "}
          </Tooltip>{" "}
        </Flex>{" "}
      </Flex>{" "}
    </Box>
  );
}
export default Navbar;