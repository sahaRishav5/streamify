import React, { useEffect, useState } from "react";
import { useChannelStateContext, useChatContext, Avatar } from "stream-chat-react";
import useAuthUser from "../hooks/useAuthUser";
import { useParams } from "react-router";

const CustomChannelHeader = () => {
  const { channel } = useChannelStateContext();
  const { client } = useChatContext();
  const { authUser } = useAuthUser();
  const { id: targetUserId } = useParams();

  const [isOnline, setIsOnline] = useState(false);
  const [otherUser, setOtherUser] = useState(null);

  useEffect(() => {
    if (!channel || !authUser) return;

    const member = Object.values(channel.state.members).find(
      (m) => m.user.id === targetUserId
    );

    setOtherUser(member?.user);
    setIsOnline(member?.user?.online || false);

    // Listen for real-time presence changes
    const handlePresenceChange = (event) => {
      if (event.user.id === targetUserId) {
        setIsOnline(event.user.online);
      }
    };

    client.on("user.presence.changed", handlePresenceChange);

    return () => {
      client.off("user.presence.changed", handlePresenceChange);
    };
  }, [channel, authUser, targetUserId, client]);

  if (!channel || !authUser || !otherUser) return null;

  const otherUserName = otherUser.name || "Unknown User";
  const otherUserImage = otherUser.image || "/path/to/default/avatar.png";

  return (
    <div className="flex items-center gap-2 p-2 border-b border-gray-200 bg-white">
      <Avatar image={otherUserImage} name={otherUserName} size={40} />
      <div>
        <p className="font-semibold">{otherUserName}</p>
        {isOnline ? (
          <p className="text-sm text-green-500">Online</p>
        ) : (
          <p className="text-sm text-gray-500">Offline</p>
        )}
      </div>
    </div>
  );
};

export default CustomChannelHeader;
