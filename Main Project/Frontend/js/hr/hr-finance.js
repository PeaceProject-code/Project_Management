document.addEventListener('DOMContentLoaded', function() {
    // Sample data for each category
    const salaryData = [
        {
            name: 'John Doe',
            id: 'EMP001',
            basicSalary: '$4,000',
            allowances: '$800',
            deductions: '$500',
            netSalary: '$4,300'
        },
        {
            name: 'Jane Smith',
            id: 'EMP002',
            basicSalary: '$4,500',
            allowances: '$900',
            deductions: '$600',
            netSalary: '$4,800'
        }
    ];

    const entertainmentData = [
        {
            eventName: 'Team Building Workshop',
            date: '2024-03-15',
            venue: 'Conference Center',
            participants: '25',
            budget: '$1,500',
            status: 'Approved'
        },
        {
            eventName: 'Annual Party',
            date: '2024-04-20',
            venue: 'Grand Hotel',
            participants: '100',
            budget: '$5,000',
            status: 'Pending'
        }
    ];

    const reimbursementData = [
        {
            employee: 'Mike Wilson',
            date: '2024-03-02',
            category: 'Office Supplies',
            description: 'Printer Cartridges',
            amount: '$150',
            status: 'Approved'
        },
        {
            employee: 'Sarah Johnson',
            date: '2024-03-01',
            category: 'Training',
            description: 'Online Course Fee',
            amount: '$299',
            status: 'Pending'
        }
    ];

    const foodTravelData = [
        {
            employee: 'David Brown',
            date: '2024-03-03',
            type: 'Travel',
            description: 'Client Meeting',
            location: 'New York',
            amount: '$850',
            status: 'Approved'
        },
        {
            employee: 'Lisa Anderson',
            date: '2024-03-02',
            type: 'Food',
            description: 'Team Lunch',
            location: 'Local Restaurant',
            amount: '$200',
            status: 'Completed'
        }
    ];

    // Recent transactions data
    const transactions = [
        {
            date: '2024-03-04',
            category: 'Salary',
            description: 'Monthly Salary Payments',
            amount: '$82,500',
            status: 'Completed'
        },
        {
            date: '2024-03-03',
            category: 'Entertainment',
            description: 'Team Building Event',
            amount: '$1,200',
            status: 'Completed'
        },
        {
            date: '2024-03-02',
            category: 'Food & Travel',
            description: 'Business Trip Expenses',
            amount: '$2,500',
            status: 'Pending'
        },
        {
            date: '2024-03-01',
            category: 'Reimbursement',
            description: 'Office Supplies',
            amount: '$350',
            status: 'Approved'
        }
    ];

    // Initialize page content
    initializeFinancePage();

    // Modal Management
    function initializeModals() {
        // Add click handlers to all manage buttons
        document.querySelectorAll('.manage-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const modalId = this.getAttribute('data-modal');
                if (modalId) {
                    openModal(modalId);
                }
            });
        });

        // Add event listeners for closing modals
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const modalId = this.closest('.modal').id;
                closeModal(modalId);
            });
        });

        // Close modal when clicking outside
        window.onclick = function(event) {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (event.target === modal) {
                    closeModal(modal.id);
                }
            });
        };
    }

    // Modal Functions
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Load data based on modal type
            switch(modalId) {
                case 'salaryModal':
                    loadSalaryData();
                    break;
                case 'entertainmentModal':
                    loadEntertainmentData();
                    break;
                case 'reimbursementModal':
                    loadReimbursementData();
                    break;
                case 'foodTravelModal':
                    loadFoodTravelData();
                    break;
            }
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Form Opening Functions
    function openAddSalaryForm() {
        openModal('addSalaryModal');
        document.getElementById('addSalaryForm')?.reset();
    }

    function openAddEntertainmentForm() {
        openModal('addEntertainmentModal');
        document.getElementById('addEntertainmentForm')?.reset();
    }

    function openAddReimbursementForm() {
        openModal('addReimbursementModal');
        document.getElementById('addReimbursementForm')?.reset();
    }

    function openAddFoodTravelForm() {
        openModal('addFoodTravelModal');
        document.getElementById('addFoodTravelForm')?.reset();
    }

    // Data Loading Functions
    function loadSalaryData() {
        const tbody = document.getElementById('salaryTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';
        salaryData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.id}</td>
                <td>${item.basicSalary}</td>
                <td>${item.allowances}</td>
                <td>${item.deductions}</td>
                <td>${item.netSalary}</td>
                <td>
                    <button class="action-btn" onclick="editSalaryRecord('${item.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" onclick="viewSalaryDetails('${item.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    function loadEntertainmentData() {
        const tbody = document.getElementById('entertainmentTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';
        entertainmentData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.eventName}</td>
                <td>${formatDate(item.date)}</td>
                <td>${item.venue}</td>
                <td>${item.participants}</td>
                <td>${item.budget}</td>
                <td><span class="status-badge ${item.status.toLowerCase()}">${item.status}</span></td>
                <td>
                    <button class="action-btn" onclick="editEvent('${item.eventName}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" onclick="viewEventDetails('${item.eventName}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    function loadReimbursementData() {
        const tbody = document.getElementById('reimbursementTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';
        reimbursementData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.employee}</td>
                <td>${formatDate(item.date)}</td>
                <td>${item.category}</td>
                <td>${item.description}</td>
                <td>${item.amount}</td>
                <td><span class="status-badge ${item.status.toLowerCase()}">${item.status}</span></td>
                <td>
                    <button class="action-btn" onclick="editClaim('${item.date}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" onclick="viewClaimDetails('${item.date}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    function loadFoodTravelData() {
        const tbody = document.getElementById('foodTravelTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';
        foodTravelData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.employee}</td>
                <td>${formatDate(item.date)}</td>
                <td>${item.type}</td>
                <td>${item.description}</td>
                <td>${item.location}</td>
                <td>${item.amount}</td>
                <td><span class="status-badge ${item.status.toLowerCase()}">${item.status}</span></td>
                <td>
                    <button class="action-btn" onclick="editExpense('${item.date}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" onclick="viewExpenseDetails('${item.date}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    function loadRecentTransactions() {
        const tbody = document.getElementById('recentTransactionsBody');
        if (!tbody) return;

        tbody.innerHTML = '';
        transactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDate(transaction.date)}</td>
                <td>${transaction.category}</td>
                <td>${transaction.description}</td>
                <td>${transaction.amount}</td>
                <td><span class="status-badge ${transaction.status.toLowerCase()}">${transaction.status}</span></td>
                <td>
                    <button class="action-btn" onclick="viewTransaction('${transaction.date}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" onclick="editTransaction('${transaction.date}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Search functionality for modals
    function setupModalSearch() {
        document.querySelectorAll('.search-box input').forEach(input => {
            input.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const modalId = this.closest('.modal').id;
                
                let tableBodyId;
                switch(modalId) {
                    case 'salaryModal':
                        tableBodyId = 'salaryTableBody';
                        break;
                    case 'entertainmentModal':
                        tableBodyId = 'entertainmentTableBody';
                        break;
                    case 'reimbursementModal':
                        tableBodyId = 'reimbursementTableBody';
                        break;
                    case 'foodTravelModal':
                        tableBodyId = 'foodTravelTableBody';
                        break;
                    default:
                        return;
                }
                
                const tbody = document.getElementById(tableBodyId);
                if (tbody) {
                    const rows = tbody.querySelectorAll('tr');
                    rows.forEach(row => {
                        const text = row.textContent.toLowerCase();
                        row.style.display = text.includes(searchTerm) ? '' : 'none';
                    });
                }
            });
        });
    }

    // Initialize form submission handlers
    function initializeFormHandlers() {
        // Salary form submission
        const salaryForm = document.getElementById('addSalaryForm');
        if (salaryForm) {
            salaryForm.addEventListener('submit', function(event) {
                event.preventDefault();
                
                // Collect form data
                const basicSalary = parseFloat(document.getElementById('basicSalary').value) || 0;
                const allowances = parseFloat(document.getElementById('allowances').value) || 0;
                const deductions = parseFloat(document.getElementById('deductions').value) || 0;
                const netSalary = (basicSalary + allowances - deductions).toFixed(2);
                
                const formData = {
                    name: document.getElementById('employeeName').value,
                    id: document.getElementById('employeeId').value,
                    basicSalary: '$' + basicSalary.toLocaleString(),
                    allowances: '$' + allowances.toLocaleString(),
                    deductions: '$' + deductions.toLocaleString(),
                    netSalary: '$' + netSalary.toLocaleString()
                };
                
                // Add to data array
                salaryData.push(formData);
                
                // Add to recent transactions
                const today = new Date().toISOString().split('T')[0];
                transactions.unshift({
                    date: today,
                    category: 'Salary',
                    description: `Salary for ${formData.name}`,
                    amount: formData.netSalary,
                    status: 'Completed'
                });
                
                // Reload the tables
                loadSalaryData();
                loadRecentTransactions();
                
                // Close the modal
                closeModal('addSalaryModal');
                
                // Reset form
                this.reset();
                
                // Show success message
                alert('Salary Record Added Successfully!');
            });
        }
        
        // Entertainment form submission
        const entertainmentForm = document.getElementById('addEntertainmentForm');
        if (entertainmentForm) {
            entertainmentForm.addEventListener('submit', function(event) {
                event.preventDefault();
                
                // Collect form data
                const budget = parseFloat(document.getElementById('budget').value) || 0;
                const formData = {
                    eventName: document.getElementById('eventName').value,
                    date: document.getElementById('eventDate').value,
                    venue: document.getElementById('venue').value,
                    participants: document.getElementById('participants').value,
                    budget: '$' + budget.toLocaleString(),
                    status: document.getElementById('eventStatus').value
                };
                
                // Add to data array
                entertainmentData.push(formData);
                
                // Add to recent transactions
                const today = new Date().toISOString().split('T')[0];
                transactions.unshift({
                    date: today,
                    category: 'Entertainment',
                    description: formData.eventName,
                    amount: formData.budget,
                    status: formData.status
                });
                
                // Reload the tables
                loadEntertainmentData();
                loadRecentTransactions();
                
                // Close the modal
                closeModal('addEntertainmentModal');
                
                // Reset form
                this.reset();
                
                // Show success message
                alert('Entertainment Event Added Successfully!');
            });
        }
        
        // Reimbursement form submission
        const reimbursementForm = document.getElementById('addReimbursementForm');
        if (reimbursementForm) {
            reimbursementForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const amount = parseFloat(document.getElementById('claimAmount').value) || 0;
                const formData = {
                    employee: document.getElementById('employeeName').value,
                    date: document.getElementById('claimDate').value,
                    category: document.getElementById('claimCategory').value,
                    description: document.getElementById('claimDescription').value,
                    amount: '$' + amount.toLocaleString(),
                    status: document.getElementById('claimStatus').value
                };
                
                // Add to data array
                reimbursementData.push(formData);
                
                // Add to recent transactions
                transactions.unshift({
                    date: formData.date,
                    category: 'Reimbursement',
                    description: `${formData.category} - ${formData.description}`,
                    amount: formData.amount,
                    status: formData.status
                });
                
                // Reload the tables
                loadReimbursementData();
                loadRecentTransactions();
                
                // Close the modal
                closeModal('addReimbursementModal');
                
                // Reset form
                this.reset();
                
                // Show success message
                alert('Reimbursement Claim Added Successfully!');
            });
        }
        
        // Food & Travel form submission
        const foodTravelForm = document.getElementById('addFoodTravelForm');
        if (foodTravelForm) {
            foodTravelForm.addEventListener('submit', function(event) {
                event.preventDefault();
                
                // Collect form data
                const amount = parseFloat(document.getElementById('expenseAmount').value) || 0;
                const formData = {
                    employee: document.getElementById('employeeName').value,
                    date: document.getElementById('expenseDate').value,
                    type: document.getElementById('expenseType').value,
                    description: document.getElementById('expenseDescription').value,
                    location: document.getElementById('location').value,
                    amount: '$' + amount.toLocaleString(),
                    status: document.getElementById('expenseStatus').value
                };
                
                // Add to data array
                foodTravelData.push(formData);
                
                // Add to recent transactions
                transactions.unshift({
                    date: formData.date,
                    category: 'Food & Travel',
                    description: `${formData.type} - ${formData.description}`,
                    amount: formData.amount,
                    status: formData.status
                });
                
                // Reload the tables
                loadFoodTravelData();
                loadRecentTransactions();
                
                // Close the modal
                closeModal('addFoodTravelModal');
                
                // Reset form
                this.reset();
                
                // Show success message
                alert('Food & Travel Expense Added Successfully!');
            });
        }
    }

    // Initialize the page
    function initializeFinancePage() {
        loadRecentTransactions();
        initializeModals();
        setupModalSearch();
        initializeFormHandlers();
    }

    // Utility Functions
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Make functions available globally
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.openAddSalaryForm = openAddSalaryForm;
    window.openAddEntertainmentForm = openAddEntertainmentForm;
    window.openAddReimbursementForm = openAddReimbursementForm;
    window.openAddFoodTravelForm = openAddFoodTravelForm;
    window.editSalaryRecord = editSalaryRecord;
    window.viewSalaryDetails = viewSalaryDetails;
    window.editEvent = editEvent;
    window.viewEventDetails = viewEventDetails;
    window.editClaim = editClaim;
    window.viewClaimDetails = viewClaimDetails;
    window.editExpense = editExpense;
    window.viewExpenseDetails = viewExpenseDetails;
    window.viewTransaction = viewTransaction;
    window.editTransaction = editTransaction;
});
                