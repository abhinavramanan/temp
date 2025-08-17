/**
 * Offline Time Tracker with Pomodoro and Analytics
 * A comprehensive application for tracking time, managing tasks,
 * and using the Pomodoro technique for productivity.
 */

// ==================== App State ====================
const APP_STATE = {
    tasks: [],
    settings: {
        pomodoro: {
            focusDuration: 25, // minutes
            shortBreakDuration: 5, // minutes
            longBreakDuration: 15, // minutes
            sessionsBeforeLongBreak: 4
        },
        notifications: {
            sound: true,
            desktop: true,
            soundType: 'bell'
        },
        display: {
            theme: 'light',
            accentColor: '#6A7EFC'
        }
    },
    currentView: 'tasks',
    pomodoro: {
        isRunning: false,
        currentMode: 'focus', // 'focus', 'shortBreak', 'longBreak'
        timeRemaining: 25 * 60, // seconds
        totalTime: 25 * 60, // seconds
        sessionsCompleted: 0,
        currentTaskId: null,
        interval: null
    },
    filters: {
        tasks: 'all', // 'all', 'active', 'completed'
        analytics: 'week' // 'week', 'month', 'year'
    }
};

// ==================== DOM Elements ====================
// Navigation and tabs
const navLinks = document.querySelectorAll('.nav-link');
const tabContents = document.querySelectorAll('.tab-content');

// Tasks
const taskList = document.getElementById('task-list');
const newTaskBtn = document.getElementById('new-task-btn');
const taskForm = document.getElementById('task-form');
const noTasksMessage = document.querySelector('.no-tasks-message');
const taskFilters = document.querySelectorAll('.task-filters .filter-btn');

// Task Form
const taskNameInput = document.getElementById('task-name');
const taskDescriptionInput = document.getElementById('task-description');
const taskCategorySelect = document.getElementById('task-category');
const taskPrioritySelect = document.getElementById('task-priority');
const estimatedPomodorosInput = document.getElementById('estimated-pomodoros');
const taskDeadlineInput = document.getElementById('task-deadline');
const taskIdInput = document.getElementById('task-id');
const saveTaskBtn = document.getElementById('save-task-btn');

// Pomodoro
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const timerLabel = document.getElementById('timer-label');
const timerCircle = document.getElementById('timer-circle');
const startButton = document.getElementById('btn-start');
const prevButton = document.getElementById('btn-prev');
const nextButton = document.getElementById('btn-next');
const sessionCountDisplay = document.getElementById('session-count');
const totalFocusTimeDisplay = document.getElementById('total-focus-time');
const pomodoroTaskSelect = document.getElementById('pomodoro-task-select');
const currentPomodoroTask = document.getElementById('current-pomodoro-task');

// Analytics
const dateRangeFilters = document.querySelectorAll('.date-range-filter .filter-btn');
const totalTimeTrackedDisplay = document.getElementById('total-time-tracked');
const tasksCompletedDisplay = document.getElementById('tasks-completed');
const pomodoroSessionsDisplay = document.getElementById('pomodoro-sessions');
const productivityScoreDisplay = document.getElementById('productivity-score');
const analyticsTableBody = document.getElementById('analytics-table-body');

// Settings
const pomodoroSettingsDuration = document.getElementById('pomodoro-duration');
const shortBreakSettingsDuration = document.getElementById('short-break-duration');
const longBreakSettingsDuration = document.getElementById('long-break-duration');
const pomodoroSessionsCount = document.getElementById('pomodoro-sessions-count');
const soundNotificationsCheckbox = document.getElementById('sound-notifications');
const desktopNotificationsCheckbox = document.getElementById('desktop-notifications');
const notificationSoundSelect = document.getElementById('notification-sound');
const themeSelect = document.getElementById('theme-select');
const colorOptions = document.querySelectorAll('.color-option');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const resetSettingsBtn = document.getElementById('reset-settings-btn');
const exportDataBtn = document.getElementById('export-data-btn');
const importDataBtn = document.getElementById('import-data-btn');
const clearDataBtn = document.getElementById('clear-data-btn');

// Modals
const taskModal = document.getElementById('task-modal');
const confirmationModal = document.getElementById('confirmation-modal');
const modalTitle = document.getElementById('modal-title');
const closeModalBtns = document.querySelectorAll('.close-modal, .cancel-btn');
const confirmationTitle = document.getElementById('confirmation-title');
const confirmationMessage = document.getElementById('confirmation-message');
const confirmActionBtn = document.getElementById('confirm-action');
const cancelConfirmationBtn = document.getElementById('cancel-confirmation');

