import { Box } from "@chakra-ui/layout";
import { useState } from "react";
import Chatbox from "../Chatbox";
import MyChats from "../MyChats";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
// import SideDrawer from "../miscellaneous/SideDrawer";
import { useContext , useEffect } from "react";
import { UserContext } from "../../../context/UserContext.jsx";
import { ChakraProvider } from "@chakra-ui/react";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const {
    islogin,
    setIslogin,
    selectedChat,
    setSelectedChat,
    user,
    setUser,
    notification,
    setNotification,
    chats,
    setChats,
  } = useContext(UserContext);

  const navigate=useNavigate();

  useEffect(() => {
    if (!islogin) {
      navigate("/login");
    }
  }, []);

  return (
    <ChakraProvider>
      <>
    <div style={{ width: "100%"}} className="setion">
      {/* {user && <SideDrawer />} */}

      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="81.5vh"
        p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (<Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />)}
      </Box>
    </div>
    </>
    </ChakraProvider>
  );
};

export default Chatpage;
