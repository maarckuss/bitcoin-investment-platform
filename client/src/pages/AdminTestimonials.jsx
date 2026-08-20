import { useEffect, useState } from "react";
import {
  Box,
  Text,
  Input,
  Textarea,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Badge,
  useToast,
} from "@chakra-ui/react";

import API from "../api/axios";

function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);

  const [form, setForm] = useState({
    name: "",
    country: "",
    message: "",
    rating: 5,
  });

  const toast = useToast();

  useEffect(() => {
    fetchTestimonials();
  }, []);


  const fetchTestimonials = async () => {
    try {
      const res = await API.get("/testimonials");
      setTestimonials(res.data);
    } catch (err) {
      console.log(err);
    }
  };


  const createTestimonial = async () => {
    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/admin/testimonials",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      toast({
        title: "Testimonial Added",
        status: "success",
        duration: 3000,
        isClosable: true,
      });


      setForm({
        name: "",
        country: "",
        message: "",
        rating: 5,
      });


      fetchTestimonials();

    } catch (err) {
      toast({
        title: "Failed",
        description:
          err.response?.data?.message || "Something went wrong",
        status: "error",
      });
    }
  };


  const deleteTestimonial = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(
        `/admin/testimonials/${id}`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      fetchTestimonials();

    } catch(err){
      console.log(err);
    }
  };


  const toggleFeature = async(id)=>{
    try{
      const token = localStorage.getItem("token");

      await API.patch(
        `/admin/testimonials/${id}/feature`,
        {},
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      fetchTestimonials();

    }catch(err){
      console.log(err);
    }
  };


  return (
    <Box p={8}>

      <Text
        fontSize="3xl"
        fontWeight="bold"
        color="white"
        mb={8}
      >
        Manage Testimonials
      </Text>


      {/* CREATE FORM */}

      <Box
        p={6}
        mb={10}
        borderRadius="20px"
        bg="rgba(255,255,255,.05)"
        border="1px solid rgba(255,255,255,.08)"
      >

        <VStack spacing={4}>

          <Input
            placeholder="Customer Name"
            color="white"
            value={form.name}
            onChange={(e)=>
              setForm({...form,name:e.target.value})
            }
          />


          <Input
            placeholder="Country"
            color="white"
            value={form.country}
            onChange={(e)=>
              setForm({...form,country:e.target.value})
            }
          />


          <Textarea
            placeholder="Testimonial message"
            color="white"
            value={form.message}
            onChange={(e)=>
              setForm({...form,message:e.target.value})
            }
          />


          <Input
            type="number"
            min="1"
            max="5"
            placeholder="Rating"
            color="white"
            value={form.rating}
            onChange={(e)=>
              setForm({...form,rating:e.target.value})
            }
          />


          <Button
            w="full"
            bg="orange.400"
            color="black"
            onClick={createTestimonial}
          >
            Add Testimonial
          </Button>

        </VStack>

      </Box>


      {/* EXISTING TESTIMONIALS */}

      <SimpleGrid
        columns={{base:1,md:2}}
        spacing={6}
      >

      {testimonials.map((item)=>(

        <Box
          key={item._id}
          p={6}
          borderRadius="20px"
          bg="rgba(255,255,255,.05)"
          border="1px solid rgba(255,255,255,.08)"
        >

          <Text color="white" fontWeight="bold">
            {item.name}
          </Text>

          <Text color="gray.400">
            {item.country}
          </Text>


          <Text color="yellow.400" mt={2}>
            {"⭐".repeat(item.rating)}
          </Text>


          <Text color="gray.300" mt={3}>
            {item.message}
          </Text>


          <HStack mt={5}>

            <Button
              size="sm"
              onClick={()=>toggleFeature(item._id)}
            >
              {item.featured ? "Remove Feature":"Feature"}
            </Button>


            <Button
              size="sm"
              colorScheme="red"
              onClick={()=>deleteTestimonial(item._id)}
            >
              Delete
            </Button>

          </HStack>


          {item.featured &&
            <Badge mt={3} colorScheme="orange">
              Featured
            </Badge>
          }

        </Box>

      ))}

      </SimpleGrid>

    </Box>
  );
}

export default AdminTestimonials;