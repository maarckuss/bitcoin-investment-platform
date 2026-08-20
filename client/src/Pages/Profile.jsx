import { useEffect, useState } from "react";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  HStack,
  Avatar,
  Badge,
  Divider,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useToast,
} from "@chakra-ui/react";

import API from "../api/axios";


function Profile() {

  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const toast = useToast();


  useEffect(() => {
    fetchProfile();
  }, []);



  const fetchProfile = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await API.get("/profile", {
        headers:{
          Authorization:`Bearer ${token}`,
        },
      });


      setUser(res.data);
      setName(res.data.name || "");


    } catch(err){

      console.error(err);

    }

  };



  const updateProfile = async()=>{

    try{

      const token = localStorage.getItem("token");


      await API.patch(
        "/profile",
        {
          name,
          password,
        },
        {
          headers:{
            Authorization:`Bearer ${token}`,
          },
        }
      );


      toast({
        title:"Profile Updated",
        description:"Your account details have been updated.",
        status:"success",
        duration:3000,
        isClosable:true,
      });


      setPassword("");
      fetchProfile();


    }catch(err){

      toast({
        title:"Update Failed",
        description:
          err.response?.data?.message ||
          "Something went wrong",
        status:"error",
        duration:3000,
        isClosable:true,
      });

    }

  };



  const initials = (user.name || "?")
    .split(" ")
    .map(n=>n[0])
    .join("")
    .slice(0,2)
    .toUpperCase();



  return (

    <Box
      p={8}
      minH="100vh"
    >

      <Box
        maxW="950px"
        mx="auto"
      >


        {/* PROFILE HEADER */}

        <Box
          p={8}
          borderRadius="28px"
          bg="linear-gradient(
            145deg,
            rgba(255,255,255,0.08),
            rgba(255,255,255,0.03)
          )"
          border="1px solid rgba(255,255,255,0.12)"
          boxShadow="0 20px 40px rgba(0,0,0,0.35)"
          mb={8}
        >

          <HStack spacing={6}>


            <Avatar
              size="2xl"
              name={user.name}
              bg="orange.400"
              color="black"
              border="4px solid rgba(251,146,60,0.5)"
            >
              {initials}
            </Avatar>



            <Box>


              <Text
                fontSize="3xl"
                fontWeight="bold"
                color="white"
              >
                {user.name}
              </Text>


              <Text
                color="gray.400"
              >
                {user.email}
              </Text>



              <HStack mt={4}>


                <Badge
                  px={3}
                  py={1}
                  borderRadius="full"
                  colorScheme={
                    user.role==="admin"
                    ? "orange"
                    : "green"
                  }
                >
                  {user.role || "user"}
                </Badge>



                <Badge
                  px={3}
                  py={1}
                  borderRadius="full"
                  colorScheme={
                    user.blocked
                    ? "red"
                    : "green"
                  }
                >
                  {
                    user.blocked
                    ? "Blocked"
                    : "Active"
                  }
                </Badge>


              </HStack>



              <Text
                mt={4}
                fontSize="sm"
                color="gray.500"
              >

                Member since{" "}
                {
                  user.createdAt
                  ? new Date(user.createdAt)
                    .toLocaleDateString()
                  : "--"
                }

              </Text>


            </Box>


          </HStack>


        </Box>





        {/* STATS */}


        <SimpleGrid
          columns={{
            base:1,
            md:2,
          }}
          spacing={6}
          mb={8}
        >


          <Stat

            p={6}

            borderRadius="22px"

            bg="rgba(255,255,255,0.04)"

            border="1px solid rgba(255,255,255,0.08)"

          >

            <StatLabel
              color="gray.400"
            >
              Available Balance
            </StatLabel>


            <StatNumber
              color="green.300"
              fontSize="3xl"
            >
              ${user.balance || 0}
            </StatNumber>


          </Stat>




          <Stat

            p={6}

            borderRadius="22px"

            bg="rgba(255,255,255,0.04)"

            border="1px solid rgba(255,255,255,0.08)"

          >

            <StatLabel color="gray.400">
              Account Type
            </StatLabel>


            <StatNumber
              color="orange.300"
              fontSize="2xl"
              textTransform="capitalize"
            >
              {user.role || "user"}
            </StatNumber>


          </Stat>


        </SimpleGrid>





        {/* DETAILS */}



        <Box

          p={8}

          borderRadius="24px"

          bg="rgba(255,255,255,0.04)"

          border="1px solid rgba(255,255,255,0.08)"

        >


          <Text
            fontSize="2xl"
            color="white"
            fontWeight="bold"
            mb={6}
          >
            Account Settings
          </Text>



          <VStack
            spacing={5}
          >


            <FormControl>

              <FormLabel color="gray.300">
                Full Name
              </FormLabel>


              <Input

                value={name}

                onChange={(e)=>setName(e.target.value)}

                color="white"

                bg="rgba(255,255,255,0.05)"

              />


            </FormControl>




            <FormControl>

              <FormLabel color="gray.300">
                Email Address
              </FormLabel>


              <Input

                value={user.email || ""}

                isReadOnly

                color="gray.400"

                bg="rgba(255,255,255,0.05)"

              />


            </FormControl>




            <Divider />




            <Text
              alignSelf="start"
              color="white"
              fontWeight="bold"
            >
              Security
            </Text>



            <FormControl>

              <FormLabel color="gray.300">
                Change Password
              </FormLabel>


              <Input

                type="password"

                value={password}

                onChange={(e)=>setPassword(e.target.value)}

                color="white"

                bg="rgba(255,255,255,0.05)"

              />


            </FormControl>




            <Button

              w="full"

              size="lg"

              bg="orange.400"

              color="black"

              fontWeight="bold"

              _hover={{
                bg:"orange.300",
                transform:"scale(1.02)",
              }}

              onClick={updateProfile}

            >

              Save Changes

            </Button>


          </VStack>


        </Box>


      </Box>


    </Box>

  );

}


export default Profile;