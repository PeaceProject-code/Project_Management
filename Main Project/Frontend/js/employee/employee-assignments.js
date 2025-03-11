document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    updateTaskCounters();
    initializeFilters();
    initializeUpload();
    initializeTaskActions();
    initializeModal();
    initializeMeetingActions();
});

// Task Management
function updateTaskCounters() {
    const totalTasks = document.querySelectorAll('.assignment-item').length;
    const pendingTasks = document.querySelectorAll('.status.pending').length;
    const completedTasks = document.querySelectorAll('.status.verified').length;

    document.querySelector('.summary-card.total .count').textContent = totalTasks;
    document.querySelector('.summary-card.pending .count').textContent = pendingTasks;
    document.querySelector('.summary-card.completed .count').textContent = completedTasks;
}

// Filter Functionality
function initializeFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const priorityFilter = document.getElementById('priorityFilter');

    categoryFilter.addEventListener('change', applyFilters);
    priorityFilter.addEventListener('change', applyFilters);
}

function applyFilters() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const selectedPriority = document.getElementById('priorityFilter').value;
    const tasks = document.querySelectorAll('.assignment-item');

    tasks.forEach(task => {
        const taskCategory = task.querySelector('.category')?.textContent.toLowerCase();
        const taskPriority = task.querySelector('.priority')?.textContent.toLowerCase();
        
        const categoryMatch = selectedCategory === 'all' || taskCategory?.includes(selectedCategory.toLowerCase());
        const priorityMatch = selectedPriority === 'all' || taskPriority?.includes(selectedPriority.toLowerCase());

        task.style.display = (categoryMatch && priorityMatch) ? 'block' : 'none';
    });
}

// Modal Functionality
function initializeModal() {
    const modal = document.getElementById('taskModal');
    const closeBtn = document.querySelector('.close-modal');
    
    closeBtn.onclick = function() {
        modal.style.display = "none";
    }
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

// Task Actions
function initializeTaskActions() {
    document.querySelectorAll('.action-btn.open-task').forEach(btn => {
        btn.addEventListener('click', function() {
            const taskItem = this.closest('.assignment-item');
            openTaskDetails(taskItem);
        });
    });

    // Join Meeting Button
    document.querySelectorAll('.action-btn.join').forEach(btn => {
        btn.addEventListener('click', function() {
            const meetingItem = this.closest('.meeting-item');
            handleMeetingAttendance(meetingItem);
        });
    });
}

function openTaskDetails(taskItem) {
    const modal = document.getElementById('taskModal');
    const title = taskItem.querySelector('h3').textContent;
    const category = taskItem.querySelector('.category')?.textContent || 'Documentation';
    const priority = taskItem.querySelector('.priority').textContent;
    const dueDate = taskItem.querySelector('.deadline').textContent.replace('Due: ', '');
    const assignedBy = taskItem.querySelector('.assigned-by').textContent;

    // Update modal content
    modal.querySelector('.task-title').textContent = title;
    modal.querySelector('.value.category').textContent = category;
    modal.querySelector('.value.priority').textContent = priority;
    modal.querySelector('.value.due-date').textContent = dueDate;
    modal.querySelector('.value.assigned-by').textContent = assignedBy;

    // Set task description
    document.getElementById('taskDescription').textContent = 
        taskItem.querySelector('.description').textContent;

    // Example requirements based on category
    const requirements = getRequirements(category);
    const requirementsList = modal.querySelector('#taskRequirements');
    requirementsList.innerHTML = requirements.map(req => `<li>${req}</li>`).join('');

    // Show modal
    modal.style.display = "block";

    // Initialize modal actions
    initializeModalActions(taskItem);
}

function getRequirements(category) {
    const requirementsMap = {
        'Documentation': [
            "Review all documents thoroughly",
            "Ensure all information is up to date",
            "Submit in PDF format",
            "Include digital signature"
        ],
        'Reports': [
            "Include all relevant data",
            "Add executive summary",
            "Attach supporting documents",
            "Follow report template"
        ],
        'Compliance': [
            "Check all compliance guidelines",
            "Complete required forms",
            "Attach necessary certificates",
            "Get supervisor approval"
        ],
        'Training': [
            "Complete all modules",
            "Pass assessment tests",
            "Submit completion certificate",
            "Provide feedback"
        ]
    };
    return requirementsMap[category] || requirementsMap['Documentation'];
}

function initializeModalActions(taskItem) {
    const modal = document.getElementById('taskModal');
    
    // Start Task Button
    const startBtn = modal.querySelector('.action-btn.start-task');
    startBtn.onclick = function() {
        this.innerHTML = '<i class="fas fa-spinner"></i> In Progress';
        this.disabled = true;
        taskItem.querySelector('.status').innerHTML = 
            '<i class="fas fa-circle"></i> In Progress';
        updateTaskCounters();
    };

    // Upload Files Button - Link with main upload section
    const uploadBtn = modal.querySelector('.action-btn.upload-files');
    uploadBtn.onclick = function() {
        const taskTitle = taskItem.querySelector('h3').textContent;
        const taskCategory = taskItem.querySelector('.category')?.textContent || 'Documentation';
        
        // Create file input
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = '.pdf,.doc,.docx';
        
        input.onchange = function(e) {
            const files = Array.from(e.target.files);
            handleTaskFileUpload(files, taskTitle, taskCategory);
            modal.style.display = "none"; // Close modal after upload
        };
        
        input.click();
    };

    // Mark Complete Button
    const completeBtn = modal.querySelector('.action-btn.mark-complete');
    completeBtn.onclick = function() {
        if(confirm('Are you sure you want to mark this task as complete?')) {
            taskItem.querySelector('.status').innerHTML = 
                '<i class="fas fa-circle"></i> Completed';
            taskItem.classList.add('completed');
            modal.style.display = "none";
            updateTaskCounters();
        }
    };
}

// New function to handle task-specific file uploads
function handleTaskFileUpload(files, taskTitle, taskCategory) {
    const statusList = document.querySelector('.status-list');
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    });

    files.forEach(file => {
        const statusItem = document.createElement('div');
        statusItem.className = 'status-item';
        statusItem.innerHTML = `
            <div class="file-info">
                <span class="file-name">${file.name}</span>
                <span class="file-category">${taskCategory}</span>
                <span class="submission-date">Submitted: ${currentDate}</span>
                <span class="task-title">Task: ${taskTitle}</span>
            </div>
            <span class="status pending">Under Review</span>
        `;
        
        // Add to the top of the list
        if (statusList.firstChild) {
            statusList.insertBefore(statusItem, statusList.firstChild);
        } else {
            statusList.appendChild(statusItem);
        }
    });

    // Show success message
    showUploadSuccess(files.length, taskTitle);
}

