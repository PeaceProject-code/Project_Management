// Initialize date picker
flatpickr("#dateRange", {
    mode: "range",
    dateFormat: "Y-m-d",
    maxDate: "today"
});

// Sample attendance data
const attendanceRecords = [
    { 
        date: "2024-03-20", 
        clockIn: "09:00 AM", 
        clockOut: "05:00 PM", 
        totalHours: "8", 
        status: "Present",
        notes: "Regular day"
    },
    { 
        date: "2024-03-19", 
        clockIn: "08:55 AM", 
        clockOut: "05:30 PM", 
        totalHours: "8.5", 
        status: "Present",
        notes: "Overtime approved"
    },
    { 
        date: "2024-03-18", 
        clockIn: "09:15 AM", 
        clockOut: "05:15 PM", 
        totalHours: "8", 
        status: "Late",
        notes: "Traffic delay"
    },
    { 
        date: "2024-03-17", 
        clockIn: "-", 
        clockOut: "-", 
        totalHours: "0", 
        status: "Absent",
        notes: "Sick leave"
    }
];

function displayAttendanceRecords(records) {
    const tableBody = document.getElementById("attendanceData");
    tableBody.innerHTML = "";

    records.forEach(record => {
        const row = document.createElement("tr");
        const statusClass = `status-${record.status.toLowerCase()}`;
        
        row.innerHTML = `
            <td>${record.date}</td>
            <td>${record.clockIn}</td>
            <td>${record.clockOut}</td>
            <td>${record.totalHours}</td>
            <td><span class="status-badge ${statusClass}">${record.status}</span></td>
            <td>${record.notes}</td>
        `;
        tableBody.appendChild(row);
    });
}

function filterRecords() {
    const dateRange = document.getElementById("dateRange").value;
    const status = document.getElementById("statusFilter").value;
    const sortBy = document.getElementById("sortBy").value;

    let filteredRecords = [...attendanceRecords];

    // Apply filters
    if (status) {
        filteredRecords = filteredRecords.filter(record => 
            record.status.toLowerCase() === status.toLowerCase()
        );
    }

    // Apply sorting
    filteredRecords.sort((a, b) => {
        switch(sortBy) {
            case 'date-desc':
                return new Date(b.date) - new Date(a.date);
            case 'date-asc':
                return new Date(a.date) - new Date(b.date);
            case 'hours-desc':
                return parseFloat(b.totalHours) - parseFloat(a.totalHours);
            case 'hours-asc':
                return parseFloat(a.totalHours) - parseFloat(b.totalHours);
            default:
                return 0;
        }
    });

    displayAttendanceRecords(filteredRecords);
}

function resetFilters() {
    document.getElementById("dateRange").value = "";
    document.getElementById("statusFilter").value = "";
    document.getElementById("sortBy").value = "date-desc";
    displayAttendanceRecords(attendanceRecords);
}

function exportToExcel() {
    const table = document.getElementById("attendanceTable");
    const wb = XLSX.utils.table_to_book(table, { sheet: "Attendance Records" });
    XLSX.writeFile(wb, `attendance_records_${new Date().toISOString().split('T')[0]}.xlsx`);
}

// Initial display
displayAttendanceRecords(attendanceRecords);