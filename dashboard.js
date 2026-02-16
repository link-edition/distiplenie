// ============================================
// DISTIPLENIE DASHBOARD - Full Featured App
// ============================================

const STORAGE = {
    TASKS: 'distiplenie_tasks',
    LISTS: 'distiplenie_lists',
    SETTINGS: 'distiplenie_settings',
    GOALS: 'distiplenie_goals',
    HABITS: 'distiplenie_habits',
    STATS: 'distiplenie_stats',
    STREAK: 'distiplenie_streak'
};

const DEFAULT_LISTS = [
    { id: 'inbox', name: 'Inbox', color: '#4A90E2', icon: '📥' },
    { id: 'personal', name: 'Shaxsiy', color: '#4A90E2', icon: '👤' },
    { id: 'work', name: 'Ish', color: '#10B981', icon: '💼' },
    { id: 'study', name: "O'qish", color: '#F59E0B', icon: '📚' }
];

const DEFAULT_TAGS = [
    { id: 'ish', name: '#ish', color: '#4A90E2' },
    { id: 'shaxsiy', name: '#shaxsiy', color: '#10B981' },
    { id: 'muhim', name: '#muhim', color: '#EF4444' }
];

const EMOJIS = [
    // Trendy faces
    '🥹', '🫠', '🫡', '🫢', '🫣', '🫤', '🫥', '🫨', '😊', '😎', '🤩', '🥳', '🤗', '😍', '🥰', '😇',
    // Hearts
    '❤️', '🩷', '🧡', '💛', '💚', '🩵', '💙', '💜', '🖤', '🩶', '🤍', '🤎', '💕', '💞', '💓', '💗',
    // Hand gestures
    '👍', '👎', '👏', '🙌', '🫶', '🫰', '🫳', '🫴', '🫵', '✌️', '🤞', '🤟', '🤘', '💪', '👊', '🤝',
    // Productivity & Work
    '✅', '☑️', '✔️', '❌', '⭐', '🌟', '💫', '✨', '🔥', '💯', '🎯', '🏆', '🥇', '🏅', '👑', '💎',
    // Tech & Tools
    '💻', '📱', '⌨️', '🖥️', '📊', '📈', '📉', '📋', '📝', '✏️', '📌', '📎', '🔗', '💡', '⚡', '🔋',
    // Time & Calendar
    '⏰', '⏱️', '⏳', '📅', '📆', '🗓️', '📍', '🎪', '🎭', '🎨', '🎬', '🎤', '🎧', '🎮', '🕹️', '🧩',
    // Nature & Weather
    '🌈', '☀️', '🌙', '⭐', '🌸', '🌺', '🌻', '🌷', '🍀', '🌿', '🌱', '🪴', '🌳', '🔮', '🧿', '🪬',
    // Food & Celebration
    '🍕', '🍔', '🍟', '🌮', '🍩', '🍪', '🧁', '🎂', '🍰', '☕', '🧋', '🥤', '🍷', '🥂', '🎉', '🎊',
    // Animals
    '🦋', '🐱', '🐶', '🦊', '🦁', '🐻', '🐼', '🐨', '🐯', '🦄', '🐝', '🦅', '🦉', '🐙', '🦑', '🦈',
    // Objects
    '💰', '💵', '💳', '🎁', '🎈', '🪄', '🔑', '🗝️', '🛒', '🧳', '👓', '🕶️', '👔', '👗', '🎒', '👟'
];

let state = {
    tasks: [],
    lists: [...DEFAULT_LISTS],
    tags: [...DEFAULT_TAGS],
    goals: [],
    habits: [],
    settings: {
        theme: 'light',
        color: 'blue',
        notifications: false,
        sound: true,
        pomoWork: 25,
        pomoShort: 5,
        pomoLong: 15,
        dailyGoal: 5
    },
    streak: { count: 0, lastDate: null },
    currentView: 'today',
    currentList: null,
    selectedTask: null,
    selectedDate: new Date(),
    selectedPriority: 'none',
    selectedListId: 'personal',
    selectedTags: [],
    selectedRepeat: 'none',
    calendarDate: new Date(),
    calendarSelectedDate: new Date(),
    pomodoro: {
        mode: 'work',
        timeLeft: 25 * 60,
        isRunning: false,
        completed: 0,
        totalTime: 0
    }
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initEventListeners();
    // initCustomCursor(); // Cursor effekti o'chirildi
    initHabits();
    renderAll();
    updateTodayDate();
    checkStreak();
    requestNotificationPermission();
    console.log('🚀 Distiplenie Dashboard initialized!');
});

function loadData() {
    const tasks = localStorage.getItem(STORAGE.TASKS);
    if (tasks) state.tasks = JSON.parse(tasks);

    const lists = localStorage.getItem(STORAGE.LISTS);
    if (lists) state.lists = JSON.parse(lists);

    const settings = localStorage.getItem(STORAGE.SETTINGS);
    if (settings) state.settings = { ...state.settings, ...JSON.parse(settings) };

    const goals = localStorage.getItem(STORAGE.GOALS);
    if (goals) state.goals = JSON.parse(goals);

    const habits = localStorage.getItem(STORAGE.HABITS);
    if (habits) state.habits = JSON.parse(habits);

    const streak = localStorage.getItem(STORAGE.STREAK);
    if (streak) state.streak = JSON.parse(streak);

    applySettings();
}

function saveData() {
    localStorage.setItem(STORAGE.TASKS, JSON.stringify(state.tasks));
    localStorage.setItem(STORAGE.LISTS, JSON.stringify(state.lists));
    localStorage.setItem(STORAGE.SETTINGS, JSON.stringify(state.settings));
    localStorage.setItem(STORAGE.GOALS, JSON.stringify(state.goals));
    localStorage.setItem(STORAGE.HABITS, JSON.stringify(state.habits));
    localStorage.setItem(STORAGE.STREAK, JSON.stringify(state.streak));
}

function applySettings() {
    document.body.dataset.theme = state.settings.theme;
    document.body.dataset.color = state.settings.color;

    // Update settings UI
    $$('.theme-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.theme === state.settings.theme);
    });
    $$('.color-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.color === state.settings.color);
    });

    const notifInput = $('#notificationsEnabled');
    const soundInput = $('#soundEnabled');
    if (notifInput) notifInput.checked = state.settings.notifications;
    if (soundInput) soundInput.checked = state.settings.sound;

    if ($('#pomoWorkTime')) $('#pomoWorkTime').value = state.settings.pomoWork;
    if ($('#pomoShortBreak')) $('#pomoShortBreak').value = state.settings.pomoShort;
    if ($('#pomoLongBreak')) $('#pomoLongBreak').value = state.settings.pomoLong;
    if ($('#dailyGoalInput')) $('#dailyGoalInput').value = state.settings.dailyGoal;
}

function renderAll() {
    renderLists();
    renderTasks();
    updateCounts();
    updateDailyProgress();
    updateStreak();
    renderEmojiPicker();
}

function updateTodayDate() {
    const today = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateStr = today.toLocaleDateString('uz-UZ', options);
    const el = $('#todayDate');
    if (el) el.textContent = dateStr;
}

// ============================================
// EVENT LISTENERS
// ============================================

