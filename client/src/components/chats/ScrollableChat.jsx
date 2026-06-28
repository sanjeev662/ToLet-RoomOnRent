import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext.jsx";

const ScrollableChat = ({ messages }) => {
  const { user } = useContext(UserContext);

  if (!user) return null;

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => {
          const isOwn = m.sender._id === user._id;
          const prevSame = i > 0 && messages[i - 1].sender._id === m.sender._id;
          const nextSame =
            i < messages.length - 1 &&
            messages[i + 1].sender._id === m.sender._id;
          const showAvatar = !isOwn && !nextSame;

          return (
            <div
              key={m._id}
              style={{
                display: "flex",
                justifyContent: isOwn ? "flex-end" : "flex-start",
                alignItems: "flex-end",
                marginTop: prevSame ? "2px" : "10px",
              }}
            >
              {/* avatar placeholder to keep bubble indented even when avatar hidden */}
              {!isOwn && (
                showAvatar ? (
                  <Tooltip
                    label={m.sender.username}
                    placement="bottom-start"
                    hasArrow
                  >
                    <Avatar
                      mr={1}
                      size="sm"
                      cursor="pointer"
                      name={m.sender.username}
                      src={m.sender.pic}
                      flexShrink={0}
                    />
                  </Tooltip>
                ) : (
                  <span style={{ width: "32px", flexShrink: 0 }} />
                )
              )}

              <span
                style={{
                  backgroundColor: isOwn ? "#BEE3F8" : "#B9F5D0",
                  borderRadius: isOwn
                    ? "18px 18px 4px 18px"
                    : "18px 18px 18px 4px",
                  padding: "8px 14px",
                  maxWidth: "70%",
                  wordBreak: "break-word",
                  marginLeft: isOwn ? "0" : "6px",
                  marginRight: isOwn ? "6px" : "0",
                }}
              >
                {m.content}
              </span>
            </div>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
