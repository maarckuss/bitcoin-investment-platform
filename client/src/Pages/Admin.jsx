import { useEffect, useState } from "react";
import {
  Box,
  Text,
  SimpleGrid,
  Button,
  VStack,
} from "@chakra-ui/react";

import {
  FiUsers,
  FiDownload,
  FiUpload,
  FiTrendingUp,
  FiFileText,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";
import API from "../api/axios";


function Admin() {

  const navigate = useNavigate();

  const [stats,setStats] = useState({
    users:0,
    deposits:0,
    withdrawals:0,
    pendingDeposits:0,
    pendingWithdrawals:0,
  });



  const fetchStats = async()=>{

    try{

      const token = localStorage.getItem("token");


      const users = await API.get("/users",{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });


      const transactions = await API.get(
        "/admin/transactions",
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );


      const deposits = transactions.data.deposits || [];
      const withdrawals = transactions.data.withdrawals || [];


      setStats({

        users:users.data.length,

        deposits:
        deposits.filter(
          d=>d.status==="approved"
        ).length,


        withdrawals:
        withdrawals.filter(
          w=>w.status==="approved"
        ).length,


        pendingDeposits:
        deposits.filter(
          d=>d.status==="pending"
        ).length,


        pendingWithdrawals:
        withdrawals.filter(
          w=>w.status==="pending"
        ).length,


      });


    }catch(err){

      console.log(err);

    }

  };



  useEffect(()=>{

    fetchStats();

  },[]);





  const cards=[

    {
      title:"Total Users",
      value:stats.users,
      icon:<FiUsers/>
    },

    {
      title:"Approved Deposits",
      value:stats.deposits,
      icon:<FiDownload/>
    },

    {
      title:"Approved Withdrawals",
      value:stats.withdrawals,
      icon:<FiUpload/>
    },

    {
      title:"Pending Deposits",
      value:stats.pendingDeposits,
      icon:<FiTrendingUp/>
    },

    {
      title:"Pending Withdrawals",
      value:stats.pendingWithdrawals,
      icon:<FiFileText/>
    },

  ];





return (

<Box
p={8}
minH="100vh"
>


<Text
fontSize="3xl"
fontWeight="bold"
mb={8}
>
Admin Dashboard
</Text>



<SimpleGrid
columns={{
base:1,
md:2,
lg:5
}}
spacing={6}
>



{
cards.map((card,index)=>(


<Box
key={index}
p={6}
borderRadius="20px"
bg="rgba(255,255,255,0.04)"
border="1px solid rgba(255,255,255,0.08)"
color="white"
>


<Box
fontSize="2xl"
mb={3}
color="orange.300"
>
{card.icon}
</Box>


<Text
color="gray.400"
fontSize="sm"
>
{card.title}
</Text>


<Text
fontSize="3xl"
fontWeight="bold"
>
{card.value}
</Text>


</Box>


))

}


</SimpleGrid>





<Box
mt={10}
p={6}
borderRadius="20px"
bg="rgba(255,255,255,0.04)"
border="1px solid rgba(255,255,255,0.08)"
>


<Text
fontSize="xl"
fontWeight="bold"
mb={5}
>
Quick Management
</Text>



<VStack
align="stretch"
spacing={4}
>


<Button
leftIcon={<FiUsers/>}
colorScheme="purple"
onClick={()=>
navigate("/admin/users")
}
>
Manage Users
</Button>



<Button
leftIcon={<FiDownload/>}
colorScheme="green"
onClick={()=>
navigate("/admin/deposits")
}
>
Review Deposits
</Button>



<Button
leftIcon={<FiUpload/>}
colorScheme="red"
onClick={()=>
navigate("/admin/withdrawals")
}
>
Review Withdrawals
</Button>



<Button
leftIcon={<FiTrendingUp/>}
colorScheme="blue"
onClick={()=>
navigate("/admin/investments")
}
>
Manage Investments
</Button>



<Button
leftIcon={<FiFileText/>}
colorScheme="orange"
onClick={()=>
navigate("/admin/logs")
}
>
View Activity Logs
</Button>


</VStack>


</Box>



</Box>

);


}


export default Admin;