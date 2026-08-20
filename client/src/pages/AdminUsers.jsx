import { useEffect, useState } from "react";
import {
  Box,
  Text,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import API from "../api/axios";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("credit");

  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();


  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(res.data);

    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, []);



  const toggleBlockUser = async (id, status) => {
    try {

      const token = localStorage.getItem("token");

      await API.patch(
        `/users/${id}/block`,
        {
          blocked: !status,
        },
        {
          headers:{
            Authorization:`Bearer ${token}`,
          }
        }
      );

      fetchUsers();

    } catch(err){
      console.log(err);
    }
  };



  const updateRole = async (id, role) => {
    try {

      const token = localStorage.getItem("token");

      await API.patch(
        `/users/${id}/role`,
        {
          role,
        },
        {
          headers:{
            Authorization:`Bearer ${token}`,
          }
        }
      );

      fetchUsers();

    } catch(err){
      console.log(err);
    }
  };



  const updateBalance = async () => {

    if(!amount || isNaN(amount)){
      return;
    }

    try{

      const token = localStorage.getItem("token");

      await API.patch(
        `/users/${selectedUser}/balance`,
        {
          amount:
            mode === "credit"
              ? Number(amount)
              : -Number(amount),
        },
        {
          headers:{
            Authorization:`Bearer ${token}`,
          }
        }
      );


      toast({
        title:"Balance Updated",
        status:"success",
        duration:3000,
      });


      setAmount("");
      onClose();
      fetchUsers();


    }catch(err){
      console.log(err);
    }
  };



  const openBalanceModal = (id, type)=>{
    setSelectedUser(id);
    setMode(type);
    setAmount("");
    onOpen();
  };



  const filteredUsers = users.filter(
    (user)=>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );



return (

<Box p={8}>

<Text
fontSize="3xl"
fontWeight="bold"
mb={6}
>
Users Management
</Text>


<Input
placeholder="Search users..."
mb={6}
value={search}
onChange={(e)=>setSearch(e.target.value)}
bg="rgba(255,255,255,0.05)"
color="white"
/>



<Box
bg="rgba(255,255,255,0.04)"
borderRadius="20px"
overflowX="auto"
>


<Table color="white">

<Thead>

<Tr>

<Th color="gray.400">Name</Th>
<Th color="gray.400">Email</Th>
<Th color="gray.400">Balance</Th>
<Th color="gray.400">Role</Th>
<Th color="gray.400">Actions</Th>

</Tr>

</Thead>



<Tbody>

{filteredUsers.map((user)=>(

<Tr key={user._id}>

<Td>{user.name}</Td>

<Td>{user.email}</Td>

<Td>
${user.balance}
</Td>


<Td>
{user.role}
</Td>



<Td>


<Button
size="sm"
colorScheme="green"
mr={2}
onClick={()=>
openBalanceModal(user._id,"credit")
}
>
Credit
</Button>


<Button
size="sm"
colorScheme="red"
mr={2}
onClick={()=>
openBalanceModal(user._id,"debit")
}
>
Debit
</Button>



<Button
size="sm"
colorScheme="purple"
mr={2}
onClick={()=>
updateRole(
user._id,
user.role==="user"
?"admin"
:"user"
)
}
>
{
user.role==="user"
?"Make Admin"
:"Remove Admin"
}

</Button>



<Button
size="sm"
colorScheme={
user.blocked
?"green"
:"orange"
}
onClick={()=>
toggleBlockUser(
user._id,
user.blocked
)
}
>

{
user.blocked
?"Unblock"
:"Block"
}

</Button>



</Td>


</Tr>

))}


</Tbody>


</Table>


</Box>


<Modal
isOpen={isOpen}
onClose={onClose}
isCentered
>

<ModalOverlay/>

<ModalContent
bg="#111827"
color="white"
>

<ModalHeader>
{
mode==="credit"
?"Credit User"
:"Debit User"
}
</ModalHeader>


<ModalCloseButton/>


<ModalBody>

<Input
placeholder="Amount"
value={amount}
onChange={(e)=>setAmount(e.target.value)}
/>


</ModalBody>


<ModalFooter>

<Button
onClick={onClose}
mr={3}
>
Cancel
</Button>


<Button
colorScheme={
mode==="credit"
?"green"
:"red"
}
onClick={updateBalance}
>
Confirm
</Button>


</ModalFooter>


</ModalContent>

</Modal>


</Box>

)

}

export default AdminUsers;