import {
  FiHome,
  FiDownload,
  FiUpload,
  FiTrendingUp,
  FiBriefcase,
  FiRepeat,
  FiBell,
  FiUser,
  FiUsers,
  FiDollarSign,
  FiBarChart2,
  FiActivity,
  FiFileText,
  FiStar,
  FiX,
} from "react-icons/fi";
import {
  Box,
  Text,
  VStack,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

function Sidebar({ isOpen, onClose }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  let role = null;

  if (token) {
    try {
      role = JSON.parse(atob(token.split(".")[1])).role;
    } catch (err) {
      console.error(err);
    }
  }

  const linkStyle = (path) => ({
    w: "100%",
    p: "10px 12px",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    bg:
      location.pathname === path
        ? "rgba(59, 130, 246, 0.15)"
        : "transparent",
    boxShadow:
      location.pathname === path
        ? "0 0 10px rgba(59,130,246,0.3)"
        : "none",
    borderLeft:
      location.pathname === path
        ? "3px solid #3b82f6"
        : "3px solid transparent",
    _hover: {
      bg: "rgba(255,255,255,0.05)",
      transform: "translateX(4px)",
    },
  });

  const handleNavigation = () => {
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <Box
          display={{ base: "block", md: "none" }}
          position="fixed"
          inset="0"
          bg="rgba(0,0,0,0.55)"
          backdropFilter="blur(2px)"
          zIndex="999"
          onClick={onClose}
        />
      )}

      <Box
        as={motion.div}
        animate={{
          width: isOpen ? "260px" : "80px",
        }}
        transition={{ duration: 0.3 }}
        minH={{ base: "100vh", md: "100vh" }}
        bg="rgba(15,23,42,0.97)"
        borderRight="1px solid rgba(255,255,255,0.08)"
        color="white"
        p={isOpen ? 6 : 3}
        backdropFilter="blur(12px)"
        overflow="hidden"
        position={{ base: "fixed", md: "relative" }}
        top={{ base: 0, md: "auto" }}
        left={{ base: 0, md: "auto" }}
        bottom={{ base: 0, md: "auto" }}
        zIndex="1000"
        display={{
          base: isOpen ? "block" : "none",
          md: "block",
        }}
      >
        <Flex
          align="flex-start"
          justify="space-between"
          mb={isOpen ? 8 : 4}
        >
          {isOpen ? (
            <Box>
              <Text
                fontSize="2xl"
                fontWeight="extrabold"
                bgGradient="linear(to-r, orange.300, yellow.400)"
                bgClip="text"
                letterSpacing="1px"
              >
                BitcoinVault
              </Text>

              <Text
                fontSize="xs"
                color="gray.400"
                mt={1}
                letterSpacing="0.5px"
              >
                Secure Bitcoin Wealth Management
              </Text>
            </Box>
          ) : null}

          <IconButton
            display={{ base: "flex", md: "none" }}
            aria-label="Close sidebar"
            icon={<FiX />}
            size="sm"
            variant="ghost"
            color="white"
            _hover={{
              bg: "rgba(255,255,255,0.1)",
            }}
            onClick={onClose}
          />
        </Flex>

        <VStack
          align={isOpen ? "start" : "center"}
          spacing={3}
          w="100%"
        >
          <Link
            to="/dashboard"
            style={{ width: "100%" }}
            onClick={handleNavigation}
          >
            <Box {...linkStyle("/dashboard")}>
              <FiHome />
              {isOpen && <Text fontSize="sm">Dashboard</Text>}
            </Box>
          </Link>

          <Link
            to="/deposit"
            style={{ width: "100%" }}
            onClick={handleNavigation}
          >
            <Box {...linkStyle("/deposit")}>
              <FiDownload />
              {isOpen && <Text fontSize="sm">Deposit Bitcoin</Text>}
            </Box>
          </Link>

          <Link
            to="/investments"
            style={{ width: "100%" }}
            onClick={handleNavigation}
          >
            <Box {...linkStyle("/investments")}>
              <FiTrendingUp />
              {isOpen && <Text fontSize="sm">Investment Plans</Text>}
            </Box>
          </Link>

          <Link
            to="/my-investments"
            style={{ width: "100%" }}
            onClick={handleNavigation}
          >
            <Box {...linkStyle("/my-investments")}>
              <FiBriefcase />
              {isOpen && <Text fontSize="sm">My Investments</Text>}
            </Box>
          </Link>

          <Link
            to="/withdrawal"
            style={{ width: "100%" }}
            onClick={handleNavigation}
          >
            <Box {...linkStyle("/withdrawal")}>
              <FiUpload />
              {isOpen && <Text fontSize="sm">Withdraw Bitcoin</Text>}
            </Box>
          </Link>

          <Link
            to="/transactions"
            style={{ width: "100%" }}
            onClick={handleNavigation}
          >
            <Box {...linkStyle("/transactions")}>
              <FiRepeat />
              {isOpen && <Text fontSize="sm">Transactions</Text>}
            </Box>
          </Link>

          <Link
            to="/notifications"
            style={{ width: "100%" }}
            onClick={handleNavigation}
          >
            <Box {...linkStyle("/notifications")}>
              <FiBell />
              {isOpen && <Text fontSize="sm">Notifications</Text>}
            </Box>
          </Link>

          <Link
            to="/testimonials"
            style={{ width: "100%" }}
            onClick={handleNavigation}
          >
            <Box {...linkStyle("/testimonials")}>
              <FiStar />
              {isOpen && <Text fontSize="sm">Testimonials</Text>}
            </Box>
          </Link>

          <Link
            to="/profile"
            style={{ width: "100%" }}
            onClick={handleNavigation}
          >
            <Box {...linkStyle("/profile")}>
              <FiUser />
              {isOpen && <Text fontSize="sm">Profile</Text>}
            </Box>
          </Link>

          {role === "admin" && (
            <Box mt={8} w="100%">
              {isOpen && (
                <Text fontSize="xs" color="gray.500" mb={3}>
                  ADMIN
                </Text>
              )}

              <Link
                to="/admin"
                style={{ width: "100%" }}
                onClick={handleNavigation}
              >
                <Box {...linkStyle("/admin")}>
                  <FiBarChart2 />
                  {isOpen && (
                    <Text fontSize="sm" color="orange.300">
                      Admin Dashboard
                    </Text>
                  )}
                </Box>
              </Link>

              <Link
                to="/admin/users"
                style={{ width: "100%" }}
                onClick={handleNavigation}
              >
                <Box {...linkStyle("/admin/users")}>
                  <FiUsers />
                  {isOpen && <Text fontSize="sm">Users</Text>}
                </Box>
              </Link>

              <Link
                to="/admin/deposits"
                style={{ width: "100%" }}
                onClick={handleNavigation}
              >
                <Box {...linkStyle("/admin/deposits")}>
                  <FiDownload />
                  {isOpen && (
                    <Text fontSize="sm">Bitcoin Deposits</Text>
                  )}
                </Box>
              </Link>

              <Link
                to="/admin/withdrawals"
                style={{ width: "100%" }}
                onClick={handleNavigation}
              >
                <Box {...linkStyle("/admin/withdrawals")}>
                  <FiUpload />
                  {isOpen && (
                    <Text fontSize="sm">Bitcoin Withdrawals</Text>
                  )}
                </Box>
              </Link>

              <Link
                to="/admin/investments"
                style={{ width: "100%" }}
                onClick={handleNavigation}
              >
                <Box {...linkStyle("/admin/investments")}>
                  <FiTrendingUp />
                  {isOpen && <Text fontSize="sm">Investments</Text>}
                </Box>
              </Link>

              <Link
                to="/admin/plans"
                style={{ width: "100%" }}
                onClick={handleNavigation}
              >
                <Box {...linkStyle("/admin/plans")}>
                  <FiDollarSign />
                  {isOpen && (
                    <Text fontSize="sm">Investment Plans</Text>
                  )}
                </Box>
              </Link>

              <Link
                to="/admin/testimonials"
                style={{ width: "100%" }}
                onClick={handleNavigation}
              >
                <Box {...linkStyle("/admin/testimonials")}>
                  <FiFileText />
                  {isOpen && <Text fontSize="sm">Testimonials</Text>}
                </Box>
              </Link>

              <Link
                to="/admin/logs"
                style={{ width: "100%" }}
                onClick={handleNavigation}
              >
                <Box {...linkStyle("/admin/logs")}>
                  <FiActivity />
                  {isOpen && <Text fontSize="sm">Activity Logs</Text>}
                </Box>
              </Link>
            </Box>
          )}
        </VStack>
      </Box>
    </>
  );
}

export default Sidebar;