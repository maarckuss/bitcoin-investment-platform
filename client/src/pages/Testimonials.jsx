import { useEffect, useState } from "react";
import {
Box,
Text,
SimpleGrid,
Avatar,
VStack,
HStack,
Badge,
Flex,
Divider,
Spinner,
Center,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
FiStar,
FiShield,
FiTrendingUp,
FiUsers,
} from "react-icons/fi";
import API from "../api/axios";

function Testimonials() {
const [testimonials, setTestimonials] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
fetchTestimonials();
}, []);

const fetchTestimonials = async () => {
try {
const res = await API.get("/testimonials");
setTestimonials(res.data);
} catch (err) {
console.log(err);
} finally {
setLoading(false);
}
};

const featuredTestimonials = testimonials.filter(
(item) => item.featured
);

const totalRatings = testimonials.reduce(
(sum, item) => sum + Number(item.rating || 0),
0
);

const averageRating =
testimonials.length > 0
? (totalRatings / testimonials.length).toFixed(1)
: "5.0";

return (
<Box
minH="100vh"
p={{ base: 5, md: 8 }}
position="relative"
overflow="hidden"
>
{/* Background Glow */} <Box
     position="absolute"
     w="450px"
     h="450px"
     bg="orange.400"
     opacity={0.05}
     filter="blur(160px)"
     top="-150px"
     right="-120px"
     pointerEvents="none"
   />

```
  <Box
    position="absolute"
    w="400px"
    h="400px"
    bg="blue.500"
    opacity={0.04}
    filter="blur(160px)"
    bottom="-150px"
    left="-120px"
    pointerEvents="none"
  />

  <Box maxW="1200px" mx="auto" position="relative">
    {/* HERO */}
    <Box
      p={{ base: 7, md: 10 }}
      borderRadius="30px"
      mb={8}
      bg="linear-gradient(135deg, rgba(245,158,11,.12), rgba(255,255,255,.04))"
      border="1px solid rgba(255,255,255,.08)"
      backdropFilter="blur(18px)"
      boxShadow="0 20px 60px rgba(0,0,0,.25)"
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "start", md: "center" }}
        gap={8}
      >
        <Box maxW="680px">
          <HStack mb={4}>
            <Box
              p={3}
              borderRadius="14px"
              bg="rgba(245,158,11,.12)"
              color="orange.300"
            >
              <FiUsers size={22} />
            </Box>

            <Badge
              colorScheme="orange"
              px={3}
              py={1}
              borderRadius="full"
            >
              Investor Community
            </Badge>
          </HStack>

          <Text
            fontSize={{ base: "3xl", md: "5xl" }}
            fontWeight="extrabold"
            color="white"
            lineHeight="1.1"
          >
            What Our Investors Say
          </Text>

          <Text
            color="gray.400"
            fontSize={{ base: "md", md: "lg" }}
            mt={4}
            lineHeight="1.8"
          >
            Discover what members of the BitcoinVault community have to
            say about their experience with our platform.
          </Text>
        </Box>

        {/* Rating Summary */}
        <Box
          minW={{ base: "100%", md: "220px" }}
          p={6}
          borderRadius="22px"
          bg="rgba(255,255,255,.04)"
          border="1px solid rgba(255,255,255,.07)"
          textAlign="center"
        >
          <Text color="gray.400" fontSize="sm" mb={2}>
            Community Rating
          </Text>

          <Text
            color="white"
            fontSize="4xl"
            fontWeight="extrabold"
          >
            {averageRating}
          </Text>

          <HStack justify="center" color="orange.300" mt={1}>
            {[1, 2, 3, 4, 5].map((star) => (
              <FiStar key={star} fill="currentColor" size={16} />
            ))}
          </HStack>

          <Text color="gray.500" fontSize="sm" mt={2}>
            Based on {testimonials.length}{" "}
            {testimonials.length === 1 ? "review" : "reviews"}
          </Text>
        </Box>
      </Flex>
    </Box>

    {/* TRUST STATS */}
    <SimpleGrid
      columns={{ base: 1, md: 3 }}
      spacing={5}
      mb={10}
    >
      <Box
        p={5}
        borderRadius="20px"
        bg="rgba(255,255,255,.04)"
        border="1px solid rgba(255,255,255,.07)"
      >
        <HStack>
          <Box
            p={3}
            borderRadius="12px"
            bg="rgba(59,130,246,.12)"
            color="blue.300"
          >
            <FiUsers />
          </Box>

          <Box>
            <Text color="gray.400" fontSize="sm">
              Investor Reviews
            </Text>

            <Text color="white" fontSize="2xl" fontWeight="bold">
              {testimonials.length}
            </Text>
          </Box>
        </HStack>
      </Box>

      <Box
        p={5}
        borderRadius="20px"
        bg="rgba(255,255,255,.04)"
        border="1px solid rgba(255,255,255,.07)"
      >
        <HStack>
          <Box
            p={3}
            borderRadius="12px"
            bg="rgba(34,197,94,.12)"
            color="green.300"
          >
            <FiShield />
          </Box>

          <Box>
            <Text color="gray.400" fontSize="sm">
              Featured Investors
            </Text>

            <Text color="white" fontSize="2xl" fontWeight="bold">
              {featuredTestimonials.length}
            </Text>
          </Box>
        </HStack>
      </Box>

      <Box
        p={5}
        borderRadius="20px"
        bg="rgba(245,158,11,.06)"
        border="1px solid rgba(245,158,11,.12)"
      >
        <HStack>
          <Box
            p={3}
            borderRadius="12px"
            bg="rgba(245,158,11,.12)"
            color="orange.300"
          >
            <FiTrendingUp />
          </Box>

          <Box>
            <Text color="gray.400" fontSize="sm">
              Average Rating
            </Text>

            <Text color="white" fontSize="2xl" fontWeight="bold">
              {averageRating}/5
            </Text>
          </Box>
        </HStack>
      </Box>
    </SimpleGrid>

    {/* SECTION TITLE */}
    <Flex
      justify="space-between"
      align="center"
      mb={6}
      wrap="wrap"
      gap={3}
    >
      <Box>
        <Text
          color="white"
          fontSize="2xl"
          fontWeight="bold"
        >
          Investor Experiences
        </Text>

        <Text color="gray.500" fontSize="sm" mt={1}>
          Real experiences from members of our community.
        </Text>
      </Box>

      <Badge
        colorScheme="green"
        px={3}
        py={1.5}
        borderRadius="full"
      >
        ● Community Feedback
      </Badge>
    </Flex>

    <Divider
      borderColor="whiteAlpha.100"
      mb={8}
    />

    {/* LOADING */}
    {loading && (
      <Center py={20}>
        <VStack spacing={4}>
          <Spinner
            size="xl"
            color="orange.300"
            thickness="4px"
          />

          <Text color="gray.400">
            Loading investor experiences...
          </Text>
        </VStack>
      </Center>
    )}

    {/* EMPTY STATE */}
    {!loading && testimonials.length === 0 && (
      <Box
        p={10}
        textAlign="center"
        borderRadius="24px"
        bg="rgba(255,255,255,.04)"
        border="1px solid rgba(255,255,255,.08)"
      >
        <Text color="white" fontSize="xl" fontWeight="bold">
          No testimonials yet
        </Text>

        <Text color="gray.500" mt={2}>
          Investor experiences will appear here once they are added.
        </Text>
      </Box>
    )}

    {/* TESTIMONIAL CARDS */}
    {!loading && testimonials.length > 0 && (
      <SimpleGrid
        columns={{
          base: 1,
          md: 2,
          lg: 3,
        }}
        spacing={6}
      >
        {testimonials.map((item, index) => (
          <Box
            key={item._id}
            as={motion.div}
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.45,
              delay: index * 0.06,
            }}
            whileHover={{
              y: -7,
            }}
            p={7}
            borderRadius="26px"
            bg="rgba(255,255,255,.045)"
            border={
              item.featured
                ? "1px solid rgba(245,158,11,.25)"
                : "1px solid rgba(255,255,255,.08)"
            }
            backdropFilter="blur(16px)"
            boxShadow="0 18px 45px rgba(0,0,0,.22)"
            position="relative"
            overflow="hidden"
          >
            {/* Featured Glow */}
            {item.featured && (
              <Box
                position="absolute"
                top="-60px"
                right="-60px"
                w="140px"
                h="140px"
                borderRadius="full"
                bg="orange.400"
                opacity={0.07}
                filter="blur(35px)"
              />
            )}

            <VStack
              align="stretch"
              spacing={5}
              position="relative"
            >
              <Flex
                justify="space-between"
                align="start"
              >
                <HStack spacing={3}>
                  <Avatar
                    name={item.name}
                    src={item.image}
                    size="md"
                    bg="orange.400"
                    color="black"
                  />

                  <Box>
                    <Text
                      color="white"
                      fontWeight="bold"
                      fontSize="md"
                    >
                      {item.name}
                    </Text>

                    <Text
                      color="gray.500"
                      fontSize="sm"
                    >
                      {item.country}
                    </Text>
                  </Box>
                </HStack>

                {item.featured && (
                  <Badge
                    colorScheme="orange"
                    borderRadius="full"
                    px={2.5}
                    py={1}
                    fontSize="xs"
                  >
                    Featured
                  </Badge>
                )}
              </Flex>

              {/* Stars */}
              <HStack spacing={1}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    size={17}
                    color={
                      star <= Number(item.rating)
                        ? "#f59e0b"
                        : "#4b5563"
                    }
                    fill={
                      star <= Number(item.rating)
                        ? "#f59e0b"
                        : "transparent"
                    }
                  />
                ))}

                <Text
                  color="gray.500"
                  fontSize="xs"
                  ml={2}
                >
                  {item.rating}/5
                </Text>
              </HStack>

              {/* Quote */}
              <Box>
                <Text
                  color="orange.300"
                  fontSize="4xl"
                  lineHeight="1"
                  fontWeight="bold"
                  mb={2}
                >
                  "
                </Text>

                <Text
                  color="gray.300"
                  lineHeight="1.9"
                  fontSize="sm"
                >
                  {item.message}
                </Text>
              </Box>

              <Divider borderColor="whiteAlpha.100" />

              <HStack
                color="green.300"
                fontSize="xs"
                fontWeight="medium"
              >
                <FiShield />

                <Text>
                  Verified community feedback
                </Text>
              </HStack>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    )}

    {/* FOOTER TRUST MESSAGE */}
    {!loading && testimonials.length > 0 && (
      <Box
        mt={12}
        p={7}
        textAlign="center"
        borderRadius="24px"
        bg="rgba(255,255,255,.03)"
        border="1px solid rgba(255,255,255,.07)"
      >
        <HStack justify="center" mb={3}>
          <FiShield color="#86efac" />
          <Text
            color="green.300"
            fontWeight="bold"
          >
            Built around a trusted investor community
          </Text>
        </HStack>

        <Text
          color="gray.500"
          fontSize="sm"
          maxW="650px"
          mx="auto"
          lineHeight="1.8"
        >
          Explore experiences shared by members of the BitcoinVault
          community. Testimonials are displayed through the platform's
          testimonial system.
        </Text>
      </Box>
    )}
  </Box>
</Box>


);
}

export default Testimonials;
