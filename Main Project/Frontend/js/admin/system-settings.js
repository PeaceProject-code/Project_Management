document.addEventListener('DOMContentLoaded', function() {
    // Font size selector
    const fontSizeSelect = document.getElementById('fontSizeSelect');
    
    // Check if font size preference is stored
    if (localStorage.getItem('fontSize')) {
        const savedSize = localStorage.getItem('fontSize');
        fontSizeSelect.value = savedSize;
        setFontSize(savedSize);
    }
    
    fontSizeSelect.addEventListener('change', function() {
        const selectedSize = this.value;
        setFontSize(selectedSize);
        localStorage.setItem('fontSize', selectedSize);
    });
    
    function setFontSize(size) {
        const rootSize = {
            small: '14px',
            large: '18px',
            default: '16px'
        }[size] || rootSize.default;
        document.documentElement.style.fontSize = rootSize;
    }
    
    // Password change functionality
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const passwordChangeForm = document.getElementById('passwordChangeForm');
    const cancelPasswordChange = document.getElementById('cancelPasswordChange');
    const newPassword = document.getElementById('newPassword');
    const strengthIndicator = document.getElementById('strengthIndicator');
    const strengthText = document.getElementById('strengthText');
    const savePasswordChange = document.getElementById('savePasswordChange');
    
    changePasswordBtn.addEventListener('click', function() {
        passwordChangeForm.style.display = 'block';
        changePasswordBtn.style.display = 'none';
    });
    
    cancelPasswordChange.addEventListener('click', function() {
        passwordChangeForm.style.display = 'none';
        changePasswordBtn.style.display = 'block';
        clearPasswordFields();
    });
    
    savePasswordChange.addEventListener('click', function() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPasswordValue = newPassword.value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const username = document.getElementById('usernameInput').value;
        
        if (!currentPassword || !newPasswordValue || !confirmPassword) {
            showSaveNotification('Please fill out all password fields', 'error');
            return;
        }
        
        if (newPasswordValue !== confirmPassword) {
            showSaveNotification('New passwords do not match', 'error');
            return;
        }
        
        // Save the new password securely (for demo purposes, using localStorage)
        localStorage.setItem(`password_${username}`, newPasswordValue);
        showSaveNotification(`Password changed successfully for ${username}!`);
        
        passwordChangeForm.style.display = 'none';
        changePasswordBtn.style.display = 'block';
        clearPasswordFields();
    });
    
    function clearPasswordFields() {
        document.getElementById('currentPassword').value = '';
        newPassword.value = '';
        document.getElementById('confirmPassword').value = '';
        strengthIndicator.style.width = '0%';
        strengthText.textContent = 'Password strength';
    }
    
    // Password strength meter
    newPassword.addEventListener('input', function() {
        const password = this.value;
        const strength = checkPasswordStrength(password);
        
        // Update strength indicator
        strengthIndicator.style.width = `${strength.percentage}%`;
        strengthText.textContent = strength.message;
        
        // Change color based on strength
        strengthIndicator.style.backgroundColor = strength.percentage < 40 ? '#ff4d4d' :
            strength.percentage < 70 ? '#ffa64d' : '#66cc66'; // Red, Orange, Green
    });
    
    function checkPasswordStrength(password) {
        let strength = 0;
        const messages = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
        
        // Length
        if (password.length > 6) strength += 1;
        if (password.length > 10) strength += 1;
        
        // Complexity
        if (/[A-Z]/.test(password)) strength += 1; // Capital letters
        if (/[0-9]/.test(password)) strength += 1; // Numbers
        if (/[^A-Za-z0-9]/.test(password)) strength += 1; // Special characters
        
        const percentage = (strength / 5) * 100;
        return {
            percentage: percentage,
            message: messages[strength]
        };
    }
    
    // View active sessions
    const viewSessionsBtn = document.getElementById('viewSessionsBtn');
    const activeSessions = document.getElementById('activeSessions');
    
    viewSessionsBtn.addEventListener('click', function() {
        const isVisible = activeSessions.style.display === 'block';
        activeSessions.style.display = isVisible ? 'none' : 'block';
        viewSessionsBtn.textContent = isVisible ? 'View & Manage' : 'Hide Sessions';
    });
    
    // Terminate session buttons
    const terminateButtons = document.querySelectorAll('.session-item .danger-btn');
    terminateButtons.forEach(button => {
        if (button.id !== 'terminateAllBtn') {
            button.addEventListener('click', function() {
                const sessionItem = this.closest('.session-item');
                sessionItem.style.opacity = '0.5';
                this.textContent = 'Terminated';
                this.disabled = true;
                showSaveNotification('Session terminated successfully!');
            });
        }
    });
    
    // Terminate all sessions button
    const terminateAllBtn = document.getElementById('terminateAllBtn');
    terminateAllBtn.addEventListener('click', function() {
        const sessionItems = document.querySelectorAll('.session-item:not(:first-child)');
        sessionItems.forEach(item => {
            item.style.opacity = '0.5';
            const terminateBtn = item.querySelector('.danger-btn');
            if (terminateBtn) {
                terminateBtn.textContent = 'Terminated';
                terminateBtn.disabled = true;
            }
        });
        this.disabled = true;
        this.textContent = 'All Other Sessions Terminated';
        showSaveNotification('All other sessions terminated successfully!');
    });
    
    // View login history
    const viewLoginHistoryBtn = document.getElementById('viewLoginHistoryBtn');
    const loginHistory = document.getElementById('loginHistory');
    
    viewLoginHistoryBtn.addEventListener('click', function() {
        const isVisible = loginHistory.style.display === 'block';
        loginHistory.style.display = isVisible ? 'none' : 'block';
        viewLoginHistoryBtn.textContent = isVisible ? 'View History' : 'Hide History';
        
        if (!isVisible) {
            // Clear previous history first
            while (loginHistory.children.length > 1) {
                loginHistory.removeChild(loginHistory.lastChild);
            }
            
            // Add username to login history
            const loginHistoryEntries = getLoginHistory();
            loginHistoryEntries.forEach(entry => {
                const row = document.createElement('div');
                row.className = 'table-row';
                row.innerHTML = `
                    <div class="col">${entry.date}</div>
                    <div class="col">${entry.ip}</div>
                    <div class="col">${entry.device}</div>
                    <div class="col">${entry.username}</div>
                    <div class="col ${entry.status === 'success' ? 'success' : 'failure'}">${entry.status}</div>
                `;
                loginHistory.appendChild(row);
            });
        }
    });
    
    // Sample function to get login history with usernames
    function getLoginHistory() {
        // In a real app, this would come from the server
        return [
            {date: '2025-02-28 09:15', ip: '192.168.1.101', device: 'Chrome/Windows', username: 'admin', status: 'success'},
            {date: '2025-02-27 14:22', ip: '192.168.1.101', device: 'Safari/MacOS', username: 'admin', status: 'success'},
            {date: '2025-02-26 18:05', ip: '192.168.1.102', device: 'Firefox/Linux', username: 'user1', status: 'success'},
            {date: '2025-02-25 11:30', ip: '192.168.1.115', device: 'Edge/Windows', username: 'guest', status: 'failure'},
            {date: '2025-02-24 08:45', ip: '192.168.1.101', device: 'Chrome/Android', username: 'admin', status: 'success'}
        ];
    }
    
    // Save settings functionality
    document.getElementById('saveGeneralSettings').addEventListener('click', function() {
        // Save preferences to localStorage
        localStorage.setItem('emailNotifications', document.getElementById('emailNotificationToggle').checked);
        localStorage.setItem('appNotifications', document.getElementById('appNotificationToggle').checked);
        localStorage.setItem('language', document.getElementById('languageSelect').value);
        localStorage.setItem('timezone', document.getElementById('timezoneSelect').value);
        
        showSaveNotification('General settings saved successfully!');
        showCardsView();
    });
    
    document.getElementById('saveSecuritySettings').addEventListener('click', function() {
        // Save security settings to localStorage
        localStorage.setItem('twoFactor', document.getElementById('twoFactorToggle').checked);
        localStorage.setItem('passwordExpiry', document.getElementById('passwordExpirySelect').value);
        localStorage.setItem('autoLogout', document.getElementById('autoLogoutSelect').value);
        localStorage.setItem('loginNotification', document.getElementById('loginNotificationToggle').checked);
        localStorage.setItem('username', document.getElementById('usernameInput').value);
        
        showSaveNotification('Security settings saved successfully!');
        showCardsView();
    });
    
    document.getElementById('saveDataSettings').addEventListener('click', function() {
        // Save data settings to localStorage
        localStorage.setItem('autoBackup', document.getElementById('autoBackupToggle').checked);
        localStorage.setItem('backupFrequency', document.getElementById('backupFrequencySelect').value);
        localStorage.setItem('dataRetention', document.getElementById('dataRetentionSelect').value);
        localStorage.setItem('backupLocation', document.getElementById('backupLocationSelect').value);
        localStorage.setItem('encryptionLevel', document.getElementById('encryptionLevelSelect').value);
        localStorage.setItem('complianceMode', document.getElementById('complianceModeSelect').value);
        localStorage.setItem('archiveData', document.getElementById('archiveDataToggle').checked);
        
        showSaveNotification('Data management settings saved successfully!');
        showCardsView();
    });
    
    // Backup restore buttons
    const restoreButtons = document.querySelectorAll('.backup-actions .secondary-btn:first-child');
    restoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const backupItem = this.closest('.backup-item');
            const backupDate = backupItem.querySelector('.backup-date').textContent;
            
            if (confirm(`Are you sure you want to restore from backup created on ${backupDate}? This will replace all current data.`)) {
                showSaveNotification('Restore started. This may take a few minutes.');
                
                // Simulate restore process
                setTimeout(function() {
                    showSaveNotification('System restored successfully!');
                }, 3000);
            }
        });
    });
    
    // Backup download buttons
    const downloadButtons = document.querySelectorAll('.backup-actions .secondary-btn:last-child');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const backupItem = this.closest('.backup-item');
            const backupDate = backupItem.querySelector('.backup-date').textContent;
            const backupSize = backupItem.querySelector('.backup-size').textContent;
            
            showSaveNotification(`Downloading backup from ${backupDate} (${backupSize})`);
            
            // Simulate download
            setTimeout(function() {
                showSaveNotification('Backup download completed!');
            }, 2000);
        });
    });
    
    // Manual backup button
    document.getElementById('manualBackupBtn').addEventListener('click', function() {
        const backupStatus = document.getElementById('backupStatus');
        backupStatus.textContent = 'Backup in progress...';
        backupStatus.style.color = '#007bff'; // Primary color
        
        // Add a progress bar
        let progress = 0;
        const progressBar = document.createElement('div');
        progressBar.className = 'backup-progress-bar';
        progressBar.innerHTML = '<div class="progress-indicator"></div>';
        backupStatus.after(progressBar);
        
        const progressIndicator = progressBar.querySelector('.progress-indicator');
        
        // Simulate backup process
        const interval = setInterval(function() {
            progress += 5;
            progressIndicator.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                backupStatus.textContent = 'Backup completed successfully!';
                backupStatus.style.color = '#28a745'; // Success color
                
                // Add to backup history (in a real app, this would be dynamic)
                const now = new Date();
                const dateString = now.toISOString().split('T')[0] + ' ' + now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                
                // Create a new backup item in the history
                createNewBackupHistoryItem(dateString, '1.3 GB');
                
                // Reset after 3 seconds
                setTimeout(function() {
                    backupStatus.textContent = '';
                    progressBar.remove();
                }, 3000);
            }
        }, 100);
    });
    
    function createNewBackupHistoryItem(date, size) {
        const backupHistory = document.querySelector('.backup-history');
        const newBackupItem = document.createElement('div');
        newBackupItem.className = 'backup-item';
        newBackupItem.innerHTML = `
            <div class="backup-info">
                <span class="backup-date">${date}</span>
                <span class="backup-size">${size}</span>
            </div>
            <div class="backup-actions">
                <button class="secondary-btn">Restore</button>
                <button class="secondary-btn">Download</button>
            </div>
        `;
        
        // Insert at the top
        backupHistory.insertBefore(newBackupItem, backupHistory.firstChild);
        
        // Add event listeners to new buttons
        const restoreBtn = newBackupItem.querySelector('.backup-actions .secondary-btn:first-child');
        restoreBtn.addEventListener('click', function() {
            if (confirm(`Are you sure you want to restore from backup created on ${date}? This will replace all current data.`)) {
                showSaveNotification('Restore started. This may take a few minutes.');
                
                setTimeout(function() {
                    showSaveNotification('System restored successfully!');
                }, 3000);
            }
        });
        
        const downloadBtn = newBackupItem.querySelector('.backup-actions .secondary-btn:last-child');
        downloadBtn.addEventListener('click', function() {
            showSaveNotification(`Downloading backup from ${date} (${size})`);
            
            setTimeout(function() {
                showSaveNotification('Backup download completed!');
            }, 2000);
        });
    }
    
    // Load saved settings (if they exist)
    function loadSavedSettings() {
        // Username
        document.getElementById('usernameInput').value = localStorage.getItem('username') || 'admin';
        
        // General settings
        document.getElementById('emailNotificationToggle').checked = localStorage.getItem('emailNotifications') === 'true';
        document.getElementById('appNotificationToggle').checked = localStorage.getItem('appNotifications') === 'true';
        document.getElementById('languageSelect').value = localStorage.getItem('language') || '';
        document.getElementById('timezoneSelect').value = localStorage.getItem('timezone') || '';
        
        // Security settings
        document.getElementById('twoFactorToggle').checked = localStorage.getItem('twoFactor') === 'true';
        document.getElementById('passwordExpirySelect').value = localStorage.getItem('passwordExpiry') || '';
        document.getElementById('autoLogoutSelect').value = localStorage.getItem('autoLogout') || '';
        document.getElementById('loginNotificationToggle').checked = localStorage.getItem('loginNotification') === 'true';
        
        // Data settings
        document.getElementById('autoBackupToggle').checked = localStorage.getItem('autoBackup') === 'true';
        document.getElementById('backupFrequencySelect').value = localStorage.getItem('backupFrequency') || '';
        document.getElementById('dataRetentionSelect').value = localStorage.getItem('dataRetention') || '';
        document.getElementById('backupLocationSelect').value = localStorage.getItem('backupLocation') || '';
        document.getElementById('encryptionLevelSelect').value = localStorage.getItem('encryptionLevel') || '';
        document.getElementById('complianceModeSelect').value = localStorage.getItem('complianceMode') || '';
        document.getElementById('archiveDataToggle').checked = localStorage.getItem('archiveData') === 'true';
    }
    
    // Call load function
    loadSavedSettings();
    
    // Add CSS for new elements
    addDynamicStyles();
});

