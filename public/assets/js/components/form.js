const form = {
    serialize(formEl) {
        const fd = new FormData(formEl);
        const data = {};
        for (const [key, val] of fd.entries()) {
            if (data[key]) {
                if (Array.isArray(data[key])) data[key].push(val);
                else data[key] = [data[key], val];
            } else {
                data[key] = val;
            }
        }
        return data;
    },

    input(name, label, type = 'text', options = {}) {
        const value = options.value || '';
        const placeholder = options.placeholder || '';
        const required = options.required !== false;
        const extraClass = options.extraClass || '';
        const readonly = options.readonly ? 'readonly' : '';
        const step = options.step ? `step="${options.step}"` : '';
        const inputId = options.id || name;
        const readonlyClass = options.readonly ? 'bg-gray-50 cursor-not-allowed' : '';
        return `<div class="${extraClass}">
            <label for="${inputId}" class="block text-sm font-medium text-gray-700 mb-1">${label}${required ? ' <span class="text-red-500">*</span>' : ''}</label>
            <input type="${type}" name="${name}" id="${inputId}" value="${value}" placeholder="${placeholder}"
    ${required ? 'required' : ''} ${readonly} ${step}
                class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition text-sm ${readonlyClass}">
        </div>`;
    },

    select(name, label, options, selected = '', opts = {}) {
        const required = opts.required !== false;
        const extraClass = opts.extraClass || '';
        const inputId = opts.id || name;
        const noSearch = opts.noSearch === true;
        const isMultiple = opts.multiple === true;
        const selectedArr = Array.isArray(selected) ? selected : (selected ? [selected] : []);
        const optionsHtml = (isMultiple ? '' : `<option value="">-- Pilih --</option>`) + options.map(o => {
            const val = typeof o === 'object' ? o.value : o;
            const text = typeof o === 'object' ? o.label : o;
            const sel = selectedArr.some(s => String(s) === String(val)) ? 'selected' : '';
            return `<option value="${val}" ${sel}>${text}</option>`;
        }).join('');

        return `<div class="${extraClass}">
            <label for="${inputId}" class="block text-sm font-medium text-gray-700 mb-1">${label}${required && !isMultiple ? ' <span class="text-red-500">*</span>' : ''}</label>
            <select name="${name}" id="${inputId}" ${isMultiple ? 'multiple' : (required ? 'required' : '')}
                data-tom-select="${noSearch ? 'false' : 'true'}"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition text-sm">${optionsHtml}</select>
        </div>`;
    },

    textarea(name, label, options = {}) {
        const value = options.value || '';
        const rows = options.rows || 3;
        const required = options.required || false;
        const extraClass = options.extraClass || '';
        return `<div class="${extraClass}">
            <label for="${name}" class="block text-sm font-medium text-gray-700 mb-1">${label}${required ? ' <span class="text-red-500">*</span>' : ''}</label>
            <textarea name="${name}" id="${name}" rows="${rows}" ${required ? 'required' : ''}
                class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition text-sm">${value}</textarea>
        </div>`;
    },

    submitButton(label = 'Simpan', extraClass = '') {
        return `<button type="submit" class="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-6 rounded-xl transition ${extraClass}">${label}</button>`;
    },

    initTomSelect(selector, options = {}) {
        const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
        if (!el || typeof TomSelect === 'undefined') return null;

        const instance = new TomSelect(el, {
            create: false,
            allowEmptyOption: true,
            searchField: 'text',
            maxOptions: null,
            dropdownParent: 'body',
            ...options
        });

        // Clean conflicting classes from TomSelect wrapper
        const wrapper = el.nextElementSibling;
        if (wrapper && wrapper.classList.contains('ts-wrapper')) {
            wrapper.classList.remove(
                'px-3', 'py-2.5', 'border', 'border-gray-300', 'rounded-xl',
                'focus:ring-2', 'focus:ring-primary-500', 'focus:border-primary-500',
                'transition', 'text-sm'
            );
        }

        this._trackInstance(instance);

        return instance;
    },

    _trackInstance(instance) {
        if (instance && typeof router !== 'undefined' && router._tomSelectInstances) {
            router._tomSelectInstances.push(instance);
        }
    },

    initAllTomSelects(container = document) {
        const selects = container.querySelectorAll('select[data-tom-select="true"]');
        selects.forEach(el => {
            if (el.classList.contains('ts-hidden-accessible')) return;
            this.initTomSelect(el);
        });
    }
};
