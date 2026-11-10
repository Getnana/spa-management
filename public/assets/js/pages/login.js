pages['login'] = {
    recaptchaEnabled: false,
    recaptchaSiteKey: '',
    recaptchaWidgetId: null,
    recaptchaReady: false,

    render() {
        let form = document.getElementById('login-form');
        const errorEl = document.getElementById('login-error');

        // Clone form to remove previous event listeners
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        form = newForm;

        this.loadRecaptchaConfig();

        const usernameInput = form.username;
        const passwordInput = form.password;

        usernameInput.addEventListener('input', () => this.clearFieldError(usernameInput));
        passwordInput.addEventListener('input', () => this.clearFieldError(passwordInput));

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const username = form.username.value.trim();
            const password = form.password.value;

            this.clearAllErrors(errorEl);

            let hasError = false;
            if (!username) {
                this.setFieldError(usernameInput, 'Username wajib diisi.');
                hasError = true;
            } else if (username.length < 3) {
                this.setFieldError(usernameInput, 'Username minimal 3 karakter.');
                hasError = true;
            }
            if (!password) {
                this.setFieldError(passwordInput, 'Password wajib diisi.');
                hasError = true;
            } else if (password.length < 8) {
                this.setFieldError(passwordInput, 'Password minimal 8 karakter.');
                hasError = true;
            }
            if (hasError) return;

            let extra = {};
            if (this.recaptchaEnabled && this.recaptchaWidgetId !== null) {
                const token = grecaptcha.getResponse(this.recaptchaWidgetId);
                if (!token) {
                    errorEl.innerHTML = '<div class="flex items-center gap-2"><svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg><span>Silakan centang verifikasi reCAPTCHA terlebih dahulu.</span></div>';
                    errorEl.classList.remove('hidden');
                    return;
                }
                extra.recaptcha_token = token;
            }

            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg class="animate-spin h-5 w-5 text-white inline-block mr-2" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Memproses...
            `;
            errorEl.classList.add('hidden');

            try {
                await auth.login(username, password, extra);
                const role = auth.getRole();
                if (role === 'owner') window.location.hash = '#/';
                else if (role === 'staff') window.location.hash = '#/bookings';
                else if (role === 'therapist') window.location.hash = '#/my-schedule';
                else window.location.hash = '#/';
            } catch (err) {
                const msg = err.message || 'Login gagal. Periksa username dan password.';
                const icon = '<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
                errorEl.innerHTML = `<div class="flex items-center gap-2">${icon}<span>${msg}</span></div>`;
                errorEl.classList.remove('hidden');
                if (this.recaptchaEnabled && this.recaptchaWidgetId !== null) {
                    grecaptcha.reset(this.recaptchaWidgetId);
                }
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Masuk';
            }
        });
    },

    setFieldError(input, message) {
        input.classList.add('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
        input.classList.remove('border-gray-300', 'focus:ring-primary-500', 'focus:border-primary-500');
        let hint = input.parentElement.querySelector('.field-error');
        if (!hint) {
            hint = document.createElement('p');
            hint.className = 'field-error text-red-500 text-xs mt-1';
            input.parentElement.appendChild(hint);
        }
        hint.textContent = message;
    },

    clearFieldError(input) {
        input.classList.remove('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
        input.classList.add('border-gray-300', 'focus:ring-primary-500', 'focus:border-primary-500');
        const hint = input.parentElement.querySelector('.field-error');
        if (hint) hint.remove();
    },

    clearAllErrors(errorEl) {
        errorEl.classList.add('hidden');
        errorEl.textContent = '';
        document.querySelectorAll('#login-form .field-error').forEach(el => el.remove());
        document.querySelectorAll('#login-form input').forEach(input => {
            input.classList.remove('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
            input.classList.add('border-gray-300', 'focus:ring-primary-500', 'focus:border-primary-500');
        });
    },

    async loadRecaptchaConfig() {
        try {
            const res = await fetch('/api/settings/recaptcha');
            const json = await res.json();
            if (json.status && json.data.recaptcha && json.data.recaptcha.enabled && json.data.recaptcha.site_key) {
                this.recaptchaEnabled = true;
                this.recaptchaSiteKey = json.data.recaptcha.site_key;
                this.injectRecaptchaScript();
            }
        } catch (e) {}
    },

    injectRecaptchaScript() {
        if (document.getElementById('recaptcha-api-script')) return;

        window.onRecaptchaLoad = () => {
            this.recaptchaReady = true;
            this.renderRecaptcha();
        };

        const script = document.createElement('script');
        script.id = 'recaptcha-api-script';
        script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    },

    renderRecaptcha() {
        const container = document.getElementById('recaptcha-container');
        if (!container || !this.recaptchaReady || this.recaptchaWidgetId !== null) return;

        this.recaptchaWidgetId = grecaptcha.render('recaptcha-container', {
            sitekey: this.recaptchaSiteKey,
            theme: 'light',
            size: 'normal',
        });
    }
};