function initEventListeners() {


    // Mobile menu
    $('#mobileMenuBtn')?.addEventListener('click', () => {
        $('#sidebar').classList.toggle('open');
        $('#sidebarOverlay').classList.toggle('active');
    });

    // Close sidebar when clicking overlay
    $('#sidebarOverlay')?.addEventListener('click', () => {
        $('#sidebar').classList.remove('open');
        $('#sidebarOverlay').classList.remove('active');
    });

    // Quick add
    $('#quickAddBtn')?.addEventListener('click', () => {
        $('#taskInput').focus();
    });

    // Keyboard Shortcuts (Ctrl + K)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            $('#taskInput')?.focus();
        }
        if (e.key === 'Escape') {
            closeAllModals();
            $('#sidebar').classList.remove('open');
            $('#sidebarOverlay').classList.remove('active');
        }
    });

    // Navigation
    $$('.nav-item[data-view]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            switchView(item.dataset.view);
        });
    });

    // Theme toggle
    $('#themeToggle')?.addEventListener('click', () => {
        state.settings.theme = state.settings.theme === 'light' ? 'dark' : 'light';
        applySettings();
        saveData();
    });

    // Settings button
    $('#settingsBtn')?.addEventListener('click', () => {
        $('#settingsModal').classList.add('open');
    });

    $('#closeSettings')?.addEventListener('click', () => {
        $('#settingsModal').classList.remove('open');
    });

    // Theme options in settings
    $$('.theme-option').forEach(opt => {
        opt.addEventListener('click', () => {
            state.settings.theme = opt.dataset.theme;
            applySettings();
            saveData();
        });
    });

    // Color options
    $$('.color-option').forEach(opt => {
        opt.addEventListener('click', () => {
            state.settings.color = opt.dataset.color;
            applySettings();
            saveData();
        });
    });

    // Notification toggle
    $('#notificationsEnabled')?.addEventListener('change', (e) => {
        if (e.target.checked) {
            requestNotificationPermission();
        }
        state.settings.notifications = e.target.checked;
        saveData();
    });

    // Sound toggle
    $('#soundEnabled')?.addEventListener('change', (e) => {
        state.settings.sound = e.target.checked;
        saveData();
    });

    // Pomodoro settings
    $('#pomoWorkTime')?.addEventListener('change', (e) => {
        state.settings.pomoWork = parseInt(e.target.value) || 25;
        saveData();
        resetPomodoro();
    });

    $('#pomoShortBreak')?.addEventListener('change', (e) => {
        state.settings.pomoShort = parseInt(e.target.value) || 5;
        saveData();
    });

    $('#pomoLongBreak')?.addEventListener('change', (e) => {
        state.settings.pomoLong = parseInt(e.target.value) || 15;
        saveData();
    });

    // Task input
    $('#taskInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            addTask(e.target.value.trim());
            e.target.value = '';
        }
    });



    // Task input buttons
    $('#taskPriorityBtn')?.addEventListener('click', () => $('#priorityModal').classList.add('open'));

    // Date, Repeat, Tag, Emoji and List picker buttons removed per user request


    // Modal backdrops
    $$('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', closeAllModals);
    });

    // Priority options
    $$('.priority-option').forEach(opt => {
        opt.addEventListener('click', () => {
            state.selectedPriority = opt.dataset.priority;
            updatePriorityDisplay();
            closeAllModals();
        });
    });

    // Repeat options
    $$('.repeat-option').forEach(opt => {
        opt.addEventListener('click', () => {
            state.selectedRepeat = opt.dataset.repeat;
            closeAllModals();
        });
    });

    // Date picker
    $('#prevMonth')?.addEventListener('click', () => navigateMonth(-1));
    $('#nextMonth')?.addEventListener('click', () => navigateMonth(1));
    $('#clearDate')?.addEventListener('click', () => {
        state.selectedDate = null;
        updateDateDisplay();
        closeAllModals();
    });
    $('#confirmDate')?.addEventListener('click', () => {
        updateDateDisplay();
        closeAllModals();
    });

    $$('.shortcut-btn').forEach(btn => {
        btn.addEventListener('click', () => setQuickDate(btn.dataset.date));
    });

    // Close detail panel
    $('#closeDetail')?.addEventListener('click', closeDetailPanel);

    // Section collapse
    $$('.section-header.collapsible').forEach(header => {
        header.addEventListener('click', () => {
            header.classList.toggle('collapsed');
            const list = header.nextElementSibling;
            list.style.display = header.classList.contains('collapsed') ? 'none' : 'flex';
        });
    });

    // Pomodoro
    initPomodoro();

    // Goals
    initGoals();

    // Calendar
    initCalendar();

    // Search with keyboard shortcut
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            $('#searchInput')?.focus();
        }
    });

    $('#searchInput')?.addEventListener('input', debounce((e) => {
        searchTasks(e.target.value);
    }, 300));
}

// ============================================
// VIEW SWITCHING
// ============================================

function switchView(view) {
    state.currentView = view;
    state.currentList = null;

    $$('.nav-item').forEach(item => item.classList.remove('active'));
    $(`.nav-item[data-view="${view}"]`)?.classList.add('active');

    const titles = {
        today: 'Bugun', upcoming: 'Kelasi kunlar',
        completed: 'Bajarilgan', calendar: 'Kalendar', pomodoro: 'Pomodoro',
        statistics: 'Statistika', goals: 'Maqsadlar', habits: 'Odatlar'
    };
    $('#pageTitle').textContent = titles[view] || 'Bugun';

    // Show/hide view panels
    $$('.view-panel').forEach(p => p.classList.remove('active'));

    if (['today', 'upcoming', 'completed'].includes(view)) {
        $('#tasksView').classList.add('active');
        renderTasks();
    } else if (view === 'calendar') {
        $('#calendarView').classList.add('active');
        renderCalendarView();
    } else if (view === 'pomodoro') {
        $('#pomodoroView').classList.add('active');
        updatePomodoroTaskSelect();
    } else if (view === 'statistics') {
        $('#statisticsView').classList.add('active');
        renderStatistics();
    } else if (view === 'goals') {
        $('#goalsView').classList.add('active');
        renderGoals();
    } else if (view === 'habits') {
        $('#habitsView').classList.add('active');
        renderHabits();
    }

    $('#sidebar').classList.remove('open');
    $('#sidebarOverlay').classList.remove('active');
}

// ============================================
// TASK MANAGEMENT
// ============================================

function addTask(title) {
    const task = {
        id: Date.now().toString(),
        title: title,
        completed: false,
        priority: state.selectedPriority,
        dueDate: state.selectedDate ? state.selectedDate.toISOString() : null,
        listId: state.selectedListId,
        tags: [...state.selectedTags],
        repeat: state.selectedRepeat,
        subtasks: [],
        notes: '',
        createdAt: new Date().toISOString()
    };

    state.tasks.unshift(task);
    saveData();
    renderAll();
    showToast('Vazifa qo\'shildi!', 'success');

    // Reset
    state.selectedPriority = 'none';
    state.selectedDate = new Date();
    state.selectedTags = [];
    state.selectedRepeat = 'none';
    updatePriorityDisplay();
    updateDateDisplay();
    $('#inputTagsPreview').style.display = 'none';
}

function toggleTask(taskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date().toISOString() : null;

    // Handle repeat
    if (task.completed && task.repeat !== 'none') {
        createRepeatTask(task);
    }

    saveData();
    renderAll();
    checkStreak();

    if (task.completed) {
        showToast('Vazifa bajarildi! 🎉', 'success');
        if (state.settings.sound) playSound('complete');

        // Premium Confetti Effect
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#6366F1', '#A855F7', '#10B981']
        });
    }
}

function createRepeatTask(originalTask) {
    let nextDate = new Date(originalTask.dueDate || new Date());

    switch (originalTask.repeat) {
        case 'daily': nextDate.setDate(nextDate.getDate() + 1); break;
        case 'weekly': nextDate.setDate(nextDate.getDate() + 7); break;
        case 'monthly': nextDate.setMonth(nextDate.getMonth() + 1); break;
    }

    const newTask = {
        ...originalTask,
        id: Date.now().toString(),
        completed: false,
        completedAt: null,
        dueDate: nextDate.toISOString(),
        createdAt: new Date().toISOString()
    };

    state.tasks.unshift(newTask);
}

