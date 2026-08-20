import { useState } from "react";

import { Box, Text, Input, Button, VStack, useToast } from "@chakra-ui/react";

import API from "../api/axios";

function AdminPlans() {
  const toast = useToast();

  const [form, setForm] = useState({
    name: "",
    minimumAmount: "",
    roi: "",
    duration: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createPlan = async () => {
    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/admin/plans",
        {
          ...form,
          minimumAmount: Number(form.minimumAmount),
          roi: Number(form.roi),
          duration: Number(form.duration),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast({
        title: "Plan created",
        status: "success",
        duration: 3000,
      });

      setForm({
        name: "",
        minimumAmount: "",
        roi: "",
        duration: "",
        description: "",
      });
    } catch (err) {
      toast({
        title: "Failed creating plan",
        description: err.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Box p={8} minH="100vh">
      <Text fontSize="3xl" fontWeight="bold" color="white" mb={6}>
        Create Investment Plan
      </Text>

      <Box
        maxW="500px"
        bg="rgba(255,255,255,0.04)"
        border="1px solid rgba(255,255,255,0.08)"
        p={6}
        borderRadius="20px"
      >
        <VStack spacing={4}>
          <Input
            name="name"
            placeholder="Plan name"
            value={form.name}
            onChange={handleChange}
          />

          <Input
            name="minimumAmount"
            placeholder="Minimum amount"
            value={form.minimumAmount}
            onChange={handleChange}
          />

          <Input
            name="roi"
            placeholder="ROI percentage"
            value={form.roi}
            onChange={handleChange}
          />

          <Input
            name="duration"
            placeholder="Duration days"
            value={form.duration}
            onChange={handleChange}
          />

          <Input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />

          <Button colorScheme="blue" width="100%" onClick={createPlan}>
            Create Plan
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}

export default AdminPlans;
