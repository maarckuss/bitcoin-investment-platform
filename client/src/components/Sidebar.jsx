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
import { Box, Flex, IconButton, Text, Tooltip, VStack } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const userLinks = [
  { path: "/dashboard", label: "Dashboard", icon: FiHome },
  { path: "/deposit", label: "Deposit Bitcoin", icon: FiDownload },
  { path: "/investments", label: "Investment Plans", icon: FiTrendingUp },
  { path: "/my-investments", label: "My Investments", icon: FiBriefcase },
  { path: "/withdrawal", label: "Withdraw Bitcoin", icon: FiUpload },
  { path: "/transactions", label: "Transactions", icon: FiRepeat },
  { path: "/notifications", label: "Notifications", icon: FiBell },
  { path: "/testimonials", label: "Testimonials", icon: FiStar },
  { path: "/profile", label: "Profile", icon: FiUser },
];

const adminLinks = [
  { path: "/admin", label: "Admin Dashboard", icon: FiBarChart2 },
  { path: "/admin/users", label: "Users", icon: FiUsers },
  { path: "/admin/deposits", label: "Bitcoin Deposits", icon: FiDownload },
  { path: "/admin/withdrawals", label: "Bitcoin Withdrawals", icon: FiUpload },
  { path: "/admin/investments", label: "Investments", icon: FiTrendingUp },
  { path: "/admin/plans", label: "Investment Plans", icon: FiDollarSign },
  { path: "/admin/testimonials", label: "Testimonials", icon: FiFileText },
  { path: "/admin/logs", label: "Activity Logs", icon: FiActivity },
];

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  let role = null;

  if (token) {
    try {
      role = JSON.parse(atob(token.split(".")[1])).role;
    } catch {
      role = null;
    }
  }

  const handleNavigation = () => {
    if (window.innerWidth < 768 && onClose) {
      onClose();
    }
  };

  const renderLink = ({ path, label, icon: Icon }) => {
    const isActive =
      location.pathname === path ||
      (path !== "/dashboard" && location.pathname.startsWith(`${path}/`));

    return (
      <Tooltip
        key={path}
        label={!isOpen ? label : undefined}
        placement="right"
        hasArrow
        isDisabled={isOpen}
      >
        <Link to={path} onClick={handleNavigation} style={{ width: "100%" }}>
          <Flex
            align="center"
            justify={isOpen ? "flex-start" : "center"}
            gap={3}
            w="100%"
            minH="46px"
            px={isOpen ? 3 : 0}
            borderRadius="12px"
            position="relative"
            color={isActive ? "white" : "gray.400"}
            bg={isActive ? "whiteAlpha.100" : "transparent"}
            transition="all 0.2s ease"
            _hover={{
              color: "white",
              bg: "whiteAlpha.100",
              transform: "translateX(2px)",
            }}
          >
            {isActive && (
              <Box
                position="absolute"
                left="0"
                top="8px"
                bottom="8px"
                w="3px"
                borderRadius="full"
                bg="orange.400"
              />
            )}

            <Icon size={18} />

            {isOpen && (
              <Text
                fontSize="sm"
                fontWeight={isActive ? "600" : "500"}
                color={path === "/admin" && isActive ? "orange.300" : "inherit"}
                noOfLines={1}
              >
                {label}
              </Text>
            )}
          </Flex>
        </Link>
      </Tooltip>
    );
  };

  return (
    <>
      {isOpen && (
        <Box
          display={{ base: "block", md: "none" }}
          position="fixed"
          inset="0"
          bg="blackAlpha.600"
          backdropFilter="blur(3px)"
          zIndex={999}
          onClick={onClose}
        />
      )}

      <Box
        as={motion.aside}
        animate={{
          width: isOpen ? "260px" : "78px",
          x: 0,
        }}
        transition={{
          duration: 0.25,
          ease: "easeInOut",
        }}
        position={{ base: "fixed", md: "relative" }}
        top={{ base: 0, md: "auto" }}
        left={{ base: 0, md: "auto" }}
        bottom={{ base: 0, md: "auto" }}
        zIndex={1000}
        display={{
          base: isOpen ? "block" : "none",
          md: "block",
        }}
        minH="100vh"
        flexShrink={0}
        overflow="hidden"
        borderRight="1px solid"
        borderColor="whiteAlpha.100"
        bg="rgba(10, 17, 32, 0.96)"
        backdropFilter="blur(20px)"
        color="white"
        px={isOpen ? 4 : 3}
        py={5}
      >
        <Flex
          align="center"
          justify={isOpen ? "space-between" : "center"}
          mb={8}
          minH="48px"
        >
          {isOpen && (
            <Box minW="0">
              <Text
                fontSize="xl"
                fontWeight="800"
                bgGradient="linear(to-r, orange.300, yellow.400)"
                bgClip="text"
                noOfLines={1}
              >
                BitcoinVault
              </Text>

              <Text mt={1} fontSize="xs" color="gray.500" noOfLines={1}>
                Wealth Management
              </Text>
            </Box>
          )}

          <IconButton
            display={{ base: "flex", md: "none" }}
            aria-label="Close sidebar"
            icon={<FiX />}
            size="sm"
            variant="ghost"
            color="gray.300"
            borderRadius="10px"
            onClick={onClose}
            _hover={{
              color: "white",
              bg: "whiteAlpha.100",
            }}
          />
        </Flex>

        <VStack spacing={2} align="stretch">
          <Text
            display={{ base: "none", md: isOpen ? "block" : "none" }}
            px={3}
            mb={1}
            fontSize="10px"
            fontWeight="700"
            color="gray.600"
            letterSpacing="0.12em"
            textTransform="uppercase"
          >
            Menu
          </Text>

          {userLinks.map(renderLink)}

          {role === "admin" && (
            <Box mt={6}>
              {isOpen && (
                <Text
                  px={3}
                  mb={2}
                  fontSize="10px"
                  fontWeight="700"
                  color="gray.600"
                  letterSpacing="0.12em"
                  textTransform="uppercase"
                >
                  Administration
                </Text>
              )}

              <VStack spacing={2} align="stretch">
                {adminLinks.map(renderLink)}
              </VStack>
            </Box>
          )}
        </VStack>
      </Box>
    </>
  );
}

export default Sidebar;
