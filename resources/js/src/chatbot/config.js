import { createChatBotMessage } from "react-chatbot-kit";

const config = {
    initialMessages: [
        createChatBotMessage(`Hello! Thank you for using Tritek Live Support`),
        createChatBotMessage("What can we help you with?", {
            withAvatar: false,
            delay: 500,
            widget: "overview",
        }),
    ],
};

export default config;