// Function to show settings section with animation
function showSettingsSection(section) {
    const cardGrid = document.querySelector('.ph-card-grid');
    cardGrid.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    cardGrid.style.opacity = '0';
    cardGrid.style.transform = 'translateY(-20px)';
    
    setTimeout(function() {
        cardGrid.style.display = 'none';
        
        // Hide all settings panels
        document.getElementById('general-settings').style.display = 'none';
        document.getElementById('security-settings').style.display = 'none';
        document.getElementById('data-settings').style.display = 'none';
        
        // Show selected panel with animation
        const selectedPanel = document.getElementById(section + '-settings');
        selectedPanel.style.display = 'block';
        selectedPanel.style.opacity = '0';
        selectedPanel.style.transform = 'translateY(20px)';
        
        setTimeout(function() {
            selectedPanel.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            selectedPanel.style.opacity = '1';
            selectedPanel.style.transform = 'translateY(0)';
        }, 50);
         
    }, 300);
    
    // Update active card (visual indicator)
    document.querySelectorAll('.active-card').forEach(card => card.classList.remove('active-card'));
    document.getElementById(section + '-settings-card').classList.add('active-card');
}

// Function to return to the cards view
function showCardsView() {
    const panels = ['general-settings', 'security-settings', 'data-settings'];
    
    panels.forEach(panel => {
        const elem = document.getElementById(panel);
        if (elem.style.display !== 'none') {
            elem.style.opacity = '0';
            elem.style.transform = 'translateY(-20px)';
        }
    });
    
    setTimeout(function() {
        panels.forEach(panel => {
            document.getElementById(panel).style.display = 'none';
        });
        
        const cardGrid = document.querySelector('.ph-card-grid');
        cardGrid.style.display = 'flex';
        cardGrid.style.opacity = '0';
        cardGrid.style.transform = 'translateY(20px)';
        
        setTimeout(function() {
            cardGrid.style.opacity = '1';
            cardGrid.style.transform = 'translateY(0)';
        }, 50);
        
    }, 300);
}