function deleteTask(taskId) {
    const idx = state.tasks.findIndex(t => t.id === taskId);
    if (idx > -1) {
        const deleted = state.tasks.splice(idx, 1)[0];
        saveData();
        renderAll();
        closeDetailPanel();
        showToast('Vazifa o\'chirildi', 'info', true, () => {
            state.tasks.splice(idx, 0, deleted);
            saveData();
            renderAll();
        });
    }
}

function addSubtask(taskId, title) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    task.subtasks.push({
        id: Date.now().toString(),
        title: title,
        completed: false
    });

    saveData();
    openTaskDetail(taskId);
}

function toggleSubtask(taskId, subtaskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    const subtask = task.subtasks.find(s => s.id === subtaskId);
    if (subtask) {
        subtask.completed = !subtask.completed;
        saveData();
        openTaskDetail(taskId);
    }
}

// ============================================
// RENDERING
// ============================================

function renderTasks() {
    const tasks = getFilteredTasks();
    const groups = groupTasksByDate(tasks);

    // Odatlarni qo'shish
    let todayHabits = [];
    let completedHabits = [];

    if (['inbox', 'today'].includes(state.currentView)) {
        todayHabits = getTodayHabits();
    } else if (state.currentView === 'completed') {
        const todayStr = new Date().toDateString();
        completedHabits = state.habits.filter(h => h.completedDates.includes(todayStr));
    }

    renderTaskGroup('overdueSection', 'overdueList', 'overdueCount', groups.overdue);

    // Bugun bo'limini odatlar bilan birga chiqarish (yoki Completed bo'limini)
    const todaySection = $('#todaySection');
    const todayList = $('#todayList');
    const todayCount = $('#todaySectionCount');

    if (todaySection && todayList) {
        const showCompletedHabits = state.currentView === 'completed' && completedHabits.length > 0;
        const hasTodayItems = groups.today.length > 0 || todayHabits.length > 0 || showCompletedHabits;

        if (!hasTodayItems) {
            todaySection.style.display = 'none';
        } else {
            todaySection.style.display = 'block';

            // Sarlavhani 'Completed' bo'lsa o'zgartirish
            const sectionTitle = todaySection.querySelector('.section-title');
            if (state.currentView === 'completed') {
                if (sectionTitle) sectionTitle.textContent = 'Bajarilganlar';
            } else {
                if (sectionTitle) sectionTitle.textContent = 'Bugun';
            }

            const currentHabits = state.currentView === 'completed' ? completedHabits : todayHabits;
            if (todayCount) todayCount.textContent = groups.today.length + currentHabits.length;

            // Vazifalar HTML
            let html = groups.today.map(task => createTaskHTML(task)).join('');

            // Odatlar HTML
            if (currentHabits.length > 0) {
                const todayStr2 = new Date().toDateString();
                html += currentHabits.map(habit => {
                    const isCompleted = habit.completedDates.includes(todayStr2);
                    return `
                        <div class="task-item habit-task-item ${isCompleted ? 'completed' : ''}" data-habit-id="${habit.id}">
                            <div class="task-checkbox ${isCompleted ? 'checked' : ''}" style="border-color: ${habit.color};"></div>
                            <div class="task-content">
                                <span class="task-title">
                                    <span class="habit-emoji-mini">${habit.emoji}</span> ${escapeHtml(habit.name)}
                                    <span class="habit-badge-mini">Odat</span>
                                </span>
                                <div class="task-meta">
                                    <div class="task-streak-label">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
                                        ${habit.streak} kun streak
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }

            todayList.innerHTML = html;

            // Event listenerlar
            todayList.querySelectorAll('.task-item:not(.habit-task-item)').forEach(item => {
                const taskId = item.dataset.id;
                item.querySelector('.task-checkbox')?.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleTask(taskId);
                });
                item.addEventListener('click', () => openTaskDetail(taskId));
                item.querySelector('.task-action-btn.delete')?.addEventListener('click', (e) => {
                    e.stopPropagation();
                    deleteTask(taskId);
                });
            });

            todayList.querySelectorAll('.habit-task-item').forEach(item => {
                const habitId = item.dataset.habitId;
                item.querySelector('.task-checkbox')?.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleHabitToday(habitId);
                });
                item.addEventListener('click', () => {
                    switchView('habits');
                });
            });
        }
    }

    renderTaskGroup('upcomingSection', 'upcomingList', 'upcomingSectionCount', groups.upcoming);
    renderTaskGroup('noDateSection', 'noDateList', 'noDateCount', groups.noDate);

    const hasAny = Object.values(groups).some(g => g.length > 0) || todayHabits.length > 0 || completedHabits.length > 0;
    $('#emptyState')?.classList.toggle('active', !hasAny);
}

function getFilteredTasks() {
    let tasks = [...state.tasks];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (state.currentView) {
        case 'today':
            return tasks.filter(t => {
                if (!t.dueDate || t.completed) return false;
                const due = new Date(t.dueDate);
                due.setHours(0, 0, 0, 0);
                return due.getTime() === today.getTime();
            });
        case 'upcoming':
            return tasks.filter(t => {
                if (!t.dueDate || t.completed) return false;
                const due = new Date(t.dueDate);
                due.setHours(0, 0, 0, 0);
                return due.getTime() > today.getTime();
            });
        case 'completed': return tasks.filter(t => t.completed);
        case 'list': return tasks.filter(t => t.listId === state.currentList && !t.completed);
        default: return tasks.filter(t => !t.completed);
    }
}

function groupTasksByDate(tasks) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const groups = { overdue: [], today: [], upcoming: [], noDate: [] };

    tasks.forEach(task => {
        if (!task.dueDate) {
            groups.noDate.push(task);
        } else {
            const due = new Date(task.dueDate);
            due.setHours(0, 0, 0, 0);

            if (due < today) groups.overdue.push(task);
            else if (due.getTime() === today.getTime()) groups.today.push(task);
            else groups.upcoming.push(task);
        }
    });

    return groups;
}

function renderTaskGroup(sectionId, listId, countId, tasks) {
    const section = $(`#${sectionId}`);
    const list = $(`#${listId}`);
    const count = $(`#${countId}`);

    if (!section || !list) return;

    if (tasks.length === 0) {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';
    if (count) count.textContent = tasks.length;

    list.innerHTML = tasks.map(task => createTaskHTML(task)).join('');

    list.querySelectorAll('.task-item').forEach(item => {
        const taskId = item.dataset.id;

        item.querySelector('.task-checkbox')?.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleTask(taskId);
        });

        item.addEventListener('click', () => openTaskDetail(taskId));

        item.querySelector('.task-action-btn.delete')?.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTask(taskId);
        });
    });
}

function createTaskHTML(task) {
    const list = state.lists.find(l => l.id === task.listId);
    const priorityClass = task.priority !== 'none' ? `priority-${task.priority}` : '';
    const completedClass = task.completed ? 'completed' : '';
    const checkedClass = task.completed ? 'checked' : '';

    let dueDateHTML = '';
    if (task.dueDate) {
        const dueClass = getDueDateClass(task.dueDate);
        dueDateHTML = `<span class="task-due ${dueClass}">${formatDueDate(task.dueDate)}</span>`;
    }

    let tagsHTML = '';
    if (task.tags && task.tags.length > 0) {
        tagsHTML = `<div class="task-tags">${task.tags.map(t => `<span class="task-tag">${t}</span>`).join('')}</div>`;
    }

    let repeatIcon = '';
    if (task.repeat && task.repeat !== 'none') {
        repeatIcon = `<span class="task-repeat" title="Takrorlanadi: ${task.repeat}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 014-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>
        </span>`;
    }

    let subtaskInfo = '';
    if (task.subtasks && task.subtasks.length > 0) {
        const done = task.subtasks.filter(s => s.completed).length;
        subtaskInfo = `<span class="task-subtasks">${done}/${task.subtasks.length}</span>`;
    }

    return `
        <div class="task-item ${completedClass}" data-id="${task.id}">
            <div class="task-checkbox ${checkedClass} ${priorityClass}"></div>
            <div class="task-content">
                <div class="task-title">${escapeHtml(task.title)}</div>
                <div class="task-meta">
                    ${dueDateHTML}${repeatIcon}${subtaskInfo}${tagsHTML}
                </div>
            </div>
            <div class="task-actions">
                <button class="task-action-btn delete" title="O'chirish">🗑️</button>
            </div>
        </div>
    `;
}

function renderLists() {
    const container = $('#listsContainer');
    if (!container) return;

    container.innerHTML = state.lists.filter(l => l.id !== 'inbox').map(list => `
        <a href="#" class="nav-item list-item" data-list="${list.id}">
            <span class="list-color" style="background: ${list.color};"></span>
            <span class="nav-label">${list.name}</span>
            <span class="nav-count">${getListCount(list.id)}</span>
        </a>
    `).join('');

    container.querySelectorAll('.nav-item[data-list]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            state.currentView = 'list';
            state.currentList = item.dataset.list;
            $$('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            $('#pageTitle').textContent = state.lists.find(l => l.id === item.dataset.list)?.name || '';
            $$('.view-panel').forEach(p => p.classList.remove('active'));
            $('#tasksView').classList.add('active');
            renderTasks();
        });
    });
}

