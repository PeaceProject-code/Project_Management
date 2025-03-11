document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const workList = document.querySelector('.work-list');
    const assignForm = document.getElementById('assignForm');
    const employeeFilter = document.getElementById('employeeFilter');
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');

    // Sample work data
    let workItems = [
        {
            id: 1,
            title: "Q4 Sales Report Analysis",
            employee: "John Smith",
            description: "Analyze and prepare Q4 sales performance report with detailed insights",
            deadline: "2024-03-20T17:00",
            status: "in-progress",
            priority: "high",
            assignedDate: "2024-03-10"
        },
        {
            id: 2,
            title: "Website Redesign Project",
            employee: "Sarah Johnson",
            description: "Lead the redesign of company website homepage and key landing pages",
            deadline: "2024-03-25T18:00",
            status: "pending",
            priority: "medium",
            assignedDate: "2024-03-12"
        },
        {
            id: 3,
            title: "Employee Training Module",
            employee: "Mike Wilson",
            description: "Develop new employee onboarding training materials",
            deadline: "2024-03-15T16:00",
            status: "completed",
            priority: "low",
            assignedDate: "2024-03-05"
        }
    ];

    // Initialize
    renderWorkList();
    setDefaultDate();

    // Event Listeners
    assignForm.addEventListener('submit', handleWorkAssignment);
    employeeFilter.addEventListener('change', filterWorks);
    statusFilter.addEventListener('change', filterWorks);
    dateFilter.addEventListener('change', filterWorks);

    // Functions
    function renderWorkList(filteredItems = workItems) {
        workList.innerHTML = '';
        filteredItems.forEach(item => {
            const card = createWorkCard(item);
            workList.appendChild(card);
        });
    }

    function createWorkCard(work) {
        const card = document.createElement('div');
        card.className = 'work-card';
        card.innerHTML = `
            <div class="work-card-header">
                <h3 class="work-title">${work.title}</h3>
                <span class="work-status status-${work.status}">${capitalizeFirst(work.status)}</span>
            </div>
            <div class="work-info">
                <p><i class="fas fa-user"></i> ${work.employee}</p>
                <p><i class="fas fa-calendar"></i> Due: ${formatDate(work.deadline)}</p>
                <p><i class="fas fa-flag"></i> Priority: ${capitalizeFirst(work.priority)}</p>
            </div>
            <p class="work-description">${work.description}</p>
            <div class="work-actions">
                <button class="action-btn edit-btn" onclick="editWork(${work.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn delete-btn" onclick="deleteWork(${work.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        return card;
    }

    function handleWorkAssignment(e) {
        e.preventDefault();
        const newWork = {
            id: workItems.length + 1,
            title: document.getElementById('workTitle').value,
            employee: document.getElementById('assignEmployee').value,
            description: document.getElementById('workDescription').value,
            deadline: document.getElementById('deadline').value,
            priority: document.getElementById('priority').value,
            status: 'pending',
            assignedDate: new Date().toISOString().split('T')[0]
        };

        workItems.unshift(newWork);
        renderWorkList();
        closeAssignModal();
        assignForm.reset();
    }

    function filterWorks() {
        const employee = employeeFilter.value;
        const status = statusFilter.value;
        const date = dateFilter.value;

        let filtered = workItems;

        if (employee !== 'all') {
            filtered = filtered.filter(item => item.employee.toLowerCase().includes(employee));
        }
        if (status !== 'all') {
            filtered = filtered.filter(item => item.status === status);
        }
        if (date) {
            filtered = filtered.filter(item => item.assignedDate === date);
        }

        renderWorkList(filtered);
    }

    function setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        dateFilter.value = today;
    }
});

// Modal Functions
function openAssignModal() {
    document.getElementById('assignModal').style.display = 'block';
}

function closeAssignModal() {
    document.getElementById('assignModal').style.display = 'none';
}

// Utility Functions
function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });
}

// Work Management Functions
function editWork(id) {
    // Implement edit functionality
    console.log('Editing work:', id);
}

function deleteWork(id) {
    if (confirm('Are you sure you want to delete this work item?')) {
        workItems = workItems.filter(item => item.id !== id);
        renderWorkList();
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('assignModal');
    if (event.target === modal) {
        closeAssignModal();
    }
} 