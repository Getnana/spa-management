const modal = {
    open(title, bodyHtml, options = {}) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-body').innerHTML = bodyHtml;
        document.getElementById('modal-container').classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
        if (options.onClose) modal._onClose = options.onClose;
    },

    close() {
        document.getElementById('modal-container').classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
        if (modal._onClose) { modal._onClose(); modal._onClose = null; }
    },

    _onClose: null,
};
