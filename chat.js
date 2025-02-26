document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const contactItems = document.querySelectorAll('.contact-item');
    const messageInput = document.querySelector('.message-input');
    const sendButton = document.querySelector('.send-btn');
    const messagesContainer = document.querySelector('.messages-container');
    const backButton = document.querySelector('.ph-back-btn');
    const contactsList = document.querySelector('.contacts-list');
    const chatArea = document.querySelector('.chat-area');

    // State Management
    let isMobileView = window.innerWidth <= 768;
    let currentChat = null;
    let selectedContact = null;

    // Initialize
    function init() {
        updateLayout();
        addEventListeners();
    }

    // Event Listeners
    function addEventListeners() {
        // Window resize
        window.addEventListener('resize', () => {
            isMobileView = window.innerWidth <= 768;
            updateLayout();
        });

        // Contact selection
        contactItems.forEach(item => {
            item.addEventListener('click', () => handleContactSelect(item));
        });

        // Back button
        backButton.addEventListener('click', handleBack);

        // Send message
        sendButton.addEventListener('click', handleSendMessage);

        // Enter key for sending
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        });
    }

    // Layout Management
    function updateLayout() {
        if (isMobileView) {
            contactsList.style.display = currentChat ? 'none' : 'block';
            chatArea.style.display = currentChat ? 'flex' : 'none';
        } else {
            contactsList.style.display = 'block';
            chatArea.style.display = 'flex';
        }
    }

    // Contact Selection Handler
    function handleContactSelect(item) {
        // Update active state
        contactItems.forEach(contact => contact.classList.remove('active'));
        item.classList.add('active');
        selectedContact = item;

        // Get contact info
        const name = item.querySelector('h3').textContent;
        const designation = item.querySelector('.designation')?.textContent || '';
        const isHR = item.closest('.contact-section').querySelector('h2').textContent.includes('HR');

        // Update chat
        currentChat = { name, designation, isHR };
        updateLayout();
        updateChatHeader(name, designation);
        clearMessages();
        showWelcomeMessage(name, isHR);
        scrollToBottom();
    }

    // Back Button Handler
    function handleBack() {
        if (isMobileView && currentChat) {
            currentChat = null;
            updateLayout();
        }
    }

    // Message Handlers
    function handleSendMessage() {
        const message = messageInput.value.trim();
        if (message && currentChat) {
            sendMessage(message, true);
            messageInput.value = '';
            
            // Simulate response
            simulateResponse(currentChat);
        }
    }

    function sendMessage(message, isUser = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'assistant'}`;
        
        const avatarClass = currentChat?.isHR ? 'hr-avatar' : 'emp-avatar';
        const iconClass = currentChat?.isHR ? 'user-tie' : 'user';
        
        messageDiv.innerHTML = `
            ${isUser ? '' : `
                <div class="message-avatar ${avatarClass}">
                    <i class="fas fa-${iconClass}"></i>
                </div>
            `}
            <div class="message-content">${message}</div>
            ${isUser ? `
                <div class="message-avatar ${avatarClass}">
                    <i class="fas fa-${iconClass}"></i>
                </div>
            ` : ''}
        `;

        messagesContainer.appendChild(messageDiv);
        scrollToBottom();
    }

    function simulateResponse(contact) {
        const isTyping = document.createElement('div');
        isTyping.className = 'message assistant typing';
        isTyping.innerHTML = '<div class="message-content">Typing...</div>';
        messagesContainer.appendChild(isTyping);
        scrollToBottom();

        setTimeout(() => {
            messagesContainer.removeChild(isTyping);
            const response = contact.isHR 
                ? "How can I assist you with HR-related matters today?"
                : `Hi! I'll get back to you shortly.`;
            sendMessage(response, false);
        }, 1500);
    }

    // Utility Functions
    function showWelcomeMessage(name, isHR) {
        const welcomeMessage = isHR 
            ? "Hello! How can I help you with HR matters today?"
            : `Starting chat with ${name}`;
        sendMessage(welcomeMessage, false);
    }

    function updateChatHeader(name, designation) {
        // If you have a chat header, update it here
        const chatHeader = document.querySelector('.chat-header');
        if (chatHeader) {
            chatHeader.textContent = `${name}${designation ? ` - ${designation}` : ''}`;
        }
    }

    function clearMessages() {
        messagesContainer.innerHTML = '';
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Initialize the chat
    init();
}); 