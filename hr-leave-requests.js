document.addEventListener('DOMContentLoaded', function() {
    // Handle approve/reject buttons
    document.querySelectorAll('.action-btn').forEach(button => {
        button.addEventListener('click', function() {
            const requestItem = this.closest('.request-item');
            const action = this.classList.contains('approve') ? 'approve' : 'reject';
            handleRequest(requestItem, action);
        });
    });
});

function handleRequest(requestItem, action) {
    // Update status
    const statusElement = requestItem.querySelector('.request-status');
    statusElement.textContent = action === 'approve' ? 'Approved' : 'Rejected';
    statusElement.className = `request-status ${action}d`;

    // Disable buttons
    const buttons = requestItem.querySelectorAll('.action-btn');
    buttons.forEach(btn => btn.disabled = true);
    buttons.forEach(btn => btn.style.display = 'none');

    // Move to viewed list
    const viewedList = document.querySelector('.viewed-requests');
    const clonedItem = requestItem.cloneNode(true);
    
    // Add timestamp to viewed item
    const timestamp = new Date().toLocaleString();
    const timeElement = document.createElement('div');
    timeElement.className = 'viewed-timestamp';
    timeElement.textContent = `Viewed on: ${timestamp}`;
    clonedItem.appendChild(timeElement);

    // Move to viewed section
    viewedList.appendChild(clonedItem);
    requestItem.remove();

    // Show message if no more pending requests
    const pendingList = document.querySelector('.pending-requests');
    if (!pendingList.querySelector('.request-item')) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'No pending requests';
        pendingList.appendChild(emptyMessage);
    }
}

// Add this to your CSS
const styles = `
    .viewed-timestamp {
        font-size: 12px;
        color: #666;
        margin-top: 10px;
        text-align: right;
        font-style: italic;
    }

    .empty-message {
        text-align: center;
        color: #666;
        padding: 20px;
        font-style: italic;
    }
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet); 