function getListCount(listId) {
    return state.tasks.filter(t => t.listId === listId && !t.completed).length;
}

// ============================================
// COUNTS & PROGRESS
// ============================================

function updateCounts() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    $('#inboxCount').textContent = state.tasks.filter(t => !t.completed).length;
    $('#todayCount').textContent = state.tasks.filter(t => {
        if (!t.dueDate || t.completed) return false;
        const due = new Date(t.dueDate);
        due.setHours(0, 0, 0, 0);
        return due.getTime() === today.getTime();
    }).length;
    $('#upcomingCount').textContent = state.tasks.filter(t => {
        if (!t.dueDate || t.completed) return false;
        const due = new Date(t.dueDate);
        due.setHours(0, 0, 0, 0);
        return due > today;
    }).length;
    $('#completedCount').textContent = state.tasks.filter(t => t.completed).length;
}

function updateDailyProgress() {
    const today = new Date().toDateString();
    const todayCompleted = state.tasks.filter(t =>
        t.completed && t.completedAt && new Date(t.completedAt).toDateString() === today
    ).length;

    const target = state.settings.dailyGoal;
    const percent = Math.min((todayCompleted / target) * 100, 100);

    $('#completedToday').textContent = todayCompleted;
    $('#totalToday').textContent = target;
    $('#progressFill').style.width = `${percent}%`;

    if ($('#dailyGoalCurrent')) $('#dailyGoalCurrent').textContent = todayCompleted;
    if ($('#dailyGoalTarget')) $('#dailyGoalTarget').textContent = target;
    if ($('#dailyGoalFill')) $('#dailyGoalFill').style.width = `${percent}%`;
}

// ============================================
// STREAK
// ============================================

function checkStreak() {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    const todayCompleted = state.tasks.filter(t =>
        t.completed && t.completedAt && new Date(t.completedAt).toDateString() === today
    ).length;

    if (todayCompleted > 0) {
        if (state.streak.lastDate === yesterday) {
            state.streak.count++;
        } else if (state.streak.lastDate !== today) {
            state.streak.count = 1;
        }
        state.streak.lastDate = today;
    }

    saveData();
    updateStreak();
}

function updateStreak() {
    $('#streakCount').textContent = state.streak.count;
}

// ============================================
// DETAIL PANEL
// ============================================

function openTaskDetail(taskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    state.selectedTask = task;

    const panel = $('#detailPanel');
    const content = $('#detailContent');
    const list = state.lists.find(l => l.id === task.listId);

    let subtasksHTML = '';
    if (task.subtasks && task.subtasks.length > 0) {
        subtasksHTML = task.subtasks.map(s => `
            <div class="subtask-item" data-id="${s.id}">
                <div class="subtask-checkbox ${s.completed ? 'checked' : ''}"></div>
                <span class="${s.completed ? 'completed' : ''}">${escapeHtml(s.title)}</span>
            </div>
        `).join('');
    }

    content.innerHTML = `
        <textarea class="detail-task-title" id="detailTitle">${escapeHtml(task.title)}</textarea>
        
        <div class="detail-section">
            <div class="detail-section-title">Tafsilotlar</div>
            <div class="detail-row">
                <span class="detail-row-icon">📅</span>
                <div class="detail-row-content">
                    <div class="detail-row-label">Sana</div>
                    <div class="detail-row-value">${task.dueDate ? formatDueDate(task.dueDate) : 'Belgilanmagan'}</div>
                </div>
            </div>
            <div class="detail-row">
                <span class="detail-row-icon">🚩</span>
                <div class="detail-row-content">
                    <div class="detail-row-label">Ustuvorlik</div>
                    <div class="detail-row-value">${getPriorityLabel(task.priority)}</div>
                </div>
            </div>
            <div class="detail-row">
                <span class="detail-row-icon">🔄</span>
                <div class="detail-row-content">
                    <div class="detail-row-label">Takrorlash</div>
                    <div class="detail-row-value">${getRepeatLabel(task.repeat)}</div>
                </div>
            </div>
            <div class="detail-row">
                <span class="list-color-small" style="background: ${list?.color || '#4A90E2'};"></span>
                <div class="detail-row-content">
                    <div class="detail-row-label">Ro'yxat</div>
                    <div class="detail-row-value">${list?.name || 'Inbox'}</div>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <div class="detail-section-title">Ichki vazifalar</div>
            <div class="subtasks-container">${subtasksHTML}</div>
            <div class="add-subtask" id="addSubtaskBtn">➕ Ichki vazifa qo'shish</div>
        </div>
        
        <div class="detail-section">
            <div class="detail-section-title">Eslatmalar</div>
            <textarea class="detail-notes" id="detailNotes" placeholder="Eslatma qo'shish...">${escapeHtml(task.notes || '')}</textarea>
        </div>
        
        <button class="detail-delete-btn" id="detailDeleteBtn">🗑️ Vazifani o'chirish</button>
    `;

    panel.classList.add('open');

    // Event listeners
    $('#detailTitle')?.addEventListener('input', debounce(() => {
        task.title = $('#detailTitle').value;
        saveData();
        renderTasks();
    }, 500));

    $('#detailNotes')?.addEventListener('input', debounce(() => {
        task.notes = $('#detailNotes').value;
        saveData();
    }, 500));

    $('#detailDeleteBtn')?.addEventListener('click', () => deleteTask(task.id));

    $('#addSubtaskBtn')?.addEventListener('click', () => {
        const title = prompt('Ichki vazifa nomi:');
        if (title) addSubtask(task.id, title);
    });

    content.querySelectorAll('.subtask-checkbox').forEach(cb => {
        cb.addEventListener('click', () => {
            const subtaskId = cb.closest('.subtask-item').dataset.id;
            toggleSubtask(task.id, subtaskId);
        });
    });
}

