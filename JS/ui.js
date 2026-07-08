/**
 * Dynamic User Interface Render Engine
 */
export class UIRenderer {
    static renderTaskList(tasks, containerElement) {
        containerElement.innerHTML = '';

        if (tasks.length === 0) {
            containerElement.innerHTML = `
                <div class="empty-state">
                    <p style="text-align: center; color: var(--text-muted); padding: 32px;">
                        No tasks found. Click "New Task" to create one.
                    </p>
                </div>`;
            return;
        }

        tasks.forEach(task => {
            const taskCard = document.createElement('div');
            taskCard.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskCard.dataset.id = task.id;

            taskCard.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px;">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <div>
                        <div class="task-title" style="font-weight: 500;">${this.escapeHTML(task.title)}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">
                            <span><i class="fa-solid fa-tag"></i> ${task.category}</span> • 
                            <span><i class="fa-solid fa-calendar"></i> ${task.dueDate || 'No date'}</span>
                        </div>
                    </div>
                </div>
                <div class="task-actions" style="display: flex; gap: 8px;">
                    <button class="icon-btn edit-task-btn" title="Edit"><i class="fa-solid fa-pen"></i></button>
                    <button class="icon-btn delete-task-btn danger" title="Delete"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            containerElement.appendChild(taskCard);
        });
    }

    static updateDashboardMetrics(stats) {
        document.getElementById('stat-total').innerText = stats.total;
        document.getElementById('stat-completed').innerText = stats.completed;
        document.getElementById('stat-pending').innerText = stats.pending;
        document.getElementById('stat-overdue').innerText = stats.overdue;
        
        // XP Calculation Bar
        const xpProgress = (stats.xp % 100);
        document.getElementById('xp-progress-bar').style.width = `${xpProgress}%`;
        document.getElementById('xp-text').innerText = `${xpProgress} / 100 XP`;
    }

    static escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }
}