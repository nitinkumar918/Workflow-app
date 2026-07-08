/**
 * Analytics Engine using Chart.js Integrations
 */
export class AnalyticsEngine {
    constructor() {
        this.categoryChart = null;
    }

    initCategoryChart(canvasId, categoryData) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        if (this.categoryChart) {
            this.categoryChart.destroy();
        }

        this.categoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(categoryData),
                datasets: [{
                    data: Object.values(categoryData),
                    backgroundColor: ['#7C3AED', '#3B82F6', '#22C55E', '#F59E0B', '#EF4444']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#F8FAFC' } }
                }
            }
        });
    }
}