function closeDetailPanel() {
    $('#detailPanel').classList.remove('open');
    state.selectedTask = null;
}

// ============================================
// POMODORO
// ============================================

let pomodoroInterval = null;

function initPomodoro() {
    $$('.pomo-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            $$('.pomo-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            state.pomodoro.mode = tab.dataset.mode;
            resetPomodoro();
        });
    });

    $('#pomoStart')?.addEventListener('click', startPomodoro);
    $('#pomoPause')?.addEventListener('click', pausePomodoro);
    $('#pomoReset')?.addEventListener('click', resetPomodoro);

    resetPomodoro();
}

function startPomodoro() {
    state.pomodoro.isRunning = true;
    $('#pomoStart').style.display = 'none';
    $('#pomoPause').style.display = 'flex';

    pomodoroInterval = setInterval(() => {
        state.pomodoro.timeLeft--;
        state.pomodoro.totalTime++;
        updatePomodoroDisplay();

        if (state.pomodoro.timeLeft <= 0) {
            completePomodoro();
        }
    }, 1000);
}

function pausePomodoro() {
    state.pomodoro.isRunning = false;
    $('#pomoStart').style.display = 'flex';
    $('#pomoPause').style.display = 'none';
    clearInterval(pomodoroInterval);
}

function resetPomodoro() {
    clearInterval(pomodoroInterval);
    state.pomodoro.isRunning = false;

    const times = {
        work: state.settings.pomoWork * 60,
        short: state.settings.pomoShort * 60,
        long: state.settings.pomoLong * 60
    };

    state.pomodoro.timeLeft = times[state.pomodoro.mode];
    $('#pomoStart').style.display = 'flex';
    $('#pomoPause').style.display = 'none';

    updatePomodoroDisplay();
}

function completePomodoro() {
    pausePomodoro();
    state.pomodoro.completed++;
    $('#pomoCompleted').textContent = state.pomodoro.completed;

    if (state.settings.notifications) {
        new Notification('Pomodoro tugadi!', { body: 'Tanaffus vaqti!' });
    }
    if (state.settings.sound) playSound('pomodoro');

    showToast('Pomodoro bajarildi! 🍅', 'success');

    // Auto switch to break
    if (state.pomodoro.mode === 'work') {
        state.pomodoro.mode = state.pomodoro.completed % 4 === 0 ? 'long' : 'short';
        $$('.pomo-tab').forEach(t => t.classList.toggle('active', t.dataset.mode === state.pomodoro.mode));
    } else {
        state.pomodoro.mode = 'work';
        $$('.pomo-tab').forEach(t => t.classList.toggle('active', t.dataset.mode === 'work'));
    }

    resetPomodoro();
}

function updatePomodoroDisplay() {
    const mins = Math.floor(state.pomodoro.timeLeft / 60);
    const secs = state.pomodoro.timeLeft % 60;
    $('#timerTime').textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    const labels = { work: 'Ish vaqti', short: 'Qisqa tanaffus', long: 'Uzun tanaffus' };
    $('#timerLabel').textContent = labels[state.pomodoro.mode];

    // Progress circle
    const total = {
        work: state.settings.pomoWork * 60,
        short: state.settings.pomoShort * 60,
        long: state.settings.pomoLong * 60
    }[state.pomodoro.mode];

    const progress = (total - state.pomodoro.timeLeft) / total;
    const offset = 565 * (1 - progress);
    $('#timerProgress').style.strokeDashoffset = offset;

    // Total time
    const totalMins = Math.floor(state.pomodoro.totalTime / 60);
    $('#pomoTotalTime').textContent = totalMins > 0 ? `${totalMins}d` : `${state.pomodoro.totalTime}s`;
}

function updatePomodoroTaskSelect() {
    const select = $('#pomoTaskSelect');
    if (!select) return;

    const tasks = state.tasks.filter(t => !t.completed);
    select.innerHTML = '<option value="">Vazifa tanlang...</option>' +
        tasks.map(t => `<option value="${t.id}">${escapeHtml(t.title)}</option>`).join('');
}

// ============================================
// STATISTICS
// ============================================

function renderStatistics() {
    renderPulseChart();
    renderCompletionRing();
    renderHeatmap();
    updateStatsNumbers();
}

function renderPulseChart() {
    const canvas = $('#pulseChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const days = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];
    const data = getLast7DaysData();

    if (window.pulseChart) window.pulseChart.destroy();

    window.pulseChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: days,
            datasets: [{
                label: 'Bajarilgan',
                data: data,
                borderColor: getComputedStyle(document.body).getPropertyValue('--primary'),
                backgroundColor: 'rgba(74, 144, 226, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1 } }
            }
        }
    });
}

function getLast7DaysData() {
    const data = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();

        const count = state.tasks.filter(t =>
            t.completed && t.completedAt && new Date(t.completedAt).toDateString() === dateStr
        ).length;

        data.push(count);
    }
    return data;
}

function renderCompletionRing() {
    const completed = state.tasks.filter(t => t.completed).length;
    const total = state.tasks.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    $('#completionPercent').textContent = `${percent}%`;

    const ring = $('#completionRing');
    if (ring) {
        const offset = 251 * (1 - percent / 100);
        ring.style.strokeDashoffset = offset;
    }
}

function renderHeatmap() {
    const container = $('#heatmapContainer');
    if (!container) return;

    let html = '';
    for (let i = 27; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();

        const count = state.tasks.filter(t =>
            t.completed && t.completedAt && new Date(t.completedAt).toDateString() === dateStr
        ).length;

        let level = 0;
        if (count >= 1) level = 1;
        if (count >= 3) level = 2;
        if (count >= 5) level = 3;
        if (count >= 8) level = 4;

        html += `<div class="heatmap-day level-${level}" title="${date.toLocaleDateString()}: ${count} vazifa"></div>`;
    }

    container.innerHTML = html;
}

function updateStatsNumbers() {
    $('#statsTotalCompleted').textContent = state.tasks.filter(t => t.completed).length;
    $('#statsStreak').textContent = `${state.streak.count} kun`;

    const totalMins = Math.floor(state.pomodoro.totalTime / 60);
    $('#statsPomodoroTime').textContent = totalMins > 0 ? `${totalMins}d` : '0s';

    const last7 = getLast7DaysData();
    const avg = (last7.reduce((a, b) => a + b, 0) / 7).toFixed(1);
    $('#statsAvgDaily').textContent = avg;
}

// ============================================
// CALENDAR
// ============================================

function initCalendar() {
    $('#calPrevMonth')?.addEventListener('click', () => {
        state.calendarDate.setMonth(state.calendarDate.getMonth() - 1);
        renderCalendarView();
    });

    $('#calNextMonth')?.addEventListener('click', () => {
        state.calendarDate.setMonth(state.calendarDate.getMonth() + 1);
        renderCalendarView();
    });

    $('#calTodayBtn')?.addEventListener('click', () => {
        state.calendarDate = new Date();
        state.calendarSelectedDate = new Date();
        renderCalendarView();
    });
}

