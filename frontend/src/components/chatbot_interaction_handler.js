import axios from 'axios';

export function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (!userInput) return;

    const messageContainer = document.getElementById('chatbot-messages');
    messageContainer.innerHTML += `<div class="user-message">${userInput}</div>`;
    
    document.getElementById('user-input').value = '';

    // Send the user's message to Lambda through API Gateway
    axios.post('https://eqgze0v689.execute-api.ap-southeast-2.amazonaws.com/serverless_11202670',
        { userMessage: userInput },
        {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }
    )
    .then((response) => {
        const botResponse = response.data.response;
        messageContainer.innerHTML += `<div class="bot-message">${botResponse}</div>`;
    })
    .catch((error) => {
        messageContainer.innerHTML += `<div class="bot-message">Oops! Something went wrong.</div>`;
        console.error('Error:', error);
    });

    // Scroll to the bottom of the chat
    messageContainer.scrollTop = messageContainer.scrollHeight;
}
