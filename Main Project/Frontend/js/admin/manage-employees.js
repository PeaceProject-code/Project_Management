document.addEventListener('DOMContentLoaded', function() {
    // Sample employee data - in a real application, this would come from a database
    let employees = [
        { id: 1, name: 'John Doe', email: 'john.doe@peacehaven.com', phone: '(555) 123-4567', department: 'nursing', position: 'Head Nurse', startDate: '2022-05-15', status: 'active', notes: 'Senior staff member with excellent leadership skills.' },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@peacehaven.com', phone: '(555) 987-6543', department: 'admin', position: 'Administrative Assistant', startDate: '2022-08-10', status: 'active', notes: '' },
        { id: 3, name: 'Robert Johnson', email: 'robert.j@peacehaven.com', phone: '(555) 456-7890', department: 'facilities', position: 'Maintenance Supervisor', startDate: '2023-01-20', status: 'active', notes: 'Certified in HVAC repair.' },
        { id: 4, name: 'Mary Williams', email: 'mary.w@peacehaven.com', phone: '(555) 234-5678', department: 'hr', position: 'HR Manager', startDate: '2021-11-05', status: 'onleave', notes: 'On maternity leave until April 2025.' },
        { id: 5, name: 'David Brown', email: 'david.b@peacehaven.com', phone: '(555) 876-5432', department: 'nursing', position: 'Nurse', startDate: '2023-03-15', status: 'active', notes: '' },
        { id: 6, name: 'Sarah Miller', email: 'sarah.m@peacehaven.com', phone: '(555) 345-6789', department: 'admin', position: 'Receptionist', startDate: '2022-10-12', status: 'inactive', notes: 'Contract ended February 2025.' }
    ];
    
    // Store employees in localStorage if not already present
    if (!localStorage.getItem('employees')) {
        localStorage.setItem('employees', JSON.stringify(employees));
    } else {
        employees = JSON.parse(localStorage.getItem('employees'));
    }
    
    // DOM elements
    const addEmployeeBtn = document.getElementById('addEmployeeBtn');
    const editEmployeeBtn = document.getElementById('editEmployeeBtn');
    const removeEmployeeBtn = document.getElementById('removeEmployeeBtn');
    const employeeTableBody = document.getElementById('employeeTableBody');
    const searchInput = document.getElementById('employeeSearch');
    const searchBtn = document.getElementById('searchBtn');
    const departmentFilter = document.getElementById('departmentFilter');
    const statusFilter = document.getElementById('statusFilter');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    
    // Modal elements
    const addEmployeeModal = document.getElementById('addEmployeeModal');
    const editEmployeeModal = document.getElementById('editEmployeeModal');
    const removeEmployeeModal = document.getElementById('removeEmployeeModal');
    const closeModalBtns = document.querySelectorAll('.ph-close-modal');
    const cancelBtns = document.querySelectorAll('.ph-cancel-btn');
    
    // Form elements
    const addEmployeeForm = document.getElementById('addEmployeeForm');
    const editEmployeeForm = document.getElementById('editEmployeeForm');
    const confirmRemoveBtn = document.getElementById('confirmRemoveBtn');
    
    // Pagination variables
    let currentPage = 1;
    const itemsPerPage = 5;
    let filteredEmployees = [...employees];
    
    // Initialize the table
    renderEmployeeTable();
    
    // Add event listeners for main action buttons
    addEmployeeBtn.addEventListener('click', openAddEmployeeModal);
    editEmployeeBtn.addEventListener('click', openSelectEmployeeForEdit);
    removeEmployeeBtn.addEventListener('click', openSelectEmployeeForRemove);
    
    // Search functionality
    searchBtn.addEventListener('click', function() {
        filterEmployees();
    });
    
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            filterEmployees();
        }
    });
    
    // Filter functionality
    departmentFilter.addEventListener('change', filterEmployees);
    statusFilter.addEventListener('change', filterEmployees);
    
    // Pagination functionality
    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderEmployeeTable();
        }
    });
    
    nextPageBtn.addEventListener('click', function() {
        const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderEmployeeTable();
        }
    });
    
    // Modal events
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    cancelBtns.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // Form submissions
    addEmployeeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addEmployee();
    });
    
    editEmployeeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        updateEmployee();
    });
    
    confirmRemoveBtn.addEventListener('click', removeEmployee);
    
    // Window event to close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === addEmployeeModal || e.target === editEmployeeModal || e.target === removeEmployeeModal) {
            closeAllModals();
        }
    });
    
    // Filter employees based on search and filters
    function filterEmployees() {
        const searchTerm = searchInput.value.toLowerCase();
        const departmentValue = departmentFilter.value;
        const statusValue = statusFilter.value;
        
        filteredEmployees = employees.filter(emp => {
            const matchesSearch = emp.name.toLowerCase().includes(searchTerm) || 
                                emp.email.toLowerCase().includes(searchTerm) ||
                                emp.position.toLowerCase().includes(searchTerm);
            
            const matchesDepartment = departmentValue === '' || emp.department === departmentValue;
            const matchesStatus = statusValue === '' || emp.status === statusValue;
            
            return matchesSearch && matchesDepartment && matchesStatus;
        });
        
        currentPage = 1; // Reset to first page after filtering
        renderEmployeeTable();
    }
    
    // Render the employee table with pagination
    function renderEmployeeTable() {
        employeeTableBody.innerHTML = '';
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);
        
        if (paginatedEmployees.length === 0) {
            const noDataRow = document.createElement('tr');
            noDataRow.innerHTML = `<td colspan="6" style="text-align: center;">No employees found</td>`;
            employeeTableBody.appendChild(noDataRow);
        } else {
            paginatedEmployees.forEach(emp => {
                const row = document.createElement('tr');
                
                const departmentMap = {
                    'hr': 'Human Resources',
                    'nursing': 'Nursing',
                    'admin': 'Administration',
                    'facilities': 'Facilities'
                };
                
                const statusClass = `status-${emp.status}`;
                const statusText = emp.status === 'active' ? 'Active' : 
                                   emp.status === 'onleave' ? 'On Leave' : 'Inactive';
                
                row.innerHTML = `
                    <td>${emp.id}</td>
                    <td>${emp.name}</td>
                    <td>${departmentMap[emp.department] || emp.department}</td>
                    <td>${emp.position}</td>
                    <td class="${statusClass}">${statusText}</td>
                    <td>
                        <button class="ph-action-btn edit-btn" data-id="${emp.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="ph-action-btn delete-btn" data-id="${emp.id}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                `;
                
                employeeTableBody.appendChild(row);
            });
            
            // Add event listeners to edit and delete buttons in the table
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const employeeId = parseInt(this.getAttribute('data-id'));
                    openEditEmployeeModal(employeeId);
                });
            });
            
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const employeeId = parseInt(this.getAttribute('data-id'));
                    openRemoveEmployeeModal(employeeId);
                });
            });
        }
        
        // Update pagination controls
        const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
        pageInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;
        
        prevPageBtn.disabled = currentPage <= 1;
        nextPageBtn.disabled = currentPage >= totalPages;
    }
    
    // Modal functions
    function openAddEmployeeModal() {
        addEmployeeForm.reset();
        addEmployeeModal.style.display = 'block';
    }
    
    function openSelectEmployeeForEdit() {
        // Create a temporary modal to select an employee
        const selectModal = document.createElement('div');
        selectModal.className = 'ph-modal';
        selectModal.id = 'selectEmployeeModal';
        selectModal.style.display = 'block';
        
        let modalContent = `
            <div class="ph-modal-content ph-modal-sm">
                <div class="ph-modal-header">
                    <h2>Select Employee to Edit</h2>
                    <span class="ph-close-modal" id="closeSelectModal">&times;</span>
                </div>
                <div class="ph-modal-body">
                    <p>Please select an employee:</p>
                    <div class="ph-form-group">
                        <select id="employeeSelect" class="ph-select">
                            <option value="">Select an employee</option>
        `;
        
        employees.forEach(emp => {
            modalContent += `<option value="${emp.id}">${emp.name} - ${emp.position}</option>`;
        });
        
        modalContent += `
                        </select>
                    </div>
                    <div class="ph-form-buttons">
                        <button type="button" class="ph-cancel-btn" id="cancelSelectBtn">Cancel</button>
                        <button type="button" class="ph-submit-btn" id="confirmSelectBtn">Edit Employee</button>
                    </div>
                </div>
            </div>
        `;
        
        selectModal.innerHTML = modalContent;
        document.body.appendChild(selectModal);
        
        // Add event listeners
        document.getElementById('closeSelectModal').addEventListener('click', function() {
            document.body.removeChild(selectModal);
        });
        
        document.getElementById('cancelSelectBtn').addEventListener('click', function() {
            document.body.removeChild(selectModal);
        });
        
        document.getElementById('confirmSelectBtn').addEventListener('click', function() {
            const selectedId = parseInt(document.getElementById('employeeSelect').value);
            if (selectedId) {
                document.body.removeChild(selectModal);
                openEditEmployeeModal(selectedId);
            } else {
                alert('Please select an employee.');
            }
        });
    }
    
    function openSelectEmployeeForRemove() {
        // Create a temporary modal to select an employee
        const selectModal = document.createElement('div');
        selectModal.className = 'ph-modal';
        selectModal.id = 'selectEmployeeModal';
        selectModal.style.display = 'block';
        
        let modalContent = `
            <div class="ph-modal-content ph-modal-sm">
                <div class="ph-modal-header">
                    <h2>Select Employee to Remove</h2>
                    <span class="ph-close-modal" id="closeSelectModal">&times;</span>
                </div>
                <div class="ph-modal-body">
                    <p>Please select an employee:</p>
                    <div class="ph-form-group">
                        <select id="employeeSelect" class="ph-select">
                            <option value="">Select an employee</option>
        `;
        
        employees.forEach(emp => {
            modalContent += `<option value="${emp.id}">${emp.name} - ${emp.position}</option>`;
        });
        
        modalContent += `
                        </select>
                    </div>
                    <div class="ph-form-buttons">
                        <button type="button" class="ph-cancel-btn" id="cancelSelectBtn">Cancel</button>
                        <button type="button" class="ph-submit-btn" id="confirmSelectBtn">Select to Remove</button>
                    </div>
                </div>
            </div>
        `;
        
        selectModal.innerHTML = modalContent;
        document.body.appendChild(selectModal);
        
        // Add event listeners
        document.getElementById('closeSelectModal').addEventListener('click', function() {
            document.body.removeChild(selectModal);
        });
        
        document.getElementById('cancelSelectBtn').addEventListener('click', function() {
            document.body.removeChild(selectModal);
        });
        
        document.getElementById('confirmSelectBtn').addEventListener('click', function() {
            const selectedId = parseInt(document.getElementById('employeeSelect').value);
            if (selectedId) {
                document.body.removeChild(selectModal);
                openRemoveEmployeeModal(selectedId);
            } else {
                alert('Please select an employee.');
            }
        });
    }
    
    function openEditEmployeeModal(employeeId) {
        const employee = employees.find(emp => emp.id === employeeId);
        if (!employee) return;
        
        document.getElementById('editEmployeeId').value = employee.id;
        document.getElementById('editEmployeeName').value = employee.name;
        document.getElementById('editEmployeeEmail').value = employee.email;
        document.getElementById('editEmployeePhone').value = employee.phone;
        document.getElementById('editEmployeeDepartment').value = employee.department;
        document.getElementById('editEmployeePosition').value = employee.position;
        document.getElementById('editEmployeeStartDate').value = employee.startDate;
        document.getElementById('editEmployeeStatus').value = employee.status;
        document.getElementById('editEmployeeNotes').value = employee.notes;
        
        editEmployeeModal.style.display = 'block';
    }
    
    function openRemoveEmployeeModal(employeeId) {
        const employee = employees.find(emp => emp.id === employeeId);
        if (!employee) return;
        
        document.getElementById('removeEmployeeId').value = employee.id;
        document.getElementById('removeEmployeeName').textContent = employee.name;
        
        removeEmployeeModal.style.display = 'block';
    }
    
    function closeAllModals() {
        addEmployeeModal.style.display = 'none';
        editEmployeeModal.style.display = 'none';
        removeEmployeeModal.style.display = 'none';
    }
    
    // CRUD operations
    function addEmployee() {
        const newEmployee = {
            id: getNextEmployeeId(),
            name: document.getElementById('employeeName').value,
            email: document.getElementById('employeeEmail').value,
            phone: document.getElementById('employeePhone').value,
            department: document.getElementById('employeeDepartment').value,
            position: document.getElementById('employeePosition').value,
            startDate: document.getElementById('employeeStartDate').value,
            status: document.getElementById('employeeStatus').value,
            notes: document.getElementById('employeeNotes').value
        };
        
        employees.push(newEmployee);
        saveEmployees();
        closeAllModals();
        
        // Show success message
        showNotification('Employee added successfully!', 'success');
        
        // Refresh the table
        filterEmployees();
    }
    
    function updateEmployee() {
        const employeeId = parseInt(document.getElementById('editEmployeeId').value);
        const employeeIndex = employees.findIndex(emp => emp.id === employeeId);
        
        if (employeeIndex !== -1) {
            employees[employeeIndex] = {
                id: employeeId,
                name: document.getElementById('editEmployeeName').value,
                email: document.getElementById('editEmployeeEmail').value,
                phone: document.getElementById('editEmployeePhone').value,
                department: document.getElementById('editEmployeeDepartment').value,
                position: document.getElementById('editEmployeePosition').value,
                startDate: document.getElementById('editEmployeeStartDate').value,
                status: document.getElementById('editEmployeeStatus').value,
                notes: document.getElementById('editEmployeeNotes').value
            };
            
            saveEmployees();
            closeAllModals();
            
            // Show success message
            showNotification('Employee updated successfully!', 'success');
            
            // Refresh the table
            filterEmployees();
        }
    }
    
    function removeEmployee() {
        const employeeId = parseInt(document.getElementById('removeEmployeeId').value);
        employees = employees.filter(emp => emp.id !== employeeId);
        
        saveEmployees();
        closeAllModals();
        
        // Show success message
        showNotification('Employee removed successfully!', 'warning');
        
        // Refresh the table
        filterEmployees();
    }
    
    // Utility functions
    function getNextEmployeeId() {
        return employees.length > 0 ? Math.max(...employees.map(emp => emp.id)) + 1 : 1;
    }
    
    function saveEmployees() {
        localStorage.setItem('employees', JSON.stringify(employees));
    }
    
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `ph-notification ${type}`;
        notification.innerHTML = `
            <div class="ph-notification-icon">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
            </div>
            <div class="ph-notification-message">${message}</div>
            <button class="ph-notification-close">&times;</button>
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Show with animation
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Add close button functionality
        const closeBtn = notification.querySelector('.ph-notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }

    // Add some additional CSS for notifications
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .ph-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            z-index: 1100;
            transform: translateX(110%);
            transition: transform 0.3s ease;
            max-width: 400px;
        }
        
        .ph-notification.show {
            transform: translateX(0);
        }
        
        .ph-notification.success {
            border-left: 4px solid #28a745;
        }
        
        .ph-notification.warning {
            border-left: 4px solid #ffc107;
        }
        
        .ph-notification.info {
            border-left: 4px solid #17a2b8;
        }
        
        .ph-notification-icon {
            margin-right: 15px;
            font-size: 20px;
        }
        
        .ph-notification.success .ph-notification-icon {
            color: #28a745;
        }
        
        .ph-notification.warning .ph-notification-icon {
            color: #ffc107;
        }
        
        .ph-notification.info .ph-notification-icon {
            color: #17a2b8;
        }
        
        .ph-notification-message {
            flex: 1;
        }
        
        .ph-notification-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #aaa;
            margin-left: 10px;
        }
        
        .ph-notification-close:hover {
            color: #333;
        }
    `;
    document.head.appendChild(notificationStyles);
});