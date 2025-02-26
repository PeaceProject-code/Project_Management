// Update current time
function updateTime() {
    const now = new Date();
    
    // Update time
    const timeString = now.toLocaleTimeString('en-US', { 
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('currentTime').textContent = timeString;
    
    // Update date
    const dateString = now.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('currentDate').textContent = dateString;
}

// Initialize clock
setInterval(updateTime, 1000);
updateTime();

// Attendance marking function
function markAttendance(type) {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour12: true,
        hour: '2-digit',
        minute: '2-digit'
    });

    if (type === 'in') {
        document.getElementById('checkInTime').textContent = timeString;
        document.getElementById('checkInBtn').disabled = true;
        document.getElementById('checkOutBtn').disabled = false;
        document.getElementById('statusDisplay').textContent = 'Checked In';
        document.getElementById('attendanceStatus').textContent = 
            now.getHours() >= 9 && now.getMinutes() > 15 ? 'Late' : 'Present';
    } else {
        document.getElementById('checkOutTime').textContent = timeString;
        document.getElementById('checkOutBtn').disabled = true;
        document.getElementById('statusDisplay').textContent = 'Checked Out';
        
        // Calculate working hours
        const checkInTime = document.getElementById('checkInTime').textContent;
        const checkIn = new Date();
        const [checkInHour, checkInMinute] = checkInTime.match(/\d+/g);
        checkIn.setHours(parseInt(checkInHour), parseInt(checkInMinute));
        
        const hours = ((now - checkIn) / (1000 * 60 * 60)).toFixed(1);
        document.getElementById('workingHours').textContent = hours;
    }
}