// Success message function
function showUploadSuccess(fileCount, taskTitle) {
    const message = document.createElement('div');
    message.className = 'upload-success-message';
    message.innerHTML = `
        <i class="fas fa-check-circle"></i>
        Successfully uploaded ${fileCount} file${fileCount > 1 ? 's' : ''} for task: ${taskTitle}
    `;
    
    document.body.appendChild(message);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Add this CSS for the success message
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .upload-success-message {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #4caf50;
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            gap: 8px;
            animation: slideIn 0.3s ease-out;
            z-index: 1000;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .upload-success-message i {
            font-size: 18px;
        }

        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    </style>
`);

// Update the main upload button to also use the new upload handler
function initializeUpload() {
    const uploadBtn = document.querySelector('.upload-box .action-btn.upload');
    const uploadBox = document.querySelector('.upload-box');

    uploadBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,.doc,.docx';
        input.multiple = true;

        input.onchange = (e) => {
            handleTaskFileUpload(
                Array.from(e.target.files),
                'General Upload',
                'Documentation'
            );
        };

        input.click();
    });

    // Drag and drop functionality
    uploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadBox.classList.add('drag-over');
    });

    uploadBox.addEventListener('dragleave', () => {
        uploadBox.classList.remove('drag-over');
    });

    uploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadBox.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files);
        handleTaskFileUpload(files, 'General Upload', 'Documentation');
    });
}

// Utility Functions
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
    }).format(date);
}

// Add window resize handler for responsive adjustments
window.addEventListener('resize', function() {
    const width = window.innerWidth;
    const uploadArea = document.querySelector('.upload-area');
    
    if (width <= 768) {
        uploadArea.classList.add('mobile-view');
    } else {
        uploadArea.classList.remove('mobile-view');
    }
});

// Error Handling
function handleError(error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
}

// Add this CSS for drag and drop visual feedback
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .upload-box.drag-over {
            background-color: #e3f2fd;
            border-color: #1a3c61;
        }
        
        .mobile-view {
            flex-direction: column;
        }
        
        @media (max-width: 768px) {
            .status-list {
                max-height: 200px;
            }
        }
    </style>
`);

// Add these functions to handle meeting attendance
function initializeMeetingActions() {
    document.querySelectorAll('.action-btn.join').forEach(btn => {
        btn.addEventListener('click', function() {
            const meetingItem = this.closest('.meeting-item');
            handleMeetingAttendance(meetingItem);
        });
    });
}

function handleMeetingAttendance(meetingItem) {
    const meetingTitle = meetingItem.querySelector('h3').textContent;
    const meetingTime = meetingItem.querySelector('.meeting-time').textContent;
    const location = meetingItem.querySelector('.location').textContent;
    const presenter = meetingItem.querySelector('.presenter').textContent;

    // Create meeting confirmation modal
    const confirmModal = document.createElement('div');
    confirmModal.className = 'meeting-confirm-modal modal';
    confirmModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Confirm Meeting Attendance</h2>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <div class="meeting-details">
                    <h3>${meetingTitle}</h3>
                    <p class="meeting-time">${meetingTime}</p>
                    <p class="meeting-location">${location}</p>
                    <p class="meeting-presenter">${presenter}</p>
                </div>
                <div class="attendance-options">
                    <button class="action-btn attend in-person">
                        <i class="fas fa-building"></i>
                        Attend In Person
                    </button>
                    <button class="action-btn attend virtual">
                        <i class="fas fa-video"></i>
                        Join Virtually
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(confirmModal);

    // Show modal
    confirmModal.style.display = 'block';

    // Handle close button
    const closeBtn = confirmModal.querySelector('.close-modal');
    closeBtn.onclick = () => {
        confirmModal.remove();
    };

    // Handle click outside modal
    window.onclick = (event) => {
        if (event.target === confirmModal) {
            confirmModal.remove();
        }
    };

    // Handle attendance buttons
    const inPersonBtn = confirmModal.querySelector('.attend.in-person');
    const virtualBtn = confirmModal.querySelector('.attend.virtual');

    inPersonBtn.onclick = () => {
        confirmAttendance(meetingTitle, 'in-person');
        confirmModal.remove();
    };

    virtualBtn.onclick = () => {
        confirmAttendance(meetingTitle, 'virtual');
        confirmModal.remove();
    };
}

function confirmAttendance(meetingTitle, mode) {
    // Update meeting status
    const successMessage = document.createElement('div');
    successMessage.className = 'attendance-success-message';
    successMessage.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <div class="message-content">
            <p>Meeting attendance confirmed</p>
            <p class="meeting-name">${meetingTitle}</p>
            <p class="attendance-mode">${mode === 'in-person' ? 'Attending in person' : 'Joining virtually'}</p>
        </div>
    `;

    document.body.appendChild(successMessage);

    // Remove message after 3 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 3000);
}

// Add this CSS for the attendance confirmation
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .meeting-confirm-modal .modal-content {
            max-width: 500px;
        }

        .meeting-details {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }

        .meeting-details h3 {
            color: #1a3c61;
            margin-bottom: 10px;
        }

        .meeting-details p {
            color: #666;
            margin: 5px 0;
        }

        .attendance-options {
            display: flex;
            gap: 10px;
            justify-content: center;
        }

        .action-btn.attend {
            padding: 12px 24px;
            flex: 1;
        }

        .action-btn.attend.in-person {
            background-color: #1a3c61;
            color: white;
        }

        .action-btn.attend.virtual {
            background-color: #2196f3;
            color: white;
        }

        .attendance-success-message {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #4caf50;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 12px;
            animation: slideIn 0.3s ease-out;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .attendance-success-message i {
            font-size: 24px;
        }

        .message-content p {
            margin: 0;
        }

        .message-content .meeting-name {
            font-weight: 600;
            font-size: 14px;
        }

        .message-content .attendance-mode {
            font-size: 12px;
            opacity: 0.9;
        }

        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    </style>
`); 