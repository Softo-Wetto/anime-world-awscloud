// Chatbot.js
import React, { useState } from 'react';
import { sendMessage } from './chatbot_interaction_handler';
import './Chatbot.css';

function Chatbot() {
    const [showChatbot, setShowChatbot] = useState(false);
    const [messages, setMessages] = useState([]);

    const handleToggleChatbot = () => {
        setShowChatbot(!showChatbot);
    };

    const handleSendMessage = () => {
        const userInput = document.getElementById('user-input').value;
        if (!userInput) return;

        // Display user's message
        setMessages((prevMessages) => [
            ...prevMessages,
            { text: userInput, type: 'user' }
        ]);
        document.getElementById('user-input').value = '';

        // Send the user's message to Lambda through API Gateway
        sendMessage(userInput)
            .then((response) => {
                const botResponse = response.data.response;
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: botResponse, type: 'bot' },
                ]);
            })
            .catch((error) => {
                console.error('Error:', error);
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: 'Oops! Something went wrong.', type: 'bot' },
                ]);
            });
    };

    return (
        <div>
            {/* Chatbot Icon */}
            <div id="chatbot-icon" onClick={handleToggleChatbot}>
                💬
            </div>

            {/* Chatbot Container */}
            {showChatbot && (
                <div id="chatbot-container">
                    <div id="chatbot-header">
                        <span>Anime Chatbot</span>
                        <button onClick={handleToggleChatbot}>X</button>
                    </div>
                    <div id="chatbot-body">
                        <div id="chatbot-messages">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={message.type === 'user' ? 'user-message' : 'bot-message'}
                                >
                                    {message.text}
                                </div>
                            ))}
                        </div>
                        <input
                            type="text"
                            id="user-input"
                            placeholder="Ask me anything..."
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button onClick={handleSendMessage}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Chatbot;
