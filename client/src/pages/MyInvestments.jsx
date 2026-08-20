import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  Box,
  Text,
  SimpleGrid,
  Spinner,
  Button,
  VStack,
  HStack,
} from "@chakra-ui/react";

import API from "../api/axios";

function MyInvestments() {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get("/my-investments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setInvestments(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, []);

  if (loading) {
    return (
      <Box
        minH="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <VStack spacing={4}>
          <Spinner size="xl" color="orange.400" />

          <Text color="gray.400">
            Loading your investments...
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box p={8} minH="100vh" bg="transparent">
      <Box maxW="1200px" mx="auto">

        <Text
          fontSize="3xl"
          fontWeight="bold"
          color="white"
          mb={2}
        >
          My Investments
        </Text>

        <Text color="gray.400" mb={8}>
          Monitor your portfolio growth and investment performance.
        </Text>


        {investments.length === 0 && (
          <Box
            p={10}
            borderRadius="28px"
            bg="linear-gradient(
              145deg,
              rgba(255,255,255,0.08),
              rgba(255,255,255,0.03)
            )"
            border="1px solid rgba(255,255,255,0.1)"
            textAlign="center"
            color="white"
          >
            <Text fontSize="5xl" mb={4}>
              📊
            </Text>

            <Text
              fontSize="2xl"
              fontWeight="bold"
              mb={3}
            >
              No Investments Yet
            </Text>

            <Text
              color="gray.400"
              mb={6}
            >
              Start investing in a plan and your portfolio activity will appear here.
            </Text>

            <Button
              bg="orange.400"
              color="black"
              fontWeight="bold"
              _hover={{
                bg:"orange.300",
              }}
              onClick={() =>
                (window.location.href = "/investments")
              }
            >
              Explore Plans
            </Button>
          </Box>
        )}


        <SimpleGrid
          columns={{
            base:1,
            md:2,
            lg:3,
          }}
          spacing={6}
        >

          {investments.map((investment,index)=>{

            const profit =
              Number(investment.expectedReturn) -
              Number(investment.amount);


            return (

              <Box
                key={investment._id}
                as={motion.div}
                initial={{
                  opacity:0,
                  y:30,
                }}
                animate={{
                  opacity:1,
                  y:0,
                }}
                transition={{
                  duration:0.4,
                  delay:index * 0.1,
                }}
                whileHover={{
                  y:-8,
                }}
              >

                <Box
                  p={7}
                  borderRadius="26px"
                  bg="linear-gradient(
                    145deg,
                    rgba(255,255,255,0.09),
                    rgba(255,255,255,0.03)
                  )"
                  border="1px solid rgba(255,255,255,0.12)"
                  boxShadow="0 15px 35px rgba(0,0,0,0.35)"
                  color="white"
                >

                  <HStack
                    justify="space-between"
                    mb={5}
                  >

                    <Text
                      fontSize="2xl"
                      fontWeight="bold"
                    >
                      {investment.planId?.name}
                    </Text>


                    <Box
                      px={3}
                      py={1}
                      borderRadius="full"
                      bg={
                        investment.status === "active"
                        ? "green.400"
                        : "gray.400"
                      }
                    >

                      <Text
                        fontSize="xs"
                        color="black"
                        fontWeight="bold"
                        textTransform="uppercase"
                      >
                        {investment.status}
                      </Text>

                    </Box>

                  </HStack>



                  <Box
                    p={5}
                    borderRadius="18px"
                    bg="rgba(34,197,94,0.12)"
                    border="1px solid rgba(34,197,94,0.25)"
                    mb={5}
                  >

                    <Text
                      fontSize="sm"
                      color="gray.300"
                    >
                      Expected Return
                    </Text>

                    <Text
                      fontSize="4xl"
                      fontWeight="bold"
                      color="green.300"
                    >
                      ${investment.expectedReturn}
                    </Text>

                  </Box>



                  <VStack
                    align="stretch"
                    spacing={3}
                    mb={6}
                  >

                    <Text color="gray.300">
                      💰 Invested Amount:
                      <b> ${investment.amount}</b>
                    </Text>


                    <Text color="gray.300">
                      📈 ROI:
                      <b>
                        {" "}
                        {investment.planId?.roi || 0}%
                      </b>
                    </Text>


                    <Text color="gray.300">
                      💵 Estimated Profit:
                      <b>
                        {" "}
                        ${profit.toFixed(2)}
                      </b>
                    </Text>


                    <Text color="gray.300">
                      ⏳ Duration:
                      <b>
                        {" "}
                        {investment.planId?.duration || 0} days
                      </b>
                    </Text>


                  </VStack>




                  <Box
                    p={4}
                    borderRadius="16px"
                    bg="rgba(255,255,255,0.04)"
                    border="1px solid rgba(255,255,255,0.08)"
                  >

                    <Text
                      fontSize="sm"
                      color="gray.400"
                    >
                      Investment Timeline
                    </Text>


                    <Text
                      fontSize="sm"
                      color="gray.300"
                      mt={2}
                    >
                      Started:
                      {" "}
                      {new Date(
                        investment.startDate
                      ).toLocaleDateString()}
                    </Text>


                    <Text
                      fontSize="sm"
                      color="gray.300"
                    >
                      Maturity:
                      {" "}
                      {new Date(
                        investment.endDate
                      ).toLocaleDateString()}
                    </Text>


                  </Box>


                </Box>

              </Box>

            );

          })}

        </SimpleGrid>

      </Box>
    </Box>
  );
}

export default MyInvestments;