// ==================== Initialization ====================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    loadDataFromLocalStorage();
    setupEventListeners();
    renderCurrentView();
    updateCurrentDate();
    initPomodoroTimer();
    updatePomodoroDisplay();
    loadSettings();
    renderAnalytics();
}

// Initialize the Pomodoro timer circle
function initPomodoroTimer() {
    if (timerCircle) {
        const circumference = 2 * Math.PI * 120; // radius is 120
        timerCircle.style.strokeDasharray = circumference;
        timerCircle.style.strokeDashoffset = circumference;
        timerCircle.style.transition = 'stroke-dashoffset 1s linear';
    }
}

function loadDataFromLocalStorage() {
    try {
        const savedTasks = localStorage.getItem('tasks');
        const savedSettings = localStorage.getItem('settings');

        if (savedTasks) {
            APP_STATE.tasks = JSON.parse(savedTasks);
        }

        if (savedSettings) {
            APP_STATE.settings = JSON.parse(savedSettings);
        }
    } catch (error) {
        console.error('Error loading data from localStorage:', error);
        showToast('Error', 'Failed to load your data. Some data may be lost.', 'error');
    }
}

function saveToLocalStorage() {
    try {
        localStorage.setItem('tasks', JSON.stringify(APP_STATE.tasks));
        localStorage.setItem('settings', JSON.stringify(APP_STATE.settings));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        showToast('Error', 'Failed to save your data. Try clearing some browser storage.', 'error');
    }
}

function updateCurrentDate() {
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString(undefined, options);
    const dateElement = document.querySelector('.current-date');
    if (dateElement) {
        dateElement.textContent = formattedDate;
    }
}

// ==================== Event Listeners ====================
function setupEventListeners() {
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const tabName = link.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    // Tasks
    newTaskBtn.addEventListener('click', () => openNewTaskModal());
    saveTaskBtn.addEventListener('click', handleSaveTask);

    taskFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            const filterType = filter.getAttribute('data-filter');
            setTaskFilter(filterType);
        });
    });

    // Pomodoro
    startButton.addEventListener('click', togglePomodoro);
    prevButton.addEventListener('click', previousPomodoroMode);
    nextButton.addEventListener('click', nextPomodoroMode);
    pomodoroTaskSelect.addEventListener('change', handlePomodoroTaskChange);

    // Analytics
    dateRangeFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            const range = filter.getAttribute('data-range');
            setAnalyticsDateRange(range);
        });
    });

    // Settings
    saveSettingsBtn.addEventListener('click', saveSettings);
    resetSettingsBtn.addEventListener('click', resetSettings);
    exportDataBtn.addEventListener('click', exportData);
    importDataBtn.addEventListener('click', importData);
    clearDataBtn.addEventListener('click', confirmClearData);

    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            const color = option.getAttribute('data-color');
            selectAccentColor(color);
        });
    });

    // Modals
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeModals);
    });

    confirmActionBtn.addEventListener('click', handleConfirmAction);
    cancelConfirmationBtn.addEventListener('click', closeModals);

    // Close modals when clicking outside
    window.addEventListener('click', event => {
        if (event.target === taskModal) {
            closeModals();
        }
        if (event.target === confirmationModal) {
            closeModals();
        }
    });
}

