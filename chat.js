const inputMessage = document.getElementById('input-message');
const sendButton = document.getElementById('send-button');
const chatContent = document.getElementById('chat-content');
const inputUsername = document.getElementById('input-login');
const loginButton = document.getElementById('login-button');

let username = '';

loginButton.addEventListener('click', () => {
  username = inputUsername.value.trim();
  const loginPage = document.querySelector("#login");
  const chatPage = document.querySelector("#chat");
  if (username) {
    loginPage.style.display = "none";
    chatPage.style.display = "flex";
  }
});

sendButton.addEventListener('click', () => {
  const message = inputMessage.value.trim();
  if (message) {
    addUserMessage(message);
    sendMessageToChatGPT(message)
      .then(botMessage => {
        addBotMessage(botMessage);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  inputMessage.value = '';
});

inputUsername.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    loginButton.click();
  }
});

inputMessage.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    sendButton.click();
  }
});

function addUserMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', 'user-message');

  const messageText = document.createElement('div');
  messageText.classList.add('message-text');
  messageText.textContent = message;

  messageDiv.appendChild(messageText);
  chatContent.appendChild(messageDiv);
  chatContent.scrollTop = chatContent.scrollHeight;
}

function addBotMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', 'bot-message');

  const messageText = document.createElement('div');
  messageText.classList.add('message-text');
  messageText.textContent = message;

  messageDiv.appendChild(messageText);
  chatContent.appendChild(messageDiv);
  chatContent.scrollTop = chatContent.scrollHeight;
}

async function sendMessageToChatGPT(message) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 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' // Replace with your actual API key
    },
    body: JSON.stringify({
      'model': 'gpt-3.5-turbo',
      'messages': [
        { 'role': 'system', 'content': 'You are ' + username },
        { 'role': 'user', 'content': message }
      ]
    })
  });

  const data = await response.json();
  if (data.choices && data.choices.length > 0) {
    const botMessage = data.choices[0].message.content;
    return botMessage;
  } else {
    throw new Error('Empty response from the API');
  }
}
