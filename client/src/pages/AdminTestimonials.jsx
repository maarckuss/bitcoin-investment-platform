import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Spinner,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  FiCheck,
  FiMessageSquare,
  FiStar,
  FiTrash2,
} from "react-icons/fi";
import API from "../api/axios";

function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionId, setActionId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    country: "",
    message: "",
    rating: 5,
  });

  const toast = useToast();

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

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const createTestimonial = async () => {
    const rating = Number(form.rating);

    if (!form.name.trim() || !form.country.trim() || !form.message.trim()) {
      toast({
        title: "Complete all fields",
        description: "Name, country, and testimonial message are required.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (rating < 1 || rating > 5) {
      toast({
        title: "Invalid rating",
        description: "Rating must be between 1 and 5.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");

      await API.post(
        "/admin/testimonials",
        {
          ...form,
          name: form.name.trim(),
          country: form.country.trim(),
          message: form.message.trim(),
          rating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast({
        title: "Testimonial added",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      setForm({
        name: "",
        country: "",
        message: "",
        rating: 5,
      });

      await fetchTestimonials();
    } catch (err) {
      toast({
        title: "Unable to add testimonial",
        description:
          err.response?.data?.message ||
          "Something went wrong.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const deleteTestimonial = async (id) => {
    try {
      setActionId(id);

      const token = localStorage.getItem("token");

      await API.delete(`/admin/testimonials/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchTestimonials();

      toast({
        title: "Testimonial deleted",
        status: "success",
        duration: 2500,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      toast({
        title: "Delete failed",
        description:
          err.response?.data?.message ||
          "Unable to delete testimonial.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setActionId(null);
    }
  };

  const toggleFeature = async (id) => {
    try {
      setActionId(id);

      const token = localStorage.getItem("token");

      await API.patch(
        `/admin/testimonials/${id}/feature`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await fetchTestimonials();

      toast({
        title: "Featured status updated",
        status: "success",
        duration: 2500,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      toast({
        title: "Action failed",
        description:
          err.response?.data?.message ||
          "Unable to update featured status.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
    return (
      <Flex
        minH="calc(100vh - 96px)"
        align="center"
        justify="center"
        bg="#0b1220"
      >
        <VStack spacing={4}>
          <Spinner
            size="lg"
            thickness="3px"
            color="orange.300"
            emptyColor="whiteAlpha.200"
          />
          <Text color="gray.500" fontSize="sm">
            Loading testimonials...
          </Text>
        </VStack>
      </Flex>
    );
  }

  return (
    <Box
      minH="calc(100vh - 96px)"
      bg="#0b1220"
      px={{ base: 4, sm: 5, md: 6, lg: 8 }}
      py={{ base: 5, md: 7, lg: 8 }}
      overflowX="hidden"
    >
      <Box maxW="1280px" mx="auto" w="100%">
        <Box mb={{ base: 5, md: 7 }}>
          <Flex align="center" gap={3}>
            <Flex
              align="center"
              justify="center"
              w="44px"
              h="44px"
              flexShrink={0}
              borderRadius="13px"
              bg="rgba(245,158,11,0.10)"
              color="orange.300"
            >
              <FiMessageSquare size={20} />
            </Flex>

            <Box>
              <Text
                fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
                fontWeight="800"
                color="white"
                letterSpacing="-0.03em"
              >
                Testimonials
              </Text>

              <Text
                mt={1}
                fontSize={{ base: "sm", md: "md" }}
                color="gray.500"
              >
                Create, feature, and manage customer testimonials.
              </Text>
            </Box>
          </Flex>
        </Box>

        <Box
          p={{ base: 4, sm: 5, md: 6 }}
          mb={{ base: 5, md: 7 }}
          border="1px solid"
          borderColor="whiteAlpha.100"
          borderRadius={{ base: "18px", md: "22px" }}
          bg="rgba(255,255,255,0.035)"
          backdropFilter="blur(14px)"
          boxShadow="0 16px 42px rgba(0,0,0,0.16)"
        >
          <Flex
            align="center"
            gap={3}
            mb={5}
          >
            <Flex
              align="center"
              justify="center"
              w="40px"
              h="40px"
              borderRadius="12px"
              bg="whiteAlpha.100"
              color="orange.300"
            >
              <FiStar size={18} />
            </Flex>

            <Box>
              <Text fontSize="md" fontWeight="700" color="white">
                Add testimonial
              </Text>

              <Text mt={1} fontSize="xs" color="gray.500">
                Publish a new customer testimonial.
              </Text>
            </Box>
          </Flex>

          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            spacing={4}
          >
            <FormControl>
              <FormLabel fontSize="sm" color="gray.300">
                Customer name
              </FormLabel>

              <Input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Customer name"
                h="50px"
                color="white"
                bg="whiteAlpha.50"
                borderColor="whiteAlpha.100"
                borderRadius="12px"
                _placeholder={{ color: "gray.600" }}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm" color="gray.300">
                Country
              </FormLabel>

              <Input
                value={form.country}
                onChange={(e) =>
                  handleChange("country", e.target.value)
                }
                placeholder="Country"
                h="50px"
                color="white"
                bg="whiteAlpha.50"
                borderColor="whiteAlpha.100"
                borderRadius="12px"
                _placeholder={{ color: "gray.600" }}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm" color="gray.300">
                Rating
              </FormLabel>

              <Input
                type="number"
                min="1"
                max="5"
                value={form.rating}
                onChange={(e) =>
                  handleChange("rating", e.target.value)
                }
                h="50px"
                color="white"
                bg="whiteAlpha.50"
                borderColor="whiteAlpha.100"
                borderRadius="12px"
              />
            </FormControl>

            <FormControl gridColumn={{ base: "auto", md: "1 / -1" }}>
              <FormLabel fontSize="sm" color="gray.300">
                Message
              </FormLabel>

              <Textarea
                value={form.message}
                onChange={(e) =>
                  handleChange("message", e.target.value)
                }
                placeholder="Write the testimonial..."
                minH="120px"
                resize="vertical"
                color="white"
                bg="whiteAlpha.50"
                borderColor="whiteAlpha.100"
                borderRadius="12px"
                _placeholder={{ color: "gray.600" }}
              />
            </FormControl>
          </SimpleGrid>

          <Button
            mt={4}
            w={{ base: "100%", sm: "auto" }}
            h="50px"
            px={6}
            bg="orange.400"
            color="gray.950"
            fontWeight="700"
            isLoading={submitting}
            loadingText="Adding..."
            onClick={createTestimonial}
            _hover={{
              bg: "orange.300",
              transform: "translateY(-1px)",
            }}
          >
            Add testimonial
          </Button>
        </Box>

        {testimonials.length === 0 ? (
          <Box
            p={{ base: 8, md: 10 }}
            border="1px solid"
            borderColor="whiteAlpha.100"
            borderRadius={{ base: "18px", md: "22px" }}
            bg="rgba(255,255,255,0.035)"
            textAlign="center"
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
              fontWeight="700"
              color="white"
            >
              No testimonials yet
            </Text>

            <Text
              mt={2}
              fontSize="sm"
              color="gray.600"
            >
              Add the first testimonial using the form above.
            </Text>
          </Box>
        ) : (
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            spacing={{ base: 4, md: 5 }}
          >
            {testimonials.map((item) => (
              <Box
                key={item._id}
                p={{ base: 4, md: 5 }}
                border="1px solid"
                borderColor={
                  item.featured
                    ? "rgba(245,158,11,0.18)"
                    : "whiteAlpha.100"
                }
                borderRadius={{ base: "16px", md: "18px" }}
                bg={
                  item.featured
                    ? "rgba(245,158,11,0.05)"
                    : "rgba(255,255,255,0.035)"
                }
              >
                <Flex
                  align="flex-start"
                  justify="space-between"
                  gap={3}
                >
                  <Box minW="0">
                    <Text
                      fontSize="md"
                      fontWeight="700"
                      color="white"
                      noOfLines={1}
                    >
                      {item.name}
                    </Text>

                    <Text
                      mt={1}
                      fontSize="xs"
                      color="gray.600"
                    >
                      {item.country}
                    </Text>
                  </Box>

                  {item.featured && (
                    <Badge
                      colorScheme="orange"
                      variant="subtle"
                      borderRadius="full"
                      px={2.5}
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
                  mt={4}
                  color="orange.300"
                >
                  {Array.from({
                    length: Number(item.rating) || 0,
                  }).map((_, index) => (
                    <FiStar
                      key={index}
                      size={14}
                      fill="currentColor"
                    />
                  ))}
                </Flex>

                <Text
                  mt={4}
                  fontSize="sm"
                  color="gray.400"
                  lineHeight="1.8"
                >
                  “{item.message}”
                </Text>

                <Flex
                  gap={2}
                  mt={5}
                  direction={{ base: "column", sm: "row" }}
                >
                  <Button
                    flex="1"
                    size="sm"
                    colorScheme="orange"
                    variant={item.featured ? "solid" : "outline"}
                    leftIcon={
                      item.featured ? (
                        <FiCheck />
                      ) : (
                        <FiStar />
                      )
                    }
                    isLoading={actionId === item._id}
                    onClick={() => toggleFeature(item._id)}
                  >
                    {item.featured
                      ? "Featured"
                      : "Feature"}
                  </Button>

                  <Button
                    flex="1"
                    size="sm"
                    colorScheme="red"
                    variant="outline"
                    leftIcon={<FiTrash2 />}
                    isLoading={actionId === item._id}
                    onClick={() =>
                      deleteTestimonial(item._id)
                    }
                  >
                    Delete
                  </Button>
                </Flex>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Box>
    </Box>
  );
}

export default AdminTestimonials;