// ==================== Tab Navigation ====================
function switchTab(tabName) {
    // Update navigation
    navLinks.forEach(link => link.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update content
    tabContents.forEach(content => content.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.add('active');

    APP_STATE.currentView = tabName;

    // Update view-specific content
    if (tabName === 'tasks') {
        renderTasks();
        updatePomodoroTaskSelect();
    } else if (tabName === 'pomodoro') {
        updatePomodoroDisplay();
        updatePomodoroTaskSelect();
    } else if (tabName === 'analytics') {
        renderAnalytics();
    } else if (tabName === 'settings') {
        loadSettingsUI();
    }
}

function renderCurrentView() {
    switchTab(APP_STATE.currentView);
}

// ==================== Task Management ====================
function generateTaskId() {
    return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function createTask(taskData) {
    const task = {
        id: generateTaskId(),
        name: taskData.name,
        description: taskData.description || '',
        category: taskData.category || 'work',
        priority: taskData.priority || 'medium',
        estimatedPomodoros: parseInt(taskData.estimatedPomodoros) || 1,
        completedPomodoros: 0,
        timeSpent: 0, // in seconds
        isCompleted: false,
        createdAt: new Date().toISOString(),
        deadline: taskData.deadline || null
    };

    APP_STATE.tasks.push(task);
    saveToLocalStorage();
    renderTasks();
    updatePomodoroTaskSelect();
    showToast('Success', 'Task created successfully!', 'success');
}

function updateTask(taskId, taskData) {
    const taskIndex = APP_STATE.tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        APP_STATE.tasks[taskIndex] = {
            ...APP_STATE.tasks[taskIndex],
            name: taskData.name,
            description: taskData.description || '',
            category: taskData.category || 'work',
            priority: taskData.priority || 'medium',
            estimatedPomodoros: parseInt(taskData.estimatedPomodoros) || 1,
            deadline: taskData.deadline || null
        };
        saveToLocalStorage();
        renderTasks();
        updatePomodoroTaskSelect();
        showToast('Success', 'Task updated successfully!', 'success');
    }
}

function deleteTask(taskId) {
    APP_STATE.tasks = APP_STATE.tasks.filter(task => task.id !== taskId);
    saveToLocalStorage();
    renderTasks();
    updatePomodoroTaskSelect();
    showToast('Success', 'Task deleted successfully!', 'success');
}

function toggleTaskCompletion(taskId) {
    const task = APP_STATE.tasks.find(task => task.id === taskId);
    if (task) {
        task.isCompleted = !task.isCompleted;
        saveToLocalStorage();
        renderTasks();
        showToast('Success', task.isCompleted ? 'Task completed!' : 'Task marked as incomplete', 'success');
    }
}

function renderTasks() {
    const filteredTasks = getFilteredTasks();

    if (filteredTasks.length === 0) {
        taskList.style.display = 'none';
        noTasksMessage.classList.remove('hidden');
    } else {
        taskList.style.display = 'grid';
        noTasksMessage.classList.add('hidden');

        taskList.innerHTML = filteredTasks.map(task => createTaskCardHTML(task)).join('');

        // Add event listeners to task cards
        filteredTasks.forEach(task => {
            const taskCard = document.querySelector(`[data-task-id="${task.id}"]`);
            if (taskCard) {
                taskCard.querySelector('.edit-task').addEventListener('click', () => openEditTaskModal(task));
                taskCard.querySelector('.delete-task').addEventListener('click', () => confirmDeleteTask(task.id));
                taskCard.querySelector('.toggle-complete').addEventListener('click', () => toggleTaskCompletion(task.id));
            }
        });
    }
}

function createTaskCardHTML(task) {
    const progressPercentage = task.estimatedPomodoros > 0 ?
        (task.completedPomodoros / task.estimatedPomodoros) * 100 : 0;

    const timeSpentFormatted = formatTime(task.timeSpent);

    return `
        <div class="task-card" data-task-id="${task.id}">
            <div class="task-card-header">
                <h3 class="task-card-title ${task.isCompleted ? 'completed' : ''}">${task.name}</h3>
                <div class="task-card-actions">
                    <button class="task-action-btn edit-task" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="task-action-btn delete-task" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="task-action-btn toggle-complete" title="${task.isCompleted ? 'Mark Incomplete' : 'Mark Complete'}">
                        <i class="fas ${task.isCompleted ? 'fa-undo' : 'fa-check'}"></i>
                    </button>
                </div>
            </div>
            ${task.description ? `<p class="task-card-description">${task.description}</p>` : ''}
            <div class="task-card-meta">
                <span class="task-card-category">${task.category}</span>
                <div class="task-card-stats">
                    <div class="task-stat">
                        <i class="fas fa-clock"></i>
                        ${timeSpentFormatted}
                    </div>
                    <div class="task-stat">
                        <i class="fas fa-hourglass-half"></i>
                        ${task.completedPomodoros}/${task.estimatedPomodoros}
                    </div>
                    <div class="task-priority priority-${task.priority}"></div>
                </div>
            </div>
            <div class="task-progress">
                <div class="task-progress-bar" style="width: ${progressPercentage}%"></div>
            </div>
        </div>
    `;
}

function getFilteredTasks() {
    const filter = APP_STATE.filters.tasks;

    switch (filter) {
        case 'active':
            return APP_STATE.tasks.filter(task => !task.isCompleted);
        case 'completed':
            return APP_STATE.tasks.filter(task => task.isCompleted);
        default:
            return APP_STATE.tasks;
    }
}

function setTaskFilter(filterType) {
    APP_STATE.filters.tasks = filterType;

    taskFilters.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-filter="${filterType}"]`).classList.add('active');

    renderTasks();
}

// ==================== Task Modal ====================
function openNewTaskModal() {
    modalTitle.textContent = 'Add New Task';
    clearTaskForm();
    showModal(taskModal);
}

function openEditTaskModal(task) {
    modalTitle.textContent = 'Edit Task';
    populateTaskForm(task);
    showModal(taskModal);
}

function clearTaskForm() {
    taskNameInput.value = '';
    taskDescriptionInput.value = '';
    taskCategorySelect.value = 'work';
    taskPrioritySelect.value = 'medium';
    estimatedPomodorosInput.value = '1';
    taskDeadlineInput.value = '';
    taskIdInput.value = '';
}

function populateTaskForm(task) {
    taskNameInput.value = task.name;
    taskDescriptionInput.value = task.description;
    taskCategorySelect.value = task.category;
    taskPrioritySelect.value = task.priority;
    estimatedPomodorosInput.value = task.estimatedPomodoros;
    taskDeadlineInput.value = task.deadline || '';
    taskIdInput.value = task.id;
}

function handleSaveTask(event) {
    event.preventDefault();

    const taskData = {
        name: taskNameInput.value.trim(),
        description: taskDescriptionInput.value.trim(),
        category: taskCategorySelect.value,
        priority: taskPrioritySelect.value,
        estimatedPomodoros: estimatedPomodorosInput.value,
        deadline: taskDeadlineInput.value
    };

    if (!taskData.name) {
        showToast('Error', 'Please enter a task name', 'error');
        return;
    }

    const taskId = taskIdInput.value;
    if (taskId) {
        updateTask(taskId, taskData);
    } else {
        createTask(taskData);
    }

    closeModals();
}

function confirmDeleteTask(taskId) {
    const task = APP_STATE.tasks.find(t => t.id === taskId);
    if (task) {
        showConfirmationModal(
            'Delete Task',
            `Are you sure you want to delete "${task.name}"?`,
            () => deleteTask(taskId)
        );
    }
}

// ==================== Pomodoro Timer ====================
function updatePomodoroDisplay() {
    const minutes = Math.floor(APP_STATE.pomodoro.timeRemaining / 60);
    const seconds = APP_STATE.pomodoro.timeRemaining % 60;

    if (minutesDisplay) minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    if (secondsDisplay) secondsDisplay.textContent = seconds.toString().padStart(2, '0');

    // Update timer label
    const labels = {
        focus: 'Focus Time',
        shortBreak: 'Short Break',
        longBreak: 'Long Break'
    };
    if (timerLabel) timerLabel.textContent = labels[APP_STATE.pomodoro.currentMode];

    // Update progress circle
    if (timerCircle) {
        const progress = (APP_STATE.pomodoro.totalTime - APP_STATE.pomodoro.timeRemaining) / APP_STATE.pomodoro.totalTime;
        const circumference = 2 * Math.PI * 120; // radius is 120
        const offset = circumference * (1 - progress);

        // Set the stroke-dasharray if not already set
        if (!timerCircle.style.strokeDasharray) {
            timerCircle.style.strokeDasharray = circumference;
        }
        timerCircle.style.strokeDashoffset = offset;
    }

    // Update start button
    if (startButton) {
        startButton.innerHTML = APP_STATE.pomodoro.isRunning ?
            '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
    }

    // Update session info
    if (sessionCountDisplay) {
        sessionCountDisplay.textContent = `${APP_STATE.pomodoro.sessionsCompleted}/${APP_STATE.settings.pomodoro.sessionsBeforeLongBreak}`;
    }

    // Update total focus time display with real-time calculation
    if (totalFocusTimeDisplay) {
        let totalFocusTime = APP_STATE.tasks.reduce((sum, task) => sum + task.timeSpent, 0);

        // Add current session time if we're in focus mode and running
        if (APP_STATE.pomodoro.isRunning && APP_STATE.pomodoro.currentMode === 'focus') {
            const currentSessionTime = APP_STATE.pomodoro.totalTime - APP_STATE.pomodoro.timeRemaining;
            totalFocusTime += currentSessionTime;
        }

        totalFocusTimeDisplay.textContent = formatTime(totalFocusTime);
    }

    // Update current task display
    updateCurrentPomodoroTaskDisplay();

    // Update analytics in real-time if we're on analytics tab
    if (APP_STATE.currentView === 'analytics') {
        updateAnalyticsSummary();
    }
}

function togglePomodoro() {
    if (APP_STATE.pomodoro.isRunning) {
        pausePomodoro();
    } else {
        startPomodoro();
    }
}

function startPomodoro() {
    APP_STATE.pomodoro.isRunning = true;
    APP_STATE.pomodoro.interval = setInterval(() => {
        APP_STATE.pomodoro.timeRemaining--;

        if (APP_STATE.pomodoro.timeRemaining <= 0) {
            pomodoroCompleted();
        }

        updatePomodoroDisplay();
    }, 1000);

    updatePomodoroDisplay();
}

function pausePomodoro() {
    APP_STATE.pomodoro.isRunning = false;
    if (APP_STATE.pomodoro.interval) {
        clearInterval(APP_STATE.pomodoro.interval);
        APP_STATE.pomodoro.interval = null;
    }
    updatePomodoroDisplay();
}

function pomodoroCompleted() {
    pausePomodoro();

    if (APP_STATE.pomodoro.currentMode === 'focus') {
        // Focus session completed
        APP_STATE.pomodoro.sessionsCompleted++;

        // Update task time if a task is selected
        if (APP_STATE.pomodoro.currentTaskId) {
            const task = APP_STATE.tasks.find(t => t.id === APP_STATE.pomodoro.currentTaskId);
            if (task) {
                task.completedPomodoros++;
                task.timeSpent += APP_STATE.settings.pomodoro.focusDuration * 60;
                saveToLocalStorage();
                renderTasks();
            }
        }

        // Determine next mode
        if (APP_STATE.pomodoro.sessionsCompleted >= APP_STATE.settings.pomodoro.sessionsBeforeLongBreak) {
            setPomodoroMode('longBreak');
            APP_STATE.pomodoro.sessionsCompleted = 0;
        } else {
            setPomodoroMode('shortBreak');
        }

        showNotification('Focus Session Complete!', 'Time for a break!');
    } else {
        // Break completed
        setPomodoroMode('focus');
        showNotification('Break Complete!', 'Ready for another focus session?');
    }

    updatePomodoroDisplay();
}

function setPomodoroMode(mode) {
    APP_STATE.pomodoro.currentMode = mode;

    const durations = {
        focus: APP_STATE.settings.pomodoro.focusDuration,
        shortBreak: APP_STATE.settings.pomodoro.shortBreakDuration,
        longBreak: APP_STATE.settings.pomodoro.longBreakDuration
    };

    const duration = durations[mode] * 60;
    APP_STATE.pomodoro.timeRemaining = duration;
    APP_STATE.pomodoro.totalTime = duration;
}

function nextPomodoroMode() {
    const modes = ['focus', 'shortBreak', 'longBreak'];
    const currentIndex = modes.indexOf(APP_STATE.pomodoro.currentMode);
    const nextIndex = (currentIndex + 1) % modes.length;

    pausePomodoro();
    setPomodoroMode(modes[nextIndex]);
    updatePomodoroDisplay();
}

function previousPomodoroMode() {
    const modes = ['focus', 'shortBreak', 'longBreak'];
    const currentIndex = modes.indexOf(APP_STATE.pomodoro.currentMode);
    const prevIndex = currentIndex === 0 ? modes.length - 1 : currentIndex - 1;

    pausePomodoro();
    setPomodoroMode(modes[prevIndex]);
    updatePomodoroDisplay();
}

function updatePomodoroTaskSelect() {
    const activeTasks = APP_STATE.tasks.filter(task => !task.isCompleted);

    pomodoroTaskSelect.innerHTML = '<option value="">Select a task</option>' +
        activeTasks.map(task =>
            `<option value="${task.id}" ${task.id === APP_STATE.pomodoro.currentTaskId ? 'selected' : ''}>${task.name}</option>`
        ).join('');
}

function handlePomodoroTaskChange() {
    APP_STATE.pomodoro.currentTaskId = pomodoroTaskSelect.value;
    updateCurrentPomodoroTaskDisplay();
}

function updateCurrentPomodoroTaskDisplay() {
    if (APP_STATE.pomodoro.currentTaskId) {
        const task = APP_STATE.tasks.find(t => t.id === APP_STATE.pomodoro.currentTaskId);
        if (task) {
            currentPomodoroTask.innerHTML = `
                <h4>${task.name}</h4>
                <p>Progress: ${task.completedPomodoros}/${task.estimatedPomodoros} pomodoros</p>
            `;
        }
    } else {
        currentPomodoroTask.innerHTML = '<p>No task selected</p>';
    }
}

// ==================== Analytics ====================
function renderAnalytics() {
    updateAnalyticsSummary();
    updateAnalyticsCharts();
    updateAnalyticsTable();
}

function updateAnalyticsSummary() {
    const totalTime = APP_STATE.tasks.reduce((sum, task) => sum + task.timeSpent, 0);
    const completedTasks = APP_STATE.tasks.filter(task => task.isCompleted).length;
    const totalPomodoros = APP_STATE.tasks.reduce((sum, task) => sum + task.completedPomodoros, 0);
    const productivityScore = calculateProductivityScore();

    totalTimeTrackedDisplay.textContent = formatTime(totalTime);
    tasksCompletedDisplay.textContent = completedTasks.toString();
    pomodoroSessionsDisplay.textContent = totalPomodoros.toString();
    productivityScoreDisplay.textContent = `${productivityScore}%`;
}

function calculateProductivityScore() {
    if (APP_STATE.tasks.length === 0) return 0;

    const completedTasks = APP_STATE.tasks.filter(task => task.isCompleted).length;
    const totalTasks = APP_STATE.tasks.length;

    return Math.round((completedTasks / totalTasks) * 100);
}

function updateAnalyticsCharts() {
    // This is a placeholder for chart implementation
    // In a real app, you'd use Chart.js to create actual charts
    console.log('Charts would be rendered here with Chart.js');
}

function updateAnalyticsTable() {
    analyticsTableBody.innerHTML = APP_STATE.tasks.map(task => `
        <tr>
            <td>${task.name}</td>
            <td>${task.category}</td>
            <td>${formatTime(task.timeSpent)}</td>
            <td>${task.completedPomodoros}</td>
            <td>${task.isCompleted ? '100%' : Math.round((task.completedPomodoros / task.estimatedPomodoros) * 100)}%</td>
        </tr>
    `).join('');
}

function setAnalyticsDateRange(range) {
    APP_STATE.filters.analytics = range;

    dateRangeFilters.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-range="${range}"]`).classList.add('active');

    renderAnalytics();
}

