import { useEffect, useState } from "react";
import {
  Box,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";

import API from "../api/axios";


function AdminDeposits() {

  const [deposits, setDeposits] = useState([]);
  const [loadingId, setLoadingId] = useState(null);



  const fetchDeposits = async () => {

    try {

      const token = localStorage.getItem("token");


      const res = await API.get("/admin/transactions", {
        headers:{
          Authorization:`Bearer ${token}`,
        },
      });


      setDeposits(res.data.deposits);


    } catch(err){

      console.log(err);

    }

  };



  useEffect(()=>{
    fetchDeposits();
  },[]);





  const approveDeposit = async(id)=>{

    try{

      setLoadingId(id);

      const token = localStorage.getItem("token");


      await API.patch(
        `/deposits/${id}/approve`,
        {},
        {
          headers:{
            Authorization:`Bearer ${token}`,
          },
        }
      );


      fetchDeposits();


    }catch(err){

      console.log(err);

    }finally{

      setLoadingId(null);

    }

  };





  const rejectDeposit = async(id)=>{

    try{


      const token = localStorage.getItem("token");


      await API.patch(
        `/deposits/${id}/reject`,
        {},
        {
          headers:{
            Authorization:`Bearer ${token}`,
          },
        }
      );


      fetchDeposits();



    }catch(err){

      console.log(err);

    }

  };





return (

<Box p={8}>


<Text
fontSize="3xl"
fontWeight="bold"
mb={6}
>
Bitcoin Deposits
</Text>



<Box
bg="rgba(255,255,255,0.04)"
border="1px solid rgba(255,255,255,0.08)"
borderRadius="20px"
overflowX="auto"
>



<Table color="white">


<Thead
bg="rgba(255,255,255,0.05)"
>

<Tr>

<Th color="gray.400">
User
</Th>

<Th color="gray.400">
Coin
</Th>

<Th color="gray.400">
Amount
</Th>


<Th color="gray.400">
Status
</Th>


<Th color="gray.400">
Action
</Th>


</Tr>


</Thead>



<Tbody>


{
deposits.map((deposit)=>(

<Tr key={deposit._id}>


<Td>
{deposit.userId}
</Td>


<Td>
₿ BTC
</Td>



<Td
color="green.400"
fontWeight="bold"
>
+{deposit.amount}
</Td>



<Td>

<Text
color={
deposit.status==="approved"
?"green.400"
:
deposit.status==="rejected"
?"red.400"
:
"orange.400"
}
fontWeight="bold"
textTransform="capitalize"
>

{deposit.status}

</Text>


</Td>




<Td>

{
deposit.status==="pending" && (

<>

<Button
size="sm"
colorScheme="green"
mr={2}
isLoading={loadingId===deposit._id}
onClick={()=>
approveDeposit(deposit._id)
}
>
Approve
</Button>



<Button
size="sm"
colorScheme="red"
onClick={()=>
rejectDeposit(deposit._id)
}
>
Reject
</Button>


</>

)

}


</Td>


</Tr>


))

}



</Tbody>



</Table>



</Box>



</Box>

);


}


export default AdminDeposits;