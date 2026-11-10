const skeleton = {
    bar(widthClass = 'w-full', heightClass = 'h-4', extraClass = '') {
        return `<div class="skeleton-pulse ${widthClass} ${heightClass} ${extraClass} rounded-lg"></div>`;
    },

    circle(sizeClass = 'w-10 h-10', extraClass = '') {
        return `<div class="skeleton-pulse ${sizeClass} ${extraClass} rounded-full"></div>`;
    },

    kpiCard() {
        return `
            <div class="bg-white rounded-2xl shadow-sm p-4 border-l-4 border-gray-200">
                <div class="flex items-center gap-3">
                    <div class="skeleton-pulse w-10 h-10 rounded-full flex-shrink-0"></div>
                    <div class="min-w-0 flex-1">
                        <div class="skeleton-pulse w-24 h-6 rounded-lg mb-2"></div>
                        <div class="skeleton-pulse w-16 h-3 rounded-lg"></div>
                    </div>
                </div>
            </div>`;
    },

    dashboard(kpiCount = 6) {
        const kpis = Array(kpiCount).fill(this.kpiCard()).join('');
        return `
            <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">${kpis}</div>
            <div class="bg-white rounded-2xl shadow-sm p-5 mb-6">
                <div class="skeleton-pulse w-48 h-5 rounded-lg mb-4"></div>
                <div class="skeleton-pulse w-full h-48 rounded-xl"></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white rounded-2xl shadow-sm p-5">
                    <div class="skeleton-pulse w-40 h-5 rounded-lg mb-4"></div>
                    <div class="skeleton-pulse w-full h-52 rounded-xl"></div>
                </div>
                <div class="bg-white rounded-2xl shadow-sm p-5">
                    <div class="skeleton-pulse w-36 h-5 rounded-lg mb-4"></div>
                    <div class="skeleton-pulse w-full h-52 rounded-xl"></div>
                </div>
            </div>`;
    },

    tableRow(colCount = 5) {
        const widths = ['w-24', 'w-32', 'w-20', 'w-16', 'w-28', 'w-20', 'w-36', 'w-24'];
        const cells = Array.from({ length: colCount }, (_, i) =>
            `<td class="px-4 py-3"><div class="skeleton-pulse ${widths[i % widths.length]} h-4 rounded-lg"></div></td>`
        ).join('');
        return `<tr>${cells}</tr>`;
    },

    table(colCount = 5, rowCount = 5) {
        const headerCells = Array(colCount).fill(
            '<th class="px-4 py-3"><div class="skeleton-pulse w-16 h-3 rounded-lg"></div></th>'
        ).join('');
        const rows = Array(rowCount).fill(this.tableRow(colCount)).join('');
        return `
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 border-b border-gray-200"><tr>${headerCells}</tr></thead>
                    <tbody class="divide-y divide-gray-100">${rows}</tbody>
                </table>
            </div>`;
    },

    detail(fieldCount = 6) {
        const fields = Array(fieldCount).fill(`
                <div>
                    <div class="skeleton-pulse w-20 h-3 rounded-lg mb-2"></div>
                    <div class="skeleton-pulse w-28 h-4 rounded-lg"></div>
                </div>`).join('');
        return `
            <div class="mb-6">
                <div class="skeleton-pulse w-24 h-4 rounded-lg mb-2"></div>
                <div class="skeleton-pulse w-48 h-7 rounded-lg"></div>
            </div>
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">${fields}</div>
            </div>
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div class="border-b border-gray-100 px-6 py-3">
                    <div class="flex gap-4">
                        <div class="skeleton-pulse w-16 h-4 rounded-lg"></div>
                        <div class="skeleton-pulse w-20 h-4 rounded-lg"></div>
                    </div>
                </div>
                <div class="p-6">${this.table(4, 3)}</div>
            </div>`;
    },

    formField() {
        return `
            <div>
                <div class="skeleton-pulse w-24 h-3 rounded-lg mb-2"></div>
                <div class="skeleton-pulse w-full h-10 rounded-xl"></div>
            </div>`;
    },

    form(fieldCount = 4) {
        const fields = Array(fieldCount).fill(this.formField()).join('');
        return `
            <div class="mb-6">
                <div class="skeleton-pulse w-24 h-4 rounded-lg mb-2"></div>
                <div class="skeleton-pulse w-40 h-7 rounded-lg"></div>
            </div>
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-2xl">
                <div class="space-y-4">${fields}</div>
                <div class="flex items-center gap-3 mt-6 pt-6 border-t border-gray-100">
                    <div class="skeleton-pulse w-24 h-10 rounded-xl"></div>
                    <div class="skeleton-pulse w-20 h-10 rounded-xl"></div>
                </div>
            </div>`;
    },

    chart(heightClass = 'h-72') {
        return `
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div class="skeleton-pulse w-48 h-5 rounded-lg mb-4"></div>
                <div class="skeleton-pulse w-full ${heightClass} rounded-xl"></div>
            </div>`;
    },

    summaryCard() {
        return `
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div class="flex items-center gap-3 mb-3">
                    <div class="skeleton-pulse w-10 h-10 rounded-xl"></div>
                    <div class="skeleton-pulse w-24 h-4 rounded-lg"></div>
                </div>
                <div class="skeleton-pulse w-32 h-7 rounded-lg"></div>
            </div>`;
    },

    report(cardCount = 4) {
        const cards = Array(cardCount).fill(this.summaryCard()).join('');
        return `
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">${cards}</div>
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div class="skeleton-pulse w-full h-64 rounded-xl"></div>
            </div>`;
    },

    notificationCard(count = 4) {
        const cards = Array(count).fill(`
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div class="flex items-start gap-4">
                    <div class="skeleton-pulse w-10 h-10 rounded-xl flex-shrink-0"></div>
                    <div class="flex-1 min-w-0">
                        <div class="skeleton-pulse w-48 h-4 rounded-lg mb-2"></div>
                        <div class="skeleton-pulse w-full h-3 rounded-lg mb-1"></div>
                        <div class="skeleton-pulse w-32 h-3 rounded-lg mt-2"></div>
                    </div>
                </div>
            </div>`).join('');
        return `<div class="space-y-3">${cards}</div>`;
    },

    calendarCard(count = 6) {
        const cards = Array(count).fill(`
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div class="skeleton-pulse w-16 h-3 rounded-lg mb-2"></div>
                <div class="skeleton-pulse w-24 h-5 rounded-lg mb-3"></div>
                <div class="space-y-2">
                    <div class="skeleton-pulse w-full h-12 rounded-xl"></div>
                    <div class="skeleton-pulse w-full h-12 rounded-xl"></div>
                </div>
            </div>`).join('');
        return `<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">${cards}</div>`;
    }
};