// ==================== Settings ====================
function loadSettings() {
    // Apply saved settings to the app
    document.documentElement.style.setProperty('--primary-color', APP_STATE.settings.display.accentColor);
}

function loadSettingsUI() {
    pomodoroSettingsDuration.value = APP_STATE.settings.pomodoro.focusDuration;
    shortBreakSettingsDuration.value = APP_STATE.settings.pomodoro.shortBreakDuration;
    longBreakSettingsDuration.value = APP_STATE.settings.pomodoro.longBreakDuration;
    pomodoroSessionsCount.value = APP_STATE.settings.pomodoro.sessionsBeforeLongBreak;

    soundNotificationsCheckbox.checked = APP_STATE.settings.notifications.sound;
    desktopNotificationsCheckbox.checked = APP_STATE.settings.notifications.desktop;
    notificationSoundSelect.value = APP_STATE.settings.notifications.soundType;

    themeSelect.value = APP_STATE.settings.display.theme;

    colorOptions.forEach(option => {
        option.classList.toggle('active', option.getAttribute('data-color') === APP_STATE.settings.display.accentColor);
    });
}

function saveSettings() {
    APP_STATE.settings.pomodoro.focusDuration = parseInt(pomodoroSettingsDuration.value);
    APP_STATE.settings.pomodoro.shortBreakDuration = parseInt(shortBreakSettingsDuration.value);
    APP_STATE.settings.pomodoro.longBreakDuration = parseInt(longBreakSettingsDuration.value);
    APP_STATE.settings.pomodoro.sessionsBeforeLongBreak = parseInt(pomodoroSessionsCount.value);

    APP_STATE.settings.notifications.sound = soundNotificationsCheckbox.checked;
    APP_STATE.settings.notifications.desktop = desktopNotificationsCheckbox.checked;
    APP_STATE.settings.notifications.soundType = notificationSoundSelect.value;

    APP_STATE.settings.display.theme = themeSelect.value;

    // Update current pomodoro time if we're in focus mode and not running
    if (APP_STATE.pomodoro.currentMode === 'focus' && !APP_STATE.pomodoro.isRunning) {
        setPomodoroMode('focus');
    }

    saveToLocalStorage();
    loadSettings();
    updatePomodoroDisplay();
    showToast('Success', 'Settings saved successfully!', 'success');
}

