import axios from 'axios';

export function sendMessage(userInput) {
    return axios.post(
        'https://eqgze0v689.execute-api.ap-southeast-2.amazonaws.com/chatbot',
        { userMessage: userInput },
        {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }
    );
}
