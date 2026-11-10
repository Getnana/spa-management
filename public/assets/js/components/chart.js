const chart = {
    instances: {},

    destroy(id) {
        if (this.instances[id]) {
            this.instances[id].destroy();
            delete this.instances[id];
        }
    },

    line(id, labels, datasets, options = {}) {
        this.destroy(id);
        const ctx = document.getElementById(id);
        if (!ctx) return;
        this.instances[id] = new Chart(ctx, {
            type: 'line',
            data: { labels, datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: datasets.length > 1 } },
                scales: { y: { beginAtZero: true } },
                ...options,
            }
        });
    },

    bar(id, labels, datasets, options = {}) {
        this.destroy(id);
        const ctx = document.getElementById(id);
        if (!ctx) return;
        this.instances[id] = new Chart(ctx, {
            type: 'bar',
            data: { labels, datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: datasets.length > 1 } },
                scales: { y: { beginAtZero: true } },
                ...options,
            }
        });
    },

    pie(id, labels, data, colors = null) {
        this.destroy(id);
        const ctx = document.getElementById(id);
        if (!ctx) return;
        this.instances[id] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: colors || [
                        '#A4AA26', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'
                    ],
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
            }
        });
    }
};