// Function to show notification with type (success or error)
function showSaveNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.backgroundColor = type === 'success' ? '#28a745' : '#ff4d4d';
    notification.style.color = 'white';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
    notification.style.zIndex = '1000';
    notification.style.transition = 'all 0.3s ease';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    
    document.body.appendChild(notification);
    
    setTimeout(function() {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    setTimeout(function() {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        setTimeout(function() {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Function to add dynamic styles
function addDynamicStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* Light theme styles */
        body {
            background-color: #f0f0f0;
            color: #333;
        }
        
        .primary-btn {
            background-color: #007bff;
            color: white;
        }
        
        .secondary-btn {
            background-color: #e0e0e0;
            color: #007bff;
        }
        
        .danger-btn {
            background-color: #dc3545;
            color: white;
        }
        
        .input-field {
            padding: 8px 12px;
            border-radius: 5px;
            border: 1px solid #ccc;
            background-color: #fff;
            color: #333;
            width: 200px;
        }
        
        .button-group {
            display: flex;
            gap: 10px;
            margin-top: 15px;
            justify-content: flex-end;
        }
        
        .password-strength {
            margin-top: 10px;
        }
        
        .strength-bar {
            height: 5px;
            background-color: #eee;
            border-radius: 5px;
            margin-bottom: 5px;
        }
        
        .strength-indicator {
            height: 100%;
            width: 0;
            border-radius: 5px;
            transition: width 0.3s ease, background-color 0.3s ease;
        }
        
        .session-item, .backup-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            border-bottom: 1px solid #ddd;
            transition: opacity 0.3s ease;
        }
        
        .session-info, .backup-info {
            display: flex;
            flex-direction: column;
        }
        
        .device-name, .backup-date {
            font-weight: 600;
            margin-bottom: 5px;
        }
        
        .session-details, .backup-size {
            font-size: 0.9em;
            color: #777;
        }
        
        .current-session {
            color: #28a745;
            font-weight: 600;
        }
        
        .qr-placeholder {
            width: 200px;
            height: 200px;
            background-color: #f0f0f0;
            border: 1px solid #ddd;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 15px auto;
            color: #666;
        }
        
        .history-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .table-header, .table-row {
            display: flex;
            border-bottom: 1px solid #ddd;
        }
        
        .table-header {
            font-weight: 600;
            background-color: rgba(0,0,0,0.05);
        }
        
        .table-header .col, .table-row .col {
            padding: 10px;
            flex: 1;
        }
        
        .col.success {
            color: #28a745;
        }
        
        .col.failure {
            color: #ff4d4d;
        }
        
        .backup-progress-bar {
            height: 5px;
            background-color: #eee;
            border-radius: 5px;
            margin: 10px 0;
            overflow: hidden;
        }
        
        .progress-indicator {
            height: 100%;
            width: 0;
            background-color: #007bff;
            transition: width 0.1s linear;
        }
        
        .back-to-settings-btn {
            position: fixed;
            bottom: 20px;
            left: 20px;
            padding: 10px 15px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        
        /* Mobile responsiveness fixes */
        @media (max-width: 768px) {
            .setting-item {
                flex-direction: column;
                align-items: flex-start;
                margin-bottom: 15px;
            }
            
            .toggle-switch, .select-box, .input-field {
                margin-top: 5px;
                width: 100%;
            }
            
            .session-item, .backup-item {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .backup-actions, .session-details {
                margin-top: 10px;
                width: 100%;
                display: flex;
                justify-content: space-between;
            }
            
            .table-header, .table-row {
                flex-direction: column;
            }
            
            .table-header {
                display: none;
            }
            
            .table-row .col {
                padding: 5px;
                border-bottom: 1px solid #eee;
            }
            
            .table-row .col:before {
                content: attr(data-label);
                font-weight: 600;
                display: inline-block;
                width: 120px;
            }
            
            .history-table .col:nth-child(1):before { content: "Date & Time: "; }
            .history-table .col:nth-child(2):before { content: "IP Address: "; }
            .history-table .col:nth-child(3):before { content: "Device: "; }
            .history-table .col:nth-child(4):before { content: "Username: "; }
            .history-table .col:nth-child(5):before { content: "Status: "; }
        }
    `;
    
    document.head.appendChild(styleElement);
    
    // Add data attributes to login history table for mobile view
    const tableRows = document.querySelectorAll('.history-table .table-row');
    tableRows.forEach(row => {
        const cols = row.querySelectorAll('.col');
        if (cols.length >= 5) {
            cols[0].setAttribute('data-label', 'Date & Time');
            cols[1].setAttribute('data-label', 'IP Address');
            cols[2].setAttribute('data-label', 'Device');
            cols[3].setAttribute('data-label', 'Username');
            cols[4].setAttribute('data-label', 'Status');
        }
    });
}

// Add Back to Settings button
document.addEventListener('DOMContentLoaded', function() {
    const backToSettingsBtn = document.createElement('button');
    backToSettingsBtn.className = 'back-to-settings-btn';
    backToSettingsBtn.textContent = 'Back to Settings';
    backToSettingsBtn.addEventListener('click', function() {
        showCardsView();
    });
    document.body.appendChild(backToSettingsBtn);
});