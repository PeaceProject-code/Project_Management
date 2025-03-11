// Initialize date picker
flatpickr("#dateRange", {
    mode: "range",
    dateFormat: "Y-m-d",
    minDate: "today",
    onChange: function(selectedDates) {
        if (selectedDates.length === 2) {
            calculateDays(selectedDates[0], selectedDates[1]);
        }
    }
});

// Calculate total days between selected dates
function calculateDays(startDate, endDate) {
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    document.getElementById('totalDays').textContent = diffDays;
}

// Handle form submission
document.getElementById('leaveForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const leaveData = {
        type: document.getElementById('leaveType').value,
        dateRange: document.getElementById('dateRange').value,
        reason: document.getElementById('reason').value,
        totalDays: document.getElementById('totalDays').textContent
    };

    // Add to history
    addToHistory(leaveData);
    
    // Reset form
    this.reset();
    document.getElementById('totalDays').textContent = '0';
});

// Add leave request to history
function addToHistory(leaveData) {
    const historyList = document.querySelector('.history-list');
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `
        <div class="history-header">
            <span class="leave-type">${leaveData.type.charAt(0).toUpperCase() + leaveData.type.slice(1)} Leave</span>
            <span class="leave-status pending">Pending</span>
        </div>
        <div class="history-details">
            <div class="date-range">${leaveData.dateRange}</div>
            <div class="days">${leaveData.totalDays} days</div>
        </div>
    `;
    historyList.insertBefore(historyItem, historyList.firstChild);
}

// Handle cancel button
document.querySelector('.cancel-btn').addEventListener('click', function() {
    window.history.back();
}); 