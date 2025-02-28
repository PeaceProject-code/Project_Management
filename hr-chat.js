document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const contactItems = document.querySelectorAll('.contact-item');
    const messageInput = document.querySelector('.message-input');
    const sendButton = document.querySelector('.send-btn');
    const messagesContainer = document.querySelector('.messages-container');
    const backButton = document.querySelector('.ph-back-btn');
    const contactsList = document.querySelector('.contacts-list');
    const chatArea = document.querySelector('.chat-area');

    // Chat History Storage
    let chatHistory = {};

    // Current Chat State
    let currentChatId = null;

    // Initialize
    function init() {
        loadChatHistory();
        setupEventListeners();
        handleWindowResize();
    }

    // Load Chat History
    function loadChatHistory() {
        const savedHistory = localStorage.getItem('hrChatHistory');
        if (savedHistory) {
            chatHistory = JSON.parse(savedHistory);
            if (currentChatId && chatHistory[currentChatId]) {
                displayChatHistory(currentChatId);
            }
        }
    }

    // Save Chat History
    function saveChatHistory() {
        localStorage.setItem('hrChatHistory', JSON.stringify(chatHistory));
    }

    // Event Listeners
    function setupEventListeners() {
        // Contact selection
        contactItems.forEach(item => {
            item.addEventListener('click', () => {
                selectContact(item);
            });
        });

        // Send message button
        sendButton.addEventListener('click', sendMessage);

        // Enter key to send
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Window resize
        window.addEventListener('resize', handleWindowResize);

        // Back button for mobile
        backButton.addEventListener('click', handleBackButton);
    }

    // Select Contact
    function selectContact(contactElement) {
        // Remove active class from all contacts
        contactItems.forEach(item => item.classList.remove('active'));
        
        // Add active class to selected contact
        contactElement.classList.add('active');

        // Get contact details
        const contactName = contactElement.querySelector('h3').textContent;
        const contactRole = contactElement.querySelector('.designation')?.textContent;
        
        // Set current chat ID
        currentChatId = contactName;

        // Update mobile view
        if (window.innerWidth <= 768) {
            contactsList.style.display = 'none';
            chatArea.style.display = 'flex';
        }

        // Clear and load chat history
        clearChat();
        if (chatHistory[currentChatId]) {
            displayChatHistory(currentChatId);
        } else {
            // Initialize new chat
            chatHistory[currentChatId] = [];
            // Add welcome message
            addMessage({
                sender: 'hr',
                content: `Hello! How can I assist you today?`,
                timestamp: new Date().toISOString()
            });
        }
    }

    // Send Message
    function sendMessage() {
        const content = messageInput.value.trim();
        
        if (content && currentChatId) {
            // Add message to chat
            addMessage({
                sender: 'hr',
                content: content,
                timestamp: new Date().toISOString()
            });

            // Clear input
            messageInput.value = '';

            // Save chat history
            saveChatHistory();

            // Simulate employee response
            simulateResponse();
        }
    }

    // Add Message to Chat
    function addMessage(message) {
        // Add to history
        if (!chatHistory[currentChatId]) {
            chatHistory[currentChatId] = [];
        }
        chatHistory[currentChatId].push(message);

        // Display message
        const messageElement = createMessageElement(message);
        messagesContainer.appendChild(messageElement);
        scrollToBottom();
    }

    // Create Message Element
    function createMessageElement(message) {
        const div = document.createElement('div');
        div.className = `message ${message.sender === 'hr' ? 'assistant' : 'user'}`;
        
        const avatarClass = message.sender === 'hr' ? 'hr-avatar' : 'emp-avatar';
        const iconClass = message.sender === 'hr' ? 'user-tie' : 'user';

        div.innerHTML = `
            ${message.sender !== 'hr' ? '' : `
                <div class="message-avatar ${avatarClass}">
                    <i class="fas fa-${iconClass}"></i>
                </div>
            `}
            <div class="message-content">${message.content}</div>
            ${message.sender !== 'hr' ? `
                <div class="message-avatar ${avatarClass}">
                    <i class="fas fa-${iconClass}"></i>
                </div>
            ` : ''}
        `;

        return div;
    }

    // Simulate Employee Response
    function simulateResponse() {
        setTimeout(() => {
            const responses = [
                "I'll check my schedule and get back to you.",
                "Thank you for letting me know.",
                "I understand, I'll review this information.",
                "Is there anything else you need assistance with?",
                "I'll process this request right away."
            ];

            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            
            addMessage({
                sender: 'employee',
                content: randomResponse,
                timestamp: new Date().toISOString()
            });

            saveChatHistory();
        }, 1000);
    }

    // Display Chat History
    function displayChatHistory(chatId) {
        clearChat();
        chatHistory[chatId].forEach(message => {
            const messageElement = createMessageElement(message);
            messagesContainer.appendChild(messageElement);
        });
        scrollToBottom();
    }

    // Utility Functions
    function clearChat() {
        messagesContainer.innerHTML = '';
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function handleWindowResize() {
        if (window.innerWidth > 768) {
            contactsList.style.display = 'block';
            chatArea.style.display = 'flex';
        } else {
            if (currentChatId) {
                contactsList.style.display = 'none';
                chatArea.style.display = 'flex';
            } else {
                contactsList.style.display = 'block';
                chatArea.style.display = 'none';
            }
        }
    }

    function handleBackButton() {
        if (window.innerWidth <= 768) {
            contactsList.style.display = 'block';
            chatArea.style.display = 'none';
            currentChatId = null;
        }
    }

    // Initialize the chat
    init();
}); 