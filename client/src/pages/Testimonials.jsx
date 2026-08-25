import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Center,
  Divider,
  Flex,
  SimpleGrid,
  Spinner,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  FiMessageSquare,
  FiShield,
  FiStar,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import API from "../api/axios";

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await API.get("/testimonials");
        setTestimonials(res.data || []);
      } catch (err) {
        console.error(err);

        toast({
          title: "Unable to load testimonials",
          description:
            err.response?.data?.message ||
            "Please try again later.",
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "top",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [toast]);

  const featuredTestimonials = useMemo(
    () => testimonials.filter((item) => item.featured),
    [testimonials],
  );

  const averageRating = useMemo(() => {
    if (!testimonials.length) return "0.0";

    const total = testimonials.reduce(
      (sum, item) => sum + Number(item.rating || 0),
      0,
    );

    return (total / testimonials.length).toFixed(1);
  }, [testimonials]);

  return (
    <Box
      minH="calc(100vh - 96px)"
      bg="#0b1220"
      px={{ base: 4, sm: 5, md: 6, lg: 8 }}
      py={{ base: 5, md: 7, lg: 8 }}
      overflowX="hidden"
      position="relative"
    >
      <Box
        position="absolute"
        top="-140px"
        right="-120px"
        w={{ base: "280px", md: "480px" }}
        h={{ base: "280px", md: "480px" }}
        borderRadius="full"
        bg="orange.400"
        opacity={0.05}
        filter="blur(150px)"
        pointerEvents="none"
      />

      <Box
        position="absolute"
        bottom="-160px"
        left="-130px"
        w={{ base: "300px", md: "500px" }}
        h={{ base: "300px", md: "500px" }}
        borderRadius="full"
        bg="blue.500"
        opacity={0.04}
        filter="blur(150px)"
        pointerEvents="none"
      />

      <Box
        maxW="1280px"
        mx="auto"
        w="100%"
        position="relative"
      >
        <Box
          p={{ base: 5, sm: 6, md: 8, lg: 10 }}
          mb={{ base: 5, md: 7 }}
          border="1px solid"
          borderColor="whiteAlpha.100"
          borderRadius={{ base: "18px", md: "24px" }}
          bg="linear-gradient(
            135deg,
            rgba(245,158,11,0.10),
            rgba(255,255,255,0.025)
          )"
          backdropFilter="blur(18px)"
          boxShadow="0 18px 50px rgba(0,0,0,0.18)"
        >
          <Flex
            direction={{ base: "column", lg: "row" }}
            align={{ base: "stretch", lg: "center" }}
            justify="space-between"
            gap={{ base: 5, lg: 8 }}
          >
            <Box maxW="720px">
              <Flex
                align="center"
                gap={3}
                mb={4}
                flexWrap="wrap"
              >
                <Flex
                  align="center"
                  justify="center"
                  w="42px"
                  h="42px"
                  borderRadius="13px"
                  bg="rgba(245,158,11,0.10)"
                  color="orange.300"
                >
                  <FiUsers size={19} />
                </Flex>

                <Badge
                  colorScheme="orange"
                  variant="subtle"
                  borderRadius="full"
                  px={3}
                  py={1}
                  fontSize="10px"
                  textTransform="uppercase"
                  letterSpacing="0.08em"
                >
                  Investor community
                </Badge>
              </Flex>

              <Text
                fontSize={{ base: "2xl", sm: "3xl", md: "4xl", lg: "5xl" }}
                fontWeight="800"
                color="white"
                lineHeight="1.05"
                letterSpacing="-0.04em"
              >
                What our investors say
              </Text>

              <Text
                mt={4}
                color="gray.500"
                fontSize={{ base: "sm", md: "md", lg: "lg" }}
                lineHeight="1.8"
              >
                Explore experiences shared by members of the
                BitcoinVault community.
              </Text>
            </Box>

            <Box
              flexShrink={0}
              w="100%"
              maxW={{ base: "none", lg: "240px" }}
              p={{ base: 4, md: 5 }}
              borderRadius="18px"
              bg="whiteAlpha.40"
              border="1px solid"
              borderColor="whiteAlpha.80"
              textAlign="center"
            >
              <Text
                fontSize="xs"
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="0.08em"
                color="gray.500"
              >
                Community rating
              </Text>

              <Text
                mt={2}
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="800"
                color="white"
              >
                {averageRating}
              </Text>

              <Flex
                justify="center"
                gap={1}
                mt={1}
                color="orange.300"
              >
                {Array.from({ length: 5 }).map((_, index) => (
                  <FiStar
                    key={index}
                    size={15}
                    fill="currentColor"
                  />
                ))}
              </Flex>

              <Text
                mt={2}
                fontSize="xs"
                color="gray.600"
              >
                Based on {testimonials.length}{" "}
                {testimonials.length === 1 ? "review" : "reviews"}
              </Text>
            </Box>
          </Flex>
        </Box>

        <SimpleGrid
          columns={{ base: 1, md: 3 }}
          spacing={{ base: 3, md: 4 }}
          mb={{ base: 7, md: 9 }}
        >
          {[
            {
              label: "Investor reviews",
              value: testimonials.length,
              icon: FiUsers,
              color: "blue.300",
              bg: "rgba(59,130,246,0.10)",
            },
            {
              label: "Featured investors",
              value: featuredTestimonials.length,
              icon: FiShield,
              color: "green.300",
              bg: "rgba(34,197,94,0.10)",
            },
            {
              label: "Average rating",
              value: `${averageRating}/5`,
              icon: FiTrendingUp,
              color: "orange.300",
              bg: "rgba(245,158,11,0.10)",
            },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <Box
                key={stat.label}
                p={{ base: 4, md: 5 }}
                border="1px solid"
                borderColor="whiteAlpha.100"
                borderRadius={{ base: "15px", md: "17px" }}
                bg="rgba(255,255,255,0.035)"
                backdropFilter="blur(12px)"
              >
                <Flex align="center" gap={3}>
                  <Flex
                    align="center"
                    justify="center"
                    w="40px"
                    h="40px"
                    flexShrink={0}
                    borderRadius="12px"
                    bg={stat.bg}
                    color={stat.color}
                  >
                    <Icon size={18} />
                  </Flex>

                  <Box>
                    <Text
                      fontSize="xs"
                      color="gray.600"
                    >
                      {stat.label}
                    </Text>

                    <Text
                      mt={1}
                      fontSize={{ base: "xl", md: "2xl" }}
                      fontWeight="800"
                      color="white"
                    >
                      {stat.value}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            );
          })}
        </SimpleGrid>

        <Flex
          align={{ base: "flex-start", sm: "center" }}
          justify="space-between"
          direction={{ base: "column", sm: "row" }}
          gap={3}
          mb={4}
        >
          <Box>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="700"
              color="white"
            >
              Investor experiences
            </Text>

            <Text
              mt={1}
              fontSize="sm"
              color="gray.600"
            >
              Experiences shared by members of the community.
            </Text>
          </Box>

          <Badge
            colorScheme="green"
            variant="subtle"
            borderRadius="full"
            px={3}
            py={1.5}
            fontSize="10px"
          >
            Community feedback
          </Badge>
        </Flex>

        <Divider
          mb={{ base: 5, md: 7 }}
          borderColor="whiteAlpha.100"
        />

        {loading && (
          <Center py={16}>
            <VStack spacing={4}>
              <Spinner
                size="lg"
                thickness="3px"
                color="orange.300"
                emptyColor="whiteAlpha.200"
              />

              <Text
                color="gray.500"
                fontSize="sm"
              >
                Loading investor experiences...
              </Text>
            </VStack>
          </Center>
        )}

        {!loading && testimonials.length === 0 && (
          <Box
            p={{ base: 7, md: 10 }}
            textAlign="center"
            border="1px solid"
            borderColor="whiteAlpha.100"
            borderRadius={{ base: "18px", md: "22px" }}
            bg="rgba(255,255,255,0.035)"
          >
            <Flex
              align="center"
              justify="center"
              w="54px"
              h="54px"
              mx="auto"
              borderRadius="16px"
              bg="whiteAlpha.100"
              color="gray.400"
            >
              <FiMessageSquare size={22} />
            </Flex>

            <Text
              mt={5}
              fontSize="lg"
              fontWeight="700"
              color="white"
            >
              No testimonials yet
            </Text>

            <Text
              mt={2}
              maxW="450px"
              mx="auto"
              fontSize="sm"
              color="gray.600"
              lineHeight="1.7"
            >
              Investor experiences will appear here once testimonials
              are added.
            </Text>
          </Box>
        )}

        {!loading && testimonials.length > 0 && (
          <>
            <SimpleGrid
              columns={{ base: 1, md: 2, xl: 3 }}
              spacing={{ base: 4, md: 5 }}
            >
              {testimonials.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: index * 0.04,
                  }}
                  whileHover={{ y: -3 }}
                >
                  <Box
                    h="100%"
                    p={{ base: 4.5, md: 5 }}
                    border="1px solid"
                    borderColor={
                      item.featured
                        ? "rgba(245,158,11,0.18)"
                        : "whiteAlpha.100"
                    }
                    borderRadius={{ base: "16px", md: "18px" }}
                    bg={
                      item.featured
                        ? "rgba(245,158,11,0.045)"
                        : "rgba(255,255,255,0.035)"
                    }
                    backdropFilter="blur(12px)"
                    boxShadow="0 12px 32px rgba(0,0,0,0.15)"
                  >
                    <VStack
                      align="stretch"
                      spacing={4}
                    >
                      <Flex
                        justify="space-between"
                        align="flex-start"
                        gap={3}
                      >
                        <Flex
                          align="center"
                          gap={3}
                          minW="0"
                        >
                          <Avatar
                            name={item.name}
                            src={item.image}
                            size="sm"
                            bg="orange.400"
                            color="gray.950"
                            flexShrink={0}
                          />

                          <Box minW="0">
                            <Text
                              fontSize="sm"
                              fontWeight="700"
                              color="white"
                              noOfLines={1}
                            >
                              {item.name}
                            </Text>

                            <Text
                              mt={0.5}
                              fontSize="xs"
                              color="gray.600"
                              noOfLines={1}
                            >
                              {item.country}
                            </Text>
                          </Box>
                        </Flex>

                        {item.featured && (
                          <Badge
                            colorScheme="orange"
                            variant="subtle"
                            borderRadius="full"
                            px={2.5}
                            py={1}
                            fontSize="9px"
                            flexShrink={0}
                          >
                            Featured
                          </Badge>
                        )}
                      </Flex>

                      <Flex
                        align="center"
                        gap={1}
                      >
                        {Array.from({ length: 5 }).map((_, index) => {
                          const filled =
                            index < Number(item.rating || 0);

                          return (
                            <FiStar
                              key={index}
                              size={14}
                              color={
                                filled
                                  ? "#f59e0b"
                                  : "#475569"
                              }
                              fill={
                                filled
                                  ? "#f59e0b"
                                  : "transparent"
                              }
                            />
                          );
                        })}

                        <Text
                          ml={1}
                          fontSize="xs"
                          color="gray.600"
                        >
                          {item.rating || 0}/5
                        </Text>
                      </Flex>

                      <Box>
                        <Text
                          color="orange.300"
                          fontSize="3xl"
                          fontWeight="800"
                          lineHeight="0.8"
                        >
                          “
                        </Text>

                        <Text
                          mt={2}
                          color="gray.400"
                          fontSize="sm"
                          lineHeight="1.8"
                        >
                          {item.message}
                        </Text>
                      </Box>

                      <Divider borderColor="whiteAlpha.100" />

                      <Flex
                        align="center"
                        gap={2}
                        color="green.300"
                      >
                        <FiShield size={14} />

                        <Text
                          fontSize="xs"
                          color="gray.600"
                        >
                          Community feedback
                        </Text>
                      </Flex>
                    </VStack>
                  </Box>
                </motion.div>
              ))}
            </SimpleGrid>

            <Box
              mt={{ base: 8, md: 10 }}
              p={{ base: 5, md: 6 }}
              border="1px solid"
              borderColor="whiteAlpha.80"
              borderRadius={{ base: "16px", md: "18px" }}
              bg="rgba(255,255,255,0.025)"
              textAlign="center"
            >
              <Flex
                align="center"
                justify="center"
                gap={2}
                color="green.300"
              >
                <FiShield size={16} />

                <Text
                  fontSize="sm"
                  fontWeight="600"
                >
                  Powered by our investor community
                </Text>
              </Flex>

              <Text
                mt={2}
                maxW="650px"
                mx="auto"
                color="gray.600"
                fontSize="xs"
                lineHeight="1.7"
              >
                Explore experiences shared through the platform's
                testimonial system.
              </Text>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

export default Testimonials;