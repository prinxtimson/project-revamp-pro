import React, {
    createContext,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { Client } from "@twilio/conversations";
import useVideoContext from "../../hooks/useVideoContext";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const { room, onError } = useVideoContext();
    const isChatWindowOpenRef = useRef(false);
    const [isChatWindowOpen, setIsChatWindowOpen] = useState(false);
    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [hasUnreadMessages, setHasUnreadMessages] = useState(0);
    const [chatClient, setChatClient] = useState();

    const connect = useCallback(
        (token) => {
            Client.create(token)
                .then((client) => {
                    //@ts-ignore
                    window.chatClient = client;
                    setChatClient(client);
                })
                .catch((e) => {
                    console.log(e);
                    onError(
                        new Error(
                            "There was a problem connecting to Twilio's conversation service."
                        )
                    );
                });
        },
        [onError]
    );

    useEffect(() => {
        if (conversation) {
            const handleMessageAdded = (message) => {
                if (!isChatWindowOpenRef.current) {
                    setHasUnreadMessages((prevCount) => prevCount + 1);
                }

                setMessages((oldMessages) => [...oldMessages, message]);
            };

            conversation.getMessages().then((newMessages) => {
                setMessages([...newMessages.items]);
            });
            conversation.on("messageAdded", handleMessageAdded);
            return () => {
                conversation.off("messageAdded", handleMessageAdded);
            };
        }
    }, [conversation]);

    useEffect(() => {
        isChatWindowOpenRef.current = isChatWindowOpen;
        if (isChatWindowOpen) {
            setHasUnreadMessages(0);
        }
    }, [isChatWindowOpen]);

    useEffect(() => {
        if (room && chatClient) {
            chatClient
                .getConversationByUniqueName(room.sid)
                .then((newConversation) => {
                    //@ts-ignore
                    window.chatConversation = newConversation;
                    setConversation(newConversation);
                })
                .catch((e) => {
                    console.log(e);
                    onError(
                        new Error(
                            "There was a problem getting the Conversation associated with this room."
                        )
                    );
                });
        }
    }, [room, chatClient, onError]);

    return (
        <ChatContext.Provider
            value={{
                isChatWindowOpen,
                setIsChatWindowOpen,
                connect,
                hasUnreadMessages,
                messages,
                conversation,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
