import { Box } from "@chakra-ui/layout";
import "../../assets/styles/chat.css";
import SingleChat from "./SingleChat";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext.jsx";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const {
    selectedChat,
  } = useContext(UserContext);

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;