function resetSettings() {
    showConfirmationModal(
        'Reset Settings',
        'Are you sure you want to reset all settings to default?',
        () => {
            APP_STATE.settings = {
                pomodoro: {
                    focusDuration: 25,
                    shortBreakDuration: 5,
                    longBreakDuration: 15,
                    sessionsBeforeLongBreak: 4
                },
                notifications: {
                    sound: true,
                    desktop: true,
                    soundType: 'bell'
                },
                display: {
                    theme: 'light',
                    accentColor: '#6A7EFC'
                }
            };
            saveToLocalStorage();
            loadSettings();
            loadSettingsUI();
            showToast('Success', 'Settings reset to default!', 'success');
        }
    );
}

function selectAccentColor(color) {
    APP_STATE.settings.display.accentColor = color;

    colorOptions.forEach(option => option.classList.remove('active'));
    document.querySelector(`[data-color="${color}"]`).classList.add('active');

    document.documentElement.style.setProperty('--primary-color', color);
}

function exportData() {
    const data = {
        tasks: APP_STATE.tasks,
        settings: APP_STATE.settings,
        exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `tempo-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();

    URL.revokeObjectURL(url);
    showToast('Success', 'Data exported successfully!', 'success');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);

                    if (data.tasks && data.settings) {
                        APP_STATE.tasks = data.tasks;
                        APP_STATE.settings = data.settings;
                        saveToLocalStorage();
                        loadSettings();
                        renderCurrentView();
                        showToast('Success', 'Data imported successfully!', 'success');
                    } else {
                        showToast('Error', 'Invalid backup file format', 'error');
                    }
                } catch (error) {
                    showToast('Error', 'Failed to import data. Invalid file format.', 'error');
                }
            };
            reader.readAsText(file);
        }
    };

    input.click();
}

function confirmClearData() {
    showConfirmationModal(
        'Clear All Data',
        'This will permanently delete all your tasks and reset settings. This action cannot be undone.',
        () => {
            APP_STATE.tasks = [];
            APP_STATE.settings = {
                pomodoro: {
                    focusDuration: 25,
                    shortBreakDuration: 5,
                    longBreakDuration: 15,
                    sessionsBeforeLongBreak: 4
                },
                notifications: {
                    sound: true,
                    desktop: true,
                    soundType: 'bell'
                },
                display: {
                    theme: 'light',
                    accentColor: '#6A7EFC'
                }
            };
            saveToLocalStorage();
            loadSettings();
            renderCurrentView();
            showToast('Success', 'All data cleared successfully!', 'success');
        }
    );
}

// ==================== Modal Management ====================
function showModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModals() {
    taskModal.classList.remove('active');
    confirmationModal.classList.remove('active');
    document.body.style.overflow = '';
}

function showConfirmationModal(title, message, confirmCallback) {
    confirmationTitle.textContent = title;
    confirmationMessage.textContent = message;

    confirmActionBtn.onclick = () => {
        confirmCallback();
        closeModals();
    };

    showModal(confirmationModal);
}

let confirmActionCallback = null;

function handleConfirmAction() {
    if (confirmActionCallback) {
        confirmActionCallback();
        confirmActionCallback = null;
        closeModals();
    }
}

// ==================== Notifications ====================
function showNotification(title, message) {
    if (APP_STATE.settings.notifications.desktop && 'Notification' in window) {
        if (Notification.permission === 'granted') {
            new Notification(title, { body: message });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(title, { body: message });
                }
            });
        }
    }

    showToast(title, message, 'info');
}

function showToast(title, message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        console.log(`Toast: ${title} - ${message}`);
        return;
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${icons[type]}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
}

// ==================== Utility Functions ====================
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
}
