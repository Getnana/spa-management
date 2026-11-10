const table = {
    isMobile() {
        return window.innerWidth < 768;
    },

    render(config) {
        const { columns, data, pagination, onRowClick, actions, emptyText = 'Tidak ada data' } = config;

        if (!data || data.length === 0) {
            return `<div class="text-center py-12 text-gray-400"><svg class="w-16 h-16 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg><p>${emptyText}</p></div>`;
        }

        if (this.isMobile()) {
            return this.renderCards(config);
        }
        return this.renderDesktop(config);
    },

    renderDesktop(config) {
        const { columns, data, pagination, onRowClick, actions, rowClass, rowOnClick } = config;

        const thClass = 'px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider';
        const tdClass = 'px-4 py-3 text-sm text-gray-700';

        let html = '<div class="overflow-x-auto"><table class="w-full"><thead class="bg-gray-50 border-b border-gray-200"><tr>';

        columns.forEach(col => {
            html += `<th class="${thClass}">${col.label}</th>`;
        });
        if (actions) html += `<th class="${thClass}">Aksi</th>`;
        html += '</tr></thead><tbody class="divide-y divide-gray-100">';

        data.forEach(row => {
            const clickFn = onRowClick || rowOnClick;
            const rowCls = rowClass ? rowClass(row) : '';
            const clickAttr = clickFn ? `onclick="${clickFn(row)}"` : '';
            const classAttr = rowCls ? `class="${rowCls}"` : '';
            const attrs = [clickAttr, rowCls ? `class="${rowCls}"` : ''].filter(Boolean).join(' ');
            if (clickFn && !rowCls) {
                html += `<tr onclick="${clickFn(row)}" class="cursor-pointer hover:bg-gray-50">`;
            } else if (clickFn && rowCls) {
                html += `<tr onclick="${clickFn(row)}" class="${rowCls}">`;
            } else if (rowCls) {
                html += `<tr class="${rowCls}">`;
            } else {
                html += `<tr>`;
            }
            columns.forEach(col => {
                let val = col.render ? col.render(row) : (row[col.key] ?? '-');
                html += `<td class="${tdClass}">${val}</td>`;
            });
            if (actions) {
                html += `<td class="${tdClass}"><div class="flex gap-1">${actions(row)}</div></td>`;
            }
            html += '</tr>';
        });

        html += '</tbody></table></div>';
        html += this.renderPagination(pagination);
        return html;
    },

    renderCards(config) {
        const { columns, data, onRowClick, actions, rowClass, rowOnClick } = config;

        let html = '<div class="space-y-2.5">';

        data.forEach(row => {
            const clickFn = onRowClick || rowOnClick;
            const clickAttr = clickFn ? `onclick="${clickFn(row)}" style="cursor:pointer"` : '';
            html += `<div class="bg-gray-50 border border-gray-100 rounded-xl p-3.5 space-y-2" ${clickAttr}>`;

            columns.forEach((col, idx) => {
                let val = col.render ? col.render(row) : (row[col.key] ?? '-');
                if (idx === 0) {
                    html += `<div class="flex items-center justify-between">
                        <span class="text-sm font-semibold text-gray-800">${val}</span>
                    </div>`;
                } else {
                    html += `<div class="flex items-center justify-between text-sm">
                        <span class="text-xs text-gray-400 font-medium">${col.label}</span>
                        <span class="text-gray-700 text-right">${val}</span>
                    </div>`;
                }
            });

            if (actions) {
                html += `<div class="flex gap-1 pt-2 border-t border-gray-100">${actions(row)}</div>`;
            }

            html += '</div>';
        });

        html += '</div>';
        html += this.renderPagination(config.pagination);
        return html;
    },

    renderPagination(pagination) {
        if (!pagination) return '';

        return `<div class="flex items-center justify-between mt-4 text-sm text-gray-500 pagination-mobile">
            <span>Hal. ${pagination.current_page} dari ${pagination.total_pages} (${pagination.total} data)</span>
            <div class="flex gap-1">
                ${pagination.current_page > 1
                    ? `<button onclick="${pagination.onPrev}" class="px-3 py-1.5 border rounded-lg hover:bg-gray-50 text-sm">Prev</button>`
                    : ''}
                ${pagination.current_page < pagination.total_pages
                    ? `<button onclick="${pagination.onNext}" class="px-3 py-1.5 border rounded-lg hover:bg-gray-50 text-sm">Next</button>`
                    : ''}
            </div>
        </div>`;
    }
};
