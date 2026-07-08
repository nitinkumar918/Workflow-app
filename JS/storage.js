/**
 * Offline Persistence Engine: Handles LocalStorage & IndexedDB Syncing
 */
const STORAGE_KEY_TASKS = 'taskflow_tasks_v1';
const DB_NAME = 'TaskFlowDB';
const DB_VERSION = 1;

class StorageEngine {
    constructor() {
        this.db = null;
        this.initIndexedDB();
    }

    // LocalStorage Fallback API
    getLocalTasks() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY_TASKS) || '[]');
    }

    saveLocalTasks(tasks) {
        localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
        this.syncToIndexedDB(tasks);
    }

    // IndexedDB Implementation for Large Payload Persistence
    initIndexedDB() {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('tasks')) {
                db.createObjectStore('tasks', { keyPath: 'id' });
            }
        };
        request.onsuccess = (e) => { this.db = e.target.result; };
        request.onerror = (e) => { console.error("IndexedDB initialization failed", e); };
    }

    syncToIndexedDB(tasks) {
        if (!this.db) return;
        const tx = this.db.transaction('tasks', 'readwrite');
        const store = tx.objectStore('tasks');
        store.clear();
        tasks.forEach(task => store.put(task));
    }
}

export const storage = new StorageEngine();