function renderCalendarView() {
    const year = state.calendarDate.getFullYear();
    const month = state.calendarDate.getMonth();

    const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
        'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];
    $('#calMonthTitle').textContent = `${months[month]} ${year}`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = (firstDay.getDay() + 6) % 7;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let html = '';

    // Previous month
    const prevLast = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
        html += `<div class="cal-day other-month"><span class="cal-day-number">${prevLast - i}</span></div>`;
    }

    // Current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month, day);
        date.setHours(0, 0, 0, 0);

        const isToday = date.getTime() === today.getTime();
        const isSelected = date.getTime() === state.calendarSelectedDate.setHours(0, 0, 0, 0);

        const dayTasks = state.tasks.filter(t => {
            if (!t.dueDate) return false;
            const due = new Date(t.dueDate);
            due.setHours(0, 0, 0, 0);
            return due.getTime() === date.getTime();
        });

        const dotsHTML = dayTasks.length > 0 ?
            `<div class="cal-day-dots">${dayTasks.slice(0, 3).map(() => '<div class="cal-dot"></div>').join('')}</div>` : '';

        html += `
            <div class="cal-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" data-date="${date.toISOString()}">
                <span class="cal-day-number">${day}</span>
                ${dotsHTML}
            </div>
        `;
    }

    $('#calDays').innerHTML = html;

    // Add click events
    $$('.cal-day:not(.other-month)').forEach(day => {
        day.addEventListener('click', () => {
            state.calendarSelectedDate = new Date(day.dataset.date);
            renderCalendarView();
            renderCalendarTasks();
        });
    });

    renderCalendarTasks();
}

function renderCalendarTasks() {
    const list = $('#calTasksList');
    if (!list) return;

    const selectedDate = state.calendarSelectedDate;
    selectedDate.setHours(0, 0, 0, 0);

    const tasks = state.tasks.filter(t => {
        if (!t.dueDate) return false;
        const due = new Date(t.dueDate);
        due.setHours(0, 0, 0, 0);
        return due.getTime() === selectedDate.getTime();
    });

    if (tasks.length === 0) {
        list.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 20px;">Bu kunda vazifa yo\'q</p>';
        return;
    }

    list.innerHTML = tasks.map(task => createTaskHTML(task)).join('');

    list.querySelectorAll('.task-item').forEach(item => {
        const taskId = item.dataset.id;
        item.querySelector('.task-checkbox')?.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleTask(taskId);
            renderCalendarView();
        });
        item.addEventListener('click', () => openTaskDetail(taskId));
    });
}

// ============================================
// GOALS
// ============================================

function initGoals() {
    $('#addGoalBtn')?.addEventListener('click', () => {
        $('#goalModal').classList.add('open');
    });

    $('#cancelGoal')?.addEventListener('click', () => {
        $('#goalModal').classList.remove('open');
    });

    $('#saveGoal')?.addEventListener('click', saveNewGoal);

    $('#goalDecrease')?.addEventListener('click', () => {
        const input = $('#dailyGoalInput');
        input.value = Math.max(1, parseInt(input.value) - 1);
        state.settings.dailyGoal = parseInt(input.value);
        saveData();
        updateDailyProgress();
    });

    $('#goalIncrease')?.addEventListener('click', () => {
        const input = $('#dailyGoalInput');
        input.value = Math.min(50, parseInt(input.value) + 1);
        state.settings.dailyGoal = parseInt(input.value);
        saveData();
        updateDailyProgress();
    });

    $('#dailyGoalInput')?.addEventListener('change', (e) => {
        state.settings.dailyGoal = parseInt(e.target.value) || 5;
        saveData();
        updateDailyProgress();
    });
}

function saveNewGoal() {
    const name = $('#goalNameInput').value.trim();
    const target = parseInt($('#goalTargetInput').value) || 10;
    const period = $('#goalPeriodInput').value;

    if (!name) {
        showToast('Maqsad nomini kiriting', 'error');
        return;
    }

    state.goals.push({
        id: Date.now().toString(),
        name: name,
        target: target,
        period: period,
        current: 0,
        createdAt: new Date().toISOString()
    });

    saveData();
    $('#goalModal').classList.remove('open');
    $('#goalNameInput').value = '';
    $('#goalTargetInput').value = '';
    renderGoals();
    showToast('Maqsad qo\'shildi!', 'success');
}

