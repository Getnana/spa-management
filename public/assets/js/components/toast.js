const toast = {
    show(message, type = 'success', duration = 3000) {
        const container = document.getElementById('toast-container');
        const colors = {
            success: 'bg-primary-500',
            error: 'bg-red-600',
            warning: 'bg-yellow-500',
            info: 'bg-blue-600',
        };
        const icons = {
            success: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>',
            error: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
            warning: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
            info: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
        };

        const el = document.createElement('div');
        el.className = `${colors[type]} text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 transform translate-x-full transition-transform duration-300 w-full md:max-w-sm`;
        el.innerHTML = `${icons[type]}<span class="text-sm font-medium">${message}</span>`;
        container.appendChild(el);

        requestAnimationFrame(() => el.classList.remove('translate-x-full'));

        setTimeout(() => {
            el.classList.add('translate-x-full');
            setTimeout(() => el.remove(), 300);
        }, duration);
    },

    success(msg) { toast.show(msg, 'success'); },
    error(msg) { toast.show(msg, 'error'); },
    warning(msg) { toast.show(msg, 'warning'); },
    info(msg) { toast.show(msg, 'info'); },
};
