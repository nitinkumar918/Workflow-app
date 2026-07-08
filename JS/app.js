/**
 * Main Application Orchestrator
 */
import { storage } from './storage.js';
import { AuthManager } from './auth.js';
import { UIRenderer } from './ui.js';
import { AnalyticsEngine } from './analytics.js';
import { PomodoroTimer } from './pomodoro.js';

class TaskFlowApp {
    constructor() {
        this.tasks = storage.getLocalTasks();
        this.userXP = 0;
        this.auth = new AuthManager(this.handleAuthChange.bind(this));
        this.analytics = new AnalyticsEngine();
        
        this.initUI();
        this.bindEvents();
        this.refreshState();
    }

    initUI() {
        // Pomodoro Timer Setup
        const timerDisplay = document.getElementById('timer-display');
        this.timer = new PomodoroTimer(timerDisplay, () => {
            alert('Focus session complete! Take a break.');
            this.addXP(25);
        });

        // Set Date Greeting
        document.getElementById('current-date-display').innerText = new Date().toLocaleDateString('en-US', {
            weekday: 'long', month: 'short', day: 'numeric', year: 'numeric'
        });
    }

    bindEvents() {
        // Navigation View Switcher
        document.querySelectorAll('.sidebar-nav .nav-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.sidebar-nav .nav-item').forEach(i => i.classList.remove('active'));
                document.querySelectorAll('.app-view').forEach(v => v.classList.remove('active'));
                
                btn.classList.add('active');
                const targetView = btn.dataset.view;
                document.getElementById(`view-${targetView}`).classList.add('active');
            });
        });

        // Modal Controls
        const modal = document.getElementById('task-modal');
        document.getElementById('quick-add-task-btn').addEventListener('click', () => {
            document.getElementById('task-form').reset();
            document.getElementById('task-id').value = '';
            modal.classList.add('active');
        });

        document.getElementById('close-modal-btn').addEventListener('click', () => modal.classList.remove('active'));
        document.getElementById('cancel-task-btn').addEventListener('click', () => modal.classList.remove('active'));

        // Task Form Submit
        document.getElementById('task-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTask();
            modal.classList.remove('active');
        });

        // Main Task List Event Delegation (Check/Delete/Edit)
        const taskContainer = document.getElementById('main-task-list');
        taskContainer.addEventListener('click', (e) => {
            const taskCard = e.target.closest('.task-item');
            if (!taskCard) return;
            const taskId = taskCard.dataset.id;

            if (e.target.classList.contains('task-checkbox')) {
                this.toggleTaskComplete(taskId);
            } else if (e.target.closest('.delete-task-btn')) {
                this.deleteTask(taskId);
            }
        });

        // Focus Timer Controls
        document.getElementById('timer-start-btn').addEventListener('click', () => this.timer.start());
        document.getElementById('timer-pause-btn').addEventListener('click', () => this.timer.pause());
        document.getElementById('timer-reset-btn').addEventListener('click', () => this.timer.reset());

        // Dark/Light Theme Switcher
        document.getElementById('theme-toggle').addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', nextTheme);
        });
    }

    saveTask() {
        const id = document.getElementById('task-id').value || Date.now().toString();
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-description').value;
        const category = document.getElementById('task-category').value;
        const priority = document.getElementById('task-priority').value;
        const dueDate = document.getElementById('task-due-date').value;

        const existingIdx = this.tasks.findIndex(t => t.id === id);
        const taskData = {
            id, title, description, category, priority, dueDate,
            completed: existingIdx > -1 ? this.tasks[existingIdx].completed : false,
            createdAt: new Date().toISOString()
        };

        if (existingIdx > -1) {
            this.tasks[existingIdx] = taskData;
        } else {
            this.tasks.push(taskData);
        }

        storage.saveLocalTasks(this.tasks);
        this.refreshState();
    }

    toggleTaskComplete(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            if (task.completed) {
                this.addXP(10);
                this.triggerConfetti();
            }
            storage.saveLocalTasks(this.tasks);
            this.refreshState();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        storage.saveLocalTasks(this.tasks);
        this.refreshState();
    }

    addXP(amount) {
        this.userXP += amount;
        this.refreshState();
    }

    triggerConfetti() {
        if (typeof confetti === 'function') {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
    }

    handleAuthChange(user) {
        if (user) {
            document.getElementById('user-display-name').innerText = user.displayName || 'User';
            if (user.photoURL) document.getElementById('user-avatar').src = user.photoURL;
        }
    }

    refreshState() {
        const stats = {
            total: this.tasks.length,
            completed: this.tasks.filter(t => t.completed).length,
            pending: this.tasks.filter(t => !t.completed).length,
            overdue: this.tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length,
            xp: this.userXP
        };

        UIRenderer.renderTaskList(this.tasks, document.getElementById('main-task-list'));
        UIRenderer.updateDashboardMetrics(stats);

        // Chart Updates
        const categoryCounts = this.tasks.reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + 1;
            return acc;
        }, {});
        
        if (Object.keys(categoryCounts).length > 0) {
            this.analytics.initCategoryChart('category-chart', categoryCounts);
        }
    }
}

// Application Lifecycle Bootstrap
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TaskFlowApp();
});
