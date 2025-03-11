document.addEventListener('DOMContentLoaded', function() {
    const dateFilter = document.getElementById('dateFilter');
    const employeeFilter = document.getElementById('employeeFilter');
    const statusFilter = document.getElementById('statusFilter');
    const attendanceList = document.getElementById('attendanceList');

    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    dateFilter.value = today;

    // Example attendance records
    const sampleRecords = [
        {
            employeeName: "John Doe",
            employeeId: "EMP001",
            checkIn: "9:00 AM",
            checkOut: "5:30 PM",
            date: today
        },
        {
            employeeName: "Jane Smith",
            employeeId: "EMP002",
            checkIn: "9:15 AM",
            checkOut: "5:45 PM",
            date: today
        },
        {
            employeeName: "Robert Johnson",
            employeeId: "EMP003",
            checkIn: "8:45 AM",
            checkOut: "5:15 PM",
            date: today
        },
        {
            employeeName: "Emily Davis",
            employeeId: "EMP004",
            checkIn: "9:30 AM",
            checkOut: "5:30 PM",
            date: today
        },
        {
            employeeName: "Michael Wilson",
            employeeId: "EMP005",
            checkIn: null,
            checkOut: null,
            date: today
        },
        {
            employeeName: "Sarah Brown",
            employeeId: "EMP006",
            checkIn: "8:55 AM",
            checkOut: "5:20 PM",
            date: today
        },
        {
            employeeName: "David Miller",
            employeeId: "EMP007",
            checkIn: "9:45 AM",
            checkOut: "5:50 PM",
            date: today
        },
        {
            employeeName: "Lisa Anderson",
            employeeId: "EMP008",
            checkIn: "9:00 AM",
            checkOut: "5:30 PM",
            date: today
        }
    ];

    // Store sample records in localStorage
    localStorage.setItem('attendanceRecords', JSON.stringify(sampleRecords));

    // Load initial attendance data
    loadAttendanceData();

    // Add event listeners for filters
    dateFilter.addEventListener('change', loadAttendanceData);
    employeeFilter.addEventListener('input', filterAttendance);
    statusFilter.addEventListener('change', filterAttendance);

    function loadAttendanceData() {
        const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
        const selectedDate = dateFilter.value;
        
        const dateRecords = attendanceRecords.filter(record => 
            record.date === selectedDate
        );

        displayAttendanceRecords(dateRecords);
    }

    function displayAttendanceRecords(records) {
        attendanceList.innerHTML = '';

        records.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="employee-name">${record.employeeName}</td>
                <td>${record.employeeId}</td>
                <td>${record.checkIn || '-'}</td>
                <td>${record.checkOut || '-'}</td>
                <td>${calculateHours(record.checkIn, record.checkOut)}</td>
                <td><span class="status-badge status-${getStatusClass(record)}">${getStatus(record)}</span></td>
            `;
            attendanceList.appendChild(row);
        });

        if (records.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="6" style="text-align: center; padding: 20px;">
                    No attendance records found for this date
                </td>
            `;
            attendanceList.appendChild(emptyRow);
        }
    }

    function filterAttendance() {
        const searchTerm = employeeFilter.value.toLowerCase();
        const selectedStatus = statusFilter.value;
        const rows = attendanceList.getElementsByTagName('tr');

        Array.from(rows).forEach(row => {
            const name = row.querySelector('.employee-name')?.textContent.toLowerCase() || '';
            const statusElement = row.querySelector('.status-badge');
            const status = statusElement?.textContent.toLowerCase() || '';
            
            const matchesSearch = name.includes(searchTerm);
            const matchesStatus = selectedStatus === 'all' || status === selectedStatus;
            
            row.style.display = matchesSearch && matchesStatus ? '' : 'none';
        });
    }

    function calculateHours(checkIn, checkOut) {
        if (!checkIn || !checkOut) return '-';
        
        const start = new Date(`2000/01/01 ${checkIn}`);
        const end = new Date(`2000/01/01 ${checkOut}`);
        const diff = (end - start) / (1000 * 60 * 60);
        return diff.toFixed(1);
    }

    function getStatus(record) {
        if (!record.checkIn) return 'Absent';
        const checkInTime = new Date(`2000/01/01 ${record.checkIn}`);
        const startTime = new Date(`2000/01/01 9:00 AM`);
        return checkInTime > startTime ? 'Late' : 'Present';
    }

    function getStatusClass(record) {
        const status = getStatus(record);
        return status.toLowerCase();
    }
}); 