function renderGoals() {
    const list = $('#goalsList');
    if (!list) return;

    if (state.goals.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 40px;">Hali maqsad yo\'q</p>';
        return;
    }

    list.innerHTML = state.goals.map(goal => {
        const percent = Math.min((goal.current / goal.target) * 100, 100);
        const periods = { daily: 'Kunlik', weekly: 'Haftalik', monthly: 'Oylik' };

        return `
            <div class="goal-item">
                <div class="goal-card-header">
                    <span class="goal-icon">🎯</span>
                    <h3>${escapeHtml(goal.name)}</h3>
                    <span class="goal-period">${periods[goal.period]}</span>
                </div>
                <div class="goal-progress-section">
                    <div class="goal-progress-info">
                        <span>Progress</span>
                        <span>${goal.current}/${goal.target}</span>
                    </div>
                    <div class="goal-progress-bar">
                        <div class="goal-progress-fill" style="width: ${percent}%;"></div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// UTILITIES
// ============================================

function formatDueDate(dateStr) {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    date.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) return 'Bugun';
    if (date.getTime() === tomorrow.getTime()) return 'Ertaga';
    return date.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' });
}

function getDueDateClass(dateStr) {
    const date = new Date(dateStr);
    const today = new Date();
    date.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (date < today) return 'overdue';
    if (date.getTime() === today.getTime()) return 'today';
    return '';
}

function getPriorityLabel(p) {
    return { high: '🚩 Yuqori', medium: '🟡 O\'rta', low: '🔵 Past', none: '⚪ Yo\'q' }[p] || '⚪ Yo\'q';
}

function getRepeatLabel(r) {
    return { daily: '📅 Har kuni', weekly: '📆 Har hafta', monthly: '🗓️ Har oy', none: 'Takrorlanmaydi' }[r] || 'Takrorlanmaydi';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

function showToast(message, type = 'success', hasUndo = false, undoFn = null) {
    const toast = $('#toast');
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };

    toast.querySelector('.toast-icon').textContent = icons[type] || '✅';
    toast.querySelector('.toast-message').textContent = message;
    toast.classList.toggle('has-undo', hasUndo);

    if (hasUndo && undoFn) {
        $('#toastUndo').onclick = () => {
            undoFn();
            toast.classList.remove('show');
        };
    }

    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
}

function playSound(type) {
    // Simple beep using Web Audio API
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = type === 'complete' ? 800 : 600;
        gain.gain.value = 0.1;
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
    } catch (e) { }
}

function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// Date picker functions
function openDatePicker() {
    renderDatePicker();
    $('#datePickerModal').classList.add('open');
}

function renderDatePicker() {
    const year = state.calendarDate.getFullYear();
    const month = state.calendarDate.getMonth();

    const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
        'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];
    $('#currentMonth').textContent = `${months[month]} ${year}`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = (firstDay.getDay() + 6) % 7;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let html = '';

    const prevLast = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
        html += `<button class="day-btn other-month">${prevLast - i}</button>`;
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month, day);
        date.setHours(0, 0, 0, 0);

        let cls = 'day-btn';
        if (date.getTime() === today.getTime()) cls += ' today';
        if (state.selectedDate && date.getTime() === new Date(state.selectedDate).setHours(0, 0, 0, 0)) {
            cls += ' selected';
        }

        html += `<button class="${cls}" data-date="${date.toISOString()}">${day}</button>`;
    }

    $('#calendarDays').innerHTML = html;

    $$('#calendarDays .day-btn:not(.other-month)').forEach(btn => {
        btn.addEventListener('click', () => {
            state.selectedDate = new Date(btn.dataset.date);
            renderDatePicker();
        });
    });
}

function navigateMonth(dir) {
    state.calendarDate.setMonth(state.calendarDate.getMonth() + dir);
    renderDatePicker();
}

function setQuickDate(type) {
    const today = new Date();
    if (type === 'today') state.selectedDate = today;
    else if (type === 'tomorrow') state.selectedDate = new Date(today.setDate(today.getDate() + 1));
    else if (type === 'next-week') state.selectedDate = new Date(today.setDate(today.getDate() + 7));

    updateDateDisplay();
    closeAllModals();
}

function updateDateDisplay() {
    const btn = $('#selectedDate');
    if (btn) btn.textContent = state.selectedDate ? formatDueDate(state.selectedDate) : 'Sana';
}

function updatePriorityDisplay() {
    const btn = $('#taskPriorityBtn');
    btn.className = 'task-input-priority';
    if (state.selectedPriority !== 'none') btn.classList.add(state.selectedPriority);
}

function openListPicker() {
    const content = $('#listPickerContent');
    content.innerHTML = state.lists.map(l => `
        <div class="list-option" data-id="${l.id}">
            <span class="list-color" style="background: ${l.color};"></span>
            <span>${l.name}</span>
        </div>
    `).join('');

    content.querySelectorAll('.list-option').forEach(opt => {
        opt.addEventListener('click', () => {
            state.selectedListId = opt.dataset.id;
            const list = state.lists.find(l => l.id === opt.dataset.id);
            const label = $('#selectedList');
            const color = $('#selectedListColor');
            if (label) label.textContent = list?.name || 'Inbox';
            if (color) color.style.background = list?.color || '#4A90E2';
            closeAllModals();
        });
    });

    $('#listModal').classList.add('open');
}

function renderEmojiPicker() {
    const grid = $('#emojiGrid');
    if (!grid) return;

    grid.innerHTML = EMOJIS.map(e => `<button class="emoji-btn">${e}</button>`).join('');

    grid.querySelectorAll('.emoji-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = $('#taskInput');
            input.value += btn.textContent;
            input.focus();
            closeAllModals();
        });
    });
}

function closeAllModals() {
    $$('.modal').forEach(m => m.classList.remove('open'));
}

function searchTasks(query) {
    if (!query.trim()) {
        renderTasks();
        return;
    }

    const filtered = state.tasks.filter(t =>
        t.title.toLowerCase().includes(query.toLowerCase()) && !t.completed
    );

    const groups = groupTasksByDate(filtered);
    renderTaskGroup('overdueSection', 'overdueList', 'overdueCount', groups.overdue);
    renderTaskGroup('todaySection', 'todayList', 'todaySectionCount', groups.today);
    renderTaskGroup('upcomingSection', 'upcomingList', 'upcomingSectionCount', groups.upcoming);
    renderTaskGroup('noDateSection', 'noDateList', 'noDateCount', groups.noDate);

    const hasAny = Object.values(groups).some(g => g.length > 0);
    $('#emptyState')?.classList.toggle('active', !hasAny);
}

// ============================================
// CUSTOM CURSOR EFFECTS
// ============================================

function initCustomCursor() {
    // Only on desktop
    if (window.innerWidth < 769 || 'ontouchstart' in window) return;

    // Create cursor elements
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    // Mouse move handler
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Dot follows immediately
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    // Smooth glow animation
    function animateGlow() {
        glowX += (mouseX - glowX) * 0.15;
        glowY += (mouseY - glowY) * 0.15;

        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';

        requestAnimationFrame(animateGlow);
    }
    animateGlow();

    // Hover effects
    const interactiveElements = 'a, button, input, select, textarea, .task-item, .nav-item, .task-checkbox, .cal-day, .emoji-btn';

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactiveElements)) {
            cursorGlow.classList.add('hover');
            cursorDot.classList.add('hover');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactiveElements)) {
            cursorGlow.classList.remove('hover');
            cursorDot.classList.remove('hover');
        }
    });

    // Click ripple effect
    document.addEventListener('click', (e) => {
        createRipple(e.clientX, e.clientY);

        // Click animation
        cursorGlow.classList.add('click');
        setTimeout(() => cursorGlow.classList.remove('click'), 150);
    });

    // Magnetic buttons
    initMagneticButtons();
}

function createRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.width = '50px';
    ripple.style.height = '50px';

    document.body.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

function initMagneticButtons() {
    const buttons = document.querySelectorAll('.quick-add-btn, .task-submit-btn, .pomo-start, .add-goal-btn, .theme-toggle');

    buttons.forEach(button => {
        button.classList.add('magnetic-btn');

        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });

    // Interactive highlight effect
    document.querySelectorAll('.task-item, .nav-item').forEach(el => {
        el.classList.add('cursor-interactive');

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            el.style.setProperty('--mouse-x', x + '%');
            el.style.setProperty('--mouse-y', y + '%');
        });
    });
}

// ============================================
// HABITS SYSTEM
// ============================================

function initHabits() {
    // Add habit button
    $('#addHabitBtn')?.addEventListener('click', () => {
        $('#habitModal').classList.add('open');
        resetHabitForm();
    });

    // Close habit modal
    $('#closeHabit')?.addEventListener('click', () => {
        $('#habitModal').classList.remove('open');
    });

    $('#cancelHabit')?.addEventListener('click', () => {
        $('#habitModal').classList.remove('open');
    });

    // Save habit
    $('#saveHabit')?.addEventListener('click', saveNewHabit);

    // Emoji picker
    $$('.habit-emoji-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('.habit-emoji-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });

    // Color picker
    $$('.habit-color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('.habit-color-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });

    // Frequency change
    $$('input[name="habitFrequency"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const customDays = $('#habitCustomDays');
            customDays.style.display = e.target.value === 'custom' ? 'flex' : 'none';
        });
    });
}

function resetHabitForm() {
    $('#habitNameInput').value = '';
    $$('.habit-emoji-btn').forEach(b => b.classList.remove('selected'));
    $('.habit-emoji-btn[data-emoji="📚"]').classList.add('selected');
    $$('.habit-color-btn').forEach(b => b.classList.remove('selected'));
    $('.habit-color-btn[data-color="#4A90E2"]').classList.add('selected');
    $('#habitDurationInput').value = '30';
    $('input[name="habitFrequency"][value="daily"]').checked = true;
    $('#habitCustomDays').style.display = 'none';
    $('#habitReminderTime').value = '09:00';
}

function saveNewHabit() {
    const name = $('#habitNameInput').value.trim();
    if (!name) {
        showToast('Odat nomini kiriting', 'error');
        return;
    }

    const emoji = $('.habit-emoji-btn.selected')?.dataset.emoji || '📚';
    const color = $('.habit-color-btn.selected')?.dataset.color || '#4A90E2';
    const duration = parseInt($('#habitDurationInput').value) || 30;
    const frequency = $('input[name="habitFrequency"]:checked').value;
    const reminderTime = $('#habitReminderTime').value;

    // Get custom days if selected
    let customDays = [];
    if (frequency === 'custom') {
        $$('#habitCustomDays input:checked').forEach(cb => {
            customDays.push(parseInt(cb.value));
        });
    }

    const habit = {
        id: Date.now().toString(),
        name: name,
        emoji: emoji,
        color: color,
        duration: duration,
        frequency: frequency,
        customDays: customDays,
        reminderTime: reminderTime,
        streak: 0,
        longestStreak: 0,
        completedDates: [],
        createdAt: new Date().toISOString(),
        endDate: duration > 0 ? new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString() : null
    };

    state.habits.push(habit);
    saveData();
    $('#habitModal').classList.remove('open');
    renderHabits();
    showToast('Odat qo\'shildi! 🎉', 'success');
}

function renderHabits() {
    renderTodayHabits();
    renderAllHabits();
    updateHabitsStats();
    updateHabitsCount();

    // Agar Inbox yoki Bugun bo'limida bo'lsak, ularni ham yangilash (chunki u yerda ham odatlar chiqyapti)
    if (['inbox', 'today'].includes(state.currentView)) {
        renderTasks();
    }
}

function renderTodayHabits() {
    const list = $('#habitsTodayList');
    if (!list) return;

    const todayHabits = getTodayHabits();

    if (todayHabits.length === 0) {
        list.innerHTML = `
            <div class="habits-empty">
                <div class="habits-empty-icon">🌟</div>
                <h3>Bugun uchun odat yo'q</h3>
                <p>Yangi odat qo'shib, har kungi rutiningizni shakllantiring</p>
            </div>
        `;
        return;
    }

    const today = new Date().toDateString();

    list.innerHTML = todayHabits.map(habit => {
        const isCompletedToday = habit.completedDates.includes(today);
        const daysRemaining = getDaysRemaining(habit);
        const progress = getHabitProgress(habit);

        return `
            <div class="habit-card ${isCompletedToday ? 'completed' : ''}" data-id="${habit.id}">
                <div class="habit-checkbox ${isCompletedToday ? 'checked' : ''}" style="border-color: ${habit.color};"></div>
                <div class="habit-icon" style="background: ${habit.color}20;">
                    ${habit.emoji}
                </div>
                <div class="habit-content">
                    <div class="habit-name">${escapeHtml(habit.name)}</div>
                    <div class="habit-meta">
                        <span class="habit-streak">🔥 ${habit.streak} kun</span>
                        <div class="habit-progress-mini">
                            <div class="habit-progress-bar-mini">
                                <div class="habit-progress-fill-mini" style="width: ${progress}%; background: ${habit.color};"></div>
                            </div>
                            <span>${progress}%</span>
                        </div>
                        ${daysRemaining !== null ? `<span class="habit-days-remaining">${daysRemaining} kun qoldi</span>` : ''}
                    </div>
                </div>
                <div class="habit-week">
                    ${renderHabitWeek(habit)}
                </div>
            </div>
        `;
    }).join('');

    // Add event listeners
    list.querySelectorAll('.habit-checkbox').forEach(checkbox => {
        checkbox.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = checkbox.closest('.habit-card');
            toggleHabitToday(card.dataset.id);
        });
    });
}

function renderAllHabits() {
    const list = $('#habitsList');
    if (!list) return;

    $('#allHabitsCount').textContent = state.habits.length;

    if (state.habits.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 20px;">Hali odat yo\'q</p>';
        return;
    }

    list.innerHTML = state.habits.map(habit => {
        const progress = getHabitProgress(habit);
        const daysRemaining = getDaysRemaining(habit);

        return `
            <div class="habit-card" data-id="${habit.id}">
                <div class="habit-icon" style="background: ${habit.color}20;">
                    ${habit.emoji}
                </div>
                <div class="habit-content">
                    <div class="habit-name">${escapeHtml(habit.name)}</div>
                    <div class="habit-meta">
                        <span class="habit-streak">🔥 ${habit.streak} kun streak</span>
                        <span>📅 ${habit.completedDates.length} kun bajarildi</span>
                        ${daysRemaining !== null ? `<span>${daysRemaining} kun qoldi</span>` : '<span>Cheksiz</span>'}
                    </div>
                </div>
                <div class="habit-progress-mini">
                    <div class="habit-progress-bar-mini" style="width: 100px;">
                        <div class="habit-progress-fill-mini" style="width: ${progress}%; background: ${habit.color};"></div>
                    </div>
                    <span>${progress}%</span>
                </div>
                <button class="task-action-btn delete" onclick="deleteHabit('${habit.id}')">🗑️</button>
            </div>
        `;
    }).join('');
}

function renderHabitWeek(habit) {
    const days = ['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh'];
    const today = new Date();
    let html = '';

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();
        const dayIndex = date.getDay();

        const isCompleted = habit.completedDates.includes(dateStr);
        const isToday = i === 0;
        const shouldDo = shouldDoHabitOnDay(habit, date);
        const isMissed = !isCompleted && !isToday && shouldDo;

        html += `<div class="habit-day-dot ${isCompleted ? 'completed' : ''} ${isMissed ? 'missed' : ''} ${isToday ? 'today' : ''}">${days[dayIndex]}</div>`;
    }

    return html;
}

function getTodayHabits() {
    const today = new Date();
    return state.habits.filter(habit => {
        // Check if habit is still active
        if (habit.endDate && new Date(habit.endDate) < today) {
            return false;
        }
        return shouldDoHabitOnDay(habit, today);
    });
}

function shouldDoHabitOnDay(habit, date) {
    const dayOfWeek = date.getDay();

    switch (habit.frequency) {
        case 'daily':
            return true;
        case 'weekdays':
            return dayOfWeek >= 1 && dayOfWeek <= 5;
        case 'weekends':
            return dayOfWeek === 0 || dayOfWeek === 6;
        case 'custom':
            return habit.customDays.includes(dayOfWeek);
        default:
            return true;
    }
}

function toggleHabitToday(habitId) {
    const habit = state.habits.find(h => h.id === habitId);
    if (!habit) return;

    const today = new Date().toDateString();
    const index = habit.completedDates.indexOf(today);

    if (index > -1) {
        // Uncomplete
        habit.completedDates.splice(index, 1);
        habit.streak = Math.max(0, habit.streak - 1);
    } else {
        // Complete
        habit.completedDates.push(today);
        habit.streak++;
        if (habit.streak > habit.longestStreak) {
            habit.longestStreak = habit.streak;
        }
        showToast(`${habit.emoji} ${habit.name} bajarildi!`, 'success');
        if (state.settings.sound) playSound('complete');
    }

    saveData();
    renderHabits();
}

function deleteHabit(habitId) {
    const index = state.habits.findIndex(h => h.id === habitId);
    if (index > -1) {
        state.habits.splice(index, 1);
        saveData();
        renderHabits();
        showToast('Odat o\'chirildi', 'info');
    }
}

function getHabitProgress(habit) {
    if (habit.duration === 0) {
        // Infinite habit - calculate based on last 30 days
        return Math.round((habit.completedDates.length / 30) * 100);
    }

    const totalDays = habit.duration;
    const completedDays = habit.completedDates.length;
    return Math.min(100, Math.round((completedDays / totalDays) * 100));
}

function getDaysRemaining(habit) {
    if (!habit.endDate || habit.duration === 0) return null;

    const end = new Date(habit.endDate);
    const today = new Date();
    const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
}

function updateHabitsStats() {
    const todayHabits = getTodayHabits();
    const today = new Date().toDateString();
    const completedToday = todayHabits.filter(h => h.completedDates.includes(today)).length;

    $('#habitsTodayCompleted').textContent = `${completedToday}/${todayHabits.length}`;

    const longestStreak = state.habits.reduce((max, h) => Math.max(max, h.longestStreak), 0);
    $('#habitsActiveStreak').textContent = longestStreak;

    const totalCompletions = state.habits.reduce((sum, h) => sum + h.completedDates.length, 0);
    const totalPossible = state.habits.reduce((sum, h) => sum + h.duration, 0) || 1;
    const completionRate = Math.round((totalCompletions / totalPossible) * 100);
    $('#habitsCompletionRate').textContent = `${Math.min(100, completionRate)}%`;
}

function updateHabitsCount() {
    const today = new Date().toDateString();
    const activeHabits = getTodayHabits().filter(h => !h.completedDates.includes(today)).length;
    $('#habitsCount').textContent = activeHabits;
}
