document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const togglePassword = document.getElementById('togglePassword');
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');
    const closeAlert = document.querySelector('.close-alert');
    const loginTitle = document.getElementById('loginTitle');
    const roleText = document.getElementById('roleText');

    // Get role from URL
    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get('role') || 'employee'; // Default to employee if no role specified

    console.log("Current role:", role); // Debug

    // Update login title and role text based on role
    switch(role.toLowerCase()) {
        case 'employee':
            loginTitle.textContent = 'Welcome Back!';
            roleText.textContent = 'Employee Login';
            emailInput.placeholder = 'employee@peacehaven.com';
            break;
        case 'hr':
            loginTitle.textContent = 'Welcome Back!';
            roleText.textContent = 'HR Login';
            emailInput.placeholder = 'hr@peacehaven.com';
            break;
        case 'admin':
            loginTitle.textContent = 'Welcome Back!';
            roleText.textContent = 'Admin Login';
            emailInput.placeholder = 'admin@peacehaven.com';
            break;
    }

    // Check for remembered credentials
    checkRememberedUser();

    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });

    // Sample user data
    const users = [
        { email: 'employee@peacehaven.com', password: 'emp123', role: 'employee' },
        { email: 'hr@peacehaven.com', password: 'hr123', role: 'hr' },
        { email: 'admin@peacehaven.com', password: 'admin123', role: 'admin' }
    ];

    // Handle form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        console.log("Login attempt:", email, password); // Debug

        // Simple hardcoded login for testing
        if (email === 'employee@peacehaven.com' && password === 'emp123') {
            console.log("Employee login successful");
            window.location = '../../pages/employee/employee-dashboard.html';
            return;
        }
        
        if (email === 'hr@peacehaven.com' && password === 'hr123') {
            console.log("HR login successful");
            window.location = '../../pages/hr/hr-dashboard.html';
            return;
        }
        
        if (email === 'admin@peacehaven.com' && password === 'admin123') {
            console.log("Admin login successful");
            window.location = '../../pages/admin/admin-dashboard.html';
            return;
        }
        
        // If we get here, login failed
        alert('Invalid email or password.');
    });

    // Close alert
    if (closeAlert) {
        closeAlert.addEventListener('click', function() {
            errorAlert.classList.remove('show');
        });
    }

    // Authenticate user
    function authenticateUser(email, password) {
        return users.find(user => user.email === email && user.password === password);
    }

    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorAlert.classList.add('show');
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            errorAlert.classList.remove('show');
        }, 5000);
    }

    // Function to check for remembered user
    function checkRememberedUser() {
        const remembered = localStorage.getItem('rememberedUser');
        if (remembered) {
            try {
                const user = JSON.parse(remembered);
                if (user && (!urlParams.get('role') || user.role === role)) {
                    emailInput.value = user.email;
                    rememberMeCheckbox.checked = true;
                }
            } catch (e) {
                console.error("Error parsing remembered user:", e);
                localStorage.removeItem('rememberedUser');
            }
        }
    }

    // Add session timeout handling
    let sessionTimeout;
    function startSessionTimer() {
        clearTimeout(sessionTimeout);
        sessionTimeout = setTimeout(() => {
            sessionStorage.clear();
            window.location.href = 'login.html';
        }, 30 * 60 * 1000); // 30 minutes
    }

    // Reset timer on user activity
    document.addEventListener('mousemove', startSessionTimer);
    document.addEventListener('keypress', startSessionTimer);
}); 