import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import ChatLoader from "../components/ChatLoader";
import CustomChannelHeader from "../components/CustomChannelHeader";
import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const clientRef = useRef(null);
  // Add a ref to track if initChat is already in progress
  const initInProgressRef = useRef(false);

  const { authUser } = useAuthUser();

  const {
    data: tokenData,
    isError,
    error,
    isLoading: isTokenLoading,
  } = useQuery({
    queryKey: ["streamtoken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (isError) {
      console.error("Error fetching Stream token:", error);
      toast.error("Failed to get chat token. Please refresh the page.");
      setLoading(false);
    }
  }, [isError, error]);

  useEffect(() => {
    const initChat = async () => {
      // Prevent multiple concurrent initializations
      if (initInProgressRef.current) {
        console.log("initChat already in progress. Skipping.");
        return;
      }
      initInProgressRef.current = true; // Set flag to true

      const areAuthUserDetailsReady =
        authUser &&
        typeof authUser._id === "string" &&
        authUser._id.trim() !== "" &&
        typeof authUser.fullName === "string" &&
        authUser.fullName.trim() !== "";

      if (!areAuthUserDetailsReady || !tokenData?.token) {
        if (isTokenLoading || authUser === undefined) {
          setLoading(true);
          initInProgressRef.current = false; // Reset flag if still waiting
          return;
        }

        console.error(
          "Authentication details incomplete for Stream connection:",
          { authUser, tokenData }
        );
        toast.error(
          "User details incomplete for chat connection. Please ensure you are fully logged in and refresh."
        );
        setLoading(false);
        initInProgressRef.current = false; // Reset flag on error/missing data
        return;
      }

      console.log("--- Attempting Stream Chat connection with ---");
      console.log("Auth User ID:", authUser._id);
      console.log("Auth User Name:", authUser.fullName);
      console.log("Auth User Profile Pic:", authUser.profilePic);
      console.log("Stream Token available:", !!tokenData.token);
      console.log("---------------------------------------------");

      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);

        // Disconnect existing user *more carefully*
        if (client.userID && client.userID !== authUser._id) {
          // Only disconnect if a different user is connected
          console.log(
            `Force disconnecting previously connected user: ${client.userID}`
          );
          await client.disconnectUser();
          await new Promise((resolve) => setTimeout(resolve, 50)); // Small delay for robustness
        } else if (
          client.userID === authUser._id &&
          client.ws.readyState === WebSocket.OPEN
        ) {
          // If already connected as the correct user, no need to reconnect.
          // This is crucial to prevent unnecessary disconnect/connect cycles.
          console.log(
            `Already connected as ${authUser._id}. Reusing existing connection.`
          );
          setChatClient(client);
          clientRef.current = client; // Ensure ref is set
          const channelId = [authUser._id, targetUserId].sort().join("-");
          const currChannel = client.channel("messaging", channelId, {
            members: [authUser._id, targetUserId],
            name: targetUserId,
          });
          await currChannel.watch();
          setChannel(currChannel);
          setLoading(false);
          initInProgressRef.current = false; // Reset flag
          return;
        } else if (
          client.userID === authUser._id &&
          client.ws.readyState !== WebSocket.OPEN
        ) {
          // If it's the same user but connection is not open, it might be stale. Disconnect explicitly.
          console.log(
            `Stale connection for ${authUser._id}. Disconnecting before re-connecting.`
          );
          await client.disconnectUser();
          await new Promise((resolve) => setTimeout(resolve, 50)); // Small delay
        }

        // Proceed to connect if no active, valid connection existed
        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic || "",
          },
          tokenData.token
        );
        clientRef.current = client;

        const channelId = [authUser._id, targetUserId].sort().join("-");

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
          name: targetUserId,
        });

        await currChannel.watch({ presence: true });
        setChatClient(client);
        setChannel(currChannel);
        setLoading(false);
        console.log("Stream chat client initialized successfully.");
      } catch (error) {
        console.error("Error initializing chat:", error);
        if (
          error.code === 400 &&
          error.message &&
          error.message.includes("user_details is a required field")
        ) {
          toast.error(
            "Failed to connect chat: Missing user details or connection issue. Please try logging in again."
          );
        } else {
          toast.error(
            "Could not connect to chat. Please try again. Error: " +
              error.message
          );
        }
        setLoading(false);
      } finally {
        initInProgressRef.current = false; // Always reset flag
      }
    };

    // This condition ensures initChat runs only when we have enough data to attempt a connection
    // or are waiting for that data.
    if (authUser && (tokenData?.token || isTokenLoading)) {
      initChat();
    } else if (!authUser && !isTokenLoading && !isError) {
      setLoading(false);
    }

    const handleBeforeUnload = () => {
      if (clientRef.current) {
        console.log(
          "[BEFORE_UNLOAD] Attempting Stream chat client disconnect."
        );
        clientRef.current
          .disconnectUser()
          .catch((e) =>
            console.error(
              "[BEFORE_UNLOAD] Error on beforeunload disconnect:",
              e
            )
          );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (clientRef.current) {
        console.log(
          "[CLEANUP] Attempting Stream chat client disconnect from useEffect."
        );
        clientRef.current
          .disconnectUser()
          .then(() =>
            console.log(
              "[CLEANUP] Successfully disconnected via useEffect cleanup."
            )
          )
          .catch((e) =>
            console.error(
              "[CLEANUP] Error during client disconnection from useEffect:",
              e
            )
          );
        clientRef.current = null;
      }
    };
  }, [tokenData, authUser, targetUserId, isError, isTokenLoading]);

  const handleVideoCall = ()=>{
    if(channel){
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`
      });
      toast.success("video call link sent successfully")
    }
  }


  if (loading || !chatClient || !channel) {
    return <ChatLoader />;
  }

  return (
    <div className="h-[calc(100vh-56px)]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall}  />
            <Window>
              <CustomChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
