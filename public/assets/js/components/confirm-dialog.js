const confirmDialog = {
    _callback: null,

    show(title, message, callback, okText = 'Hapus') {
        document.getElementById('confirm-title').textContent = title;
        document.getElementById('confirm-message').textContent = message;
        document.getElementById('confirm-ok-btn').textContent = okText;
        confirmDialog._callback = callback;
        document.getElementById('confirm-ok-btn').onclick = () => {
            confirmDialog.ok();
        };
        document.getElementById('confirm-dialog').classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    },

    ok() {
        document.getElementById('confirm-dialog').classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
        if (confirmDialog._callback) confirmDialog._callback();
        confirmDialog._callback = null;
    },

    cancel() {
        document.getElementById('confirm-dialog').classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
        confirmDialog._callback = null;
    }
};
