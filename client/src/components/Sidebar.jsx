import {
  FiHome,
  FiDownload,
  FiUpload,
  FiTrendingUp,
  FiBriefcase,
  FiRepeat,
  FiBell,
  FiUser,
  FiSettings,
  FiUsers,
  FiDollarSign,
  FiBarChart2,
  FiActivity,
  FiFileText,
  FiStar,
} from "react-icons/fi";
import { Box, Text, VStack, Flex, Badge } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { Tooltip } from "@chakra-ui/react";
import { motion } from "framer-motion";
function Sidebar({ isOpen }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  let role = null;

  if (token) {
    try {
      role = JSON.parse(atob(token.split(".")[1])).role;
    } catch (err) {
      console.log(err);
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

    // ACTIVE STATE
    bg: location.pathname === path ? "rgba(59, 130, 246, 0.15)" : "transparent",

    boxShadow:
      location.pathname === path ? "0 0 10px rgba(59,130,246,0.3)" : "none",

    borderLeft:
      location.pathname === path
        ? "3px solid #3b82f6"
        : "3px solid transparent",

    _hover: {
      bg: "rgba(255,255,255,0.05)",
      transform: "translateX(4px)",
    },
  });

  return (
    <Box
      as={motion.div}
      animate={{ width: isOpen ? "260px" : "80px" }}
      transition={{ duration: 0.3 }}
      minH="100vh"
      bg="rgba(255,255,255,0.03)"
      borderRight="1px solid rgba(255,255,255,0.08)"
      color="white"
      p={isOpen ? 6 : 3}
      backdropFilter="blur(12px)"
      overflow="hidden"
      display={{ base: isOpen ? "block" : "none", md: "block" }}
      position={{ base: "absolute", md: "relative" }}
      zIndex="1000"
    >
      {/* Brand */}
      {isOpen && (
        <>
          <Text
            fontSize="2xl"
            fontWeight="extrabold"
            bgGradient="linear(to-r, orange.300, yellow.400)"
            bgClip="text"
            letterSpacing="1px"
            mb={1}
          >
            BitcoinVault
          </Text>

          <Text fontSize="xs" color="gray.400" mb={10} letterSpacing="0.5px">
            Secure Bitcoin Wealth Management
          </Text>
        </>
      )}
      {/* Links */}
      <VStack align={isOpen ? "start" : "center"} spacing={3}>
        {/* USER NAVIGATION */}

        <Link to="/dashboard" style={{ width: "100%" }}>
          <Box {...linkStyle("/dashboard")}>
            <FiHome />
            {isOpen && <Text fontSize="sm">Dashboard</Text>}
          </Box>
        </Link>

        <Link to="/deposit" style={{ width: "100%" }}>
          <Box {...linkStyle("/deposit")}>
            <FiDownload />
            {isOpen && <Text fontSize="sm">Deposit Bitcoin</Text>}
          </Box>
        </Link>

        <Link to="/investments" style={{ width: "100%" }}>
          <Box {...linkStyle("/investments")}>
            <FiTrendingUp />
            {isOpen && <Text fontSize="sm">Investment Plans</Text>}
          </Box>
        </Link>

        <Link to="/my-investments" style={{ width: "100%" }}>
          <Box {...linkStyle("/my-investments")}>
            <FiBriefcase />
            {isOpen && <Text fontSize="sm">My Investments</Text>}
          </Box>
        </Link>

        <Link to="/withdrawal" style={{ width: "100%" }}>
          <Box {...linkStyle("/withdrawal")}>
            <FiUpload />
            {isOpen && <Text fontSize="sm">Withdraw Bitcoin</Text>}
          </Box>
        </Link>

        <Link to="/transactions" style={{ width: "100%" }}>
          <Box {...linkStyle("/transactions")}>
            <FiRepeat />
            {isOpen && <Text fontSize="sm">Transactions</Text>}
          </Box>
        </Link>

        <Link to="/notifications" style={{ width: "100%" }}>
          <Box {...linkStyle("/notifications")}>
            <FiBell />
            {isOpen && <Text fontSize="sm">Notifications</Text>}
          </Box>
        </Link>
        <Link to="/testimonials" style={{ width: "100%" }}>
          <Box {...linkStyle("/testimonials")}>
            <FiStar />
            {isOpen && <Text fontSize="sm">Testimonials</Text>}
          </Box>
        </Link>

        <Link to="/profile" style={{ width: "100%" }}>
          <Box {...linkStyle("/profile")}>
            <FiUser />
            {isOpen && <Text fontSize="sm">Profile</Text>}
          </Box>
        </Link>

        {/* ADMIN SECTION */}

        {role === "admin" && (
          <Box mt={8} w="100%">
            {isOpen && (
              <Text fontSize="xs" color="gray.500" mb={3}>
                ADMIN
              </Text>
            )}

            <Link to="/admin" style={{ width: "100%" }}>
              <Box {...linkStyle("/admin")}>
                <FiBarChart2 />

                {isOpen && (
                  <Text fontSize="sm" color="orange.300">
                    Admin Dashboard
                  </Text>
                )}
              </Box>
            </Link>

            <Link to="/admin/users" style={{ width: "100%" }}>
              <Box {...linkStyle("/admin/users")}>
                <FiUsers />

                {isOpen && <Text fontSize="sm">Users</Text>}
              </Box>
            </Link>

            <Link to="/admin/deposits" style={{ width: "100%" }}>
              <Box {...linkStyle("/admin/deposits")}>
                <FiDownload />

                {isOpen && <Text fontSize="sm">Bitcoin Deposits</Text>}
              </Box>
            </Link>

            <Link to="/admin/withdrawals" style={{ width: "100%" }}>
              <Box {...linkStyle("/admin/withdrawals")}>
                <FiUpload />

                {isOpen && <Text fontSize="sm">Bitcoin Withdrawals</Text>}
              </Box>
            </Link>

            <Link to="/admin/investments" style={{ width: "100%" }}>
              <Box {...linkStyle("/admin/investments")}>
                <FiTrendingUp />

                {isOpen && <Text fontSize="sm">Investments</Text>}
              </Box>
            </Link>

            <Link to="/admin/plans" style={{ width: "100%" }}>
              <Box {...linkStyle("/admin/plans")}>
                <FiDollarSign />

                {isOpen && <Text fontSize="sm">Investment Plans</Text>}
              </Box>
            </Link>

            <Link to="/admin/testimonials" style={{ width: "100%" }}>
              <Box {...linkStyle("/admin/testimonials")}>
                <FiFileText />

                {isOpen && <Text fontSize="sm">Testimonials</Text>}
              </Box>
            </Link>

            <Link to="/admin/logs" style={{ width: "100%" }}>
              <Box {...linkStyle("/admin/logs")}>
                <FiActivity />

                {isOpen && <Text fontSize="sm">Activity Logs</Text>}
              </Box>
            </Link>
          </Box>
        )}
      </VStack>
    </Box>
  );
}

export default Sidebar;
