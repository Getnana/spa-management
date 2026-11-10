pages['rating/public-form'] = {
    state: {
        code: '',
        booking: null,
        selectedRating: 0,
        submitting: false
    },

    render(params) {
        this.state.code = params.code || '';
        this.state.selectedRating = 0;
        this.state.submitting = false;

        const container = document.getElementById('rating-content');
        container.innerHTML = `
            <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div class="w-full max-w-md">
                    <div id="rating-form-wrapper" class="bg-white rounded-2xl shadow-lg p-6 text-center">
                        <div class="flex items-center justify-center py-8">
                            <svg class="animate-spin h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.loadBooking();
    },

    async loadBooking() {
        const wrapper = document.getElementById('rating-form-wrapper');

        if (!this.state.code) {
            wrapper.innerHTML = `
                <div class="text-center py-8">
                    <svg class="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    <p class="text-gray-600 font-medium">Kode rating tidak valid</p>
                </div>
            `;
            return;
        }

        try {
            const res = await fetch(`/api/rating/form/${this.state.code}`);
            const json = await res.json();
            if (!json.status) throw json;
            this.state.booking = json.data;

            if (this.state.booking && this.state.booking.already_rated) {
                wrapper.innerHTML = `
                    <div class="text-center py-8">
                        <svg class="w-16 h-16 text-green-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        <p class="text-gray-800 font-semibold text-lg">Anda sudah memberikan rating</p>
                        <p class="text-sm text-gray-500 mt-1">Terima kasih atas feedback Anda</p>
                    </div>
                `;
                return;
            }

            this.renderForm();
        } catch (err) {
            wrapper.innerHTML = `
                <div class="text-center py-8">
                    <svg class="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    <p class="text-gray-600 font-medium">Gagal memuat data</p>
                    <p class="text-sm text-gray-400 mt-1">${err.message || 'Terjadi kesalahan'}</p>
                </div>
            `;
        }
    },

    renderForm() {
        const wrapper = document.getElementById('rating-form-wrapper');
        const b = this.state.booking;
        const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

        wrapper.innerHTML = `
            <div>
                <div class="w-16 h-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                </div>
                <h2 class="text-xl font-bold text-gray-800 mb-1">Bagaimana pengalaman Anda?</h2>
                <p class="text-sm text-gray-500 mb-6">Beri rating untuk layanan kami</p>

                <!-- Booking Info -->
                <div class="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
                    <div class="flex justify-between">
                        <span class="text-xs text-gray-500">Spa</span>
                        <span class="text-sm font-medium text-gray-800">${b.spa_name || '-'}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-xs text-gray-500">Layanan</span>
                        <span class="text-sm font-medium text-gray-800">${b.service_name || '-'}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-xs text-gray-500">Terapis</span>
                        <span class="text-sm font-medium text-gray-800">${b.therapist_name || '-'}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-xs text-gray-500">Tanggal</span>
                        <span class="text-sm font-medium text-gray-800">${formatDate(b.booking_date)}</span>
                    </div>
                </div>

                <!-- Star Rating -->
                <div class="mb-6">
                    <p class="text-sm font-medium text-gray-700 mb-2">Rating</p>
                    <div id="star-rating" class="flex items-center justify-center gap-2">
                        ${this.renderClickableStars(0)}
                    </div>
                    <p id="rating-label" class="text-sm text-gray-400 mt-2">Pilih rating</p>
                </div>

                <!-- Comment -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Komentar (opsional)</label>
                    <textarea id="rating-comment" rows="3" placeholder="Tulis komentar Anda..."
                        class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"></textarea>
                </div>

                <!-- Submit -->
                <button id="submit-rating"
                    class="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-xl transition text-sm">
                    Kirim Rating
                </button>

                <div id="rating-error" class="hidden mt-3 text-sm text-red-500"></div>
            </div>
        `;

        this.bindStarEvents();
        document.getElementById('submit-rating').addEventListener('click', () => this.submitRating());
    },

    renderClickableStars(selected) {
        let html = '';
        for (let i = 1; i <= 5; i++) {
            const filled = i <= selected;
            html += `
                <button type="button" data-star="${i}"
                    class="star-btn focus:outline-none transition-transform hover:scale-110">
                    <svg class="w-10 h-10 ${filled ? 'text-yellow-400' : 'text-gray-200'}" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                </button>
            `;
        }
        return html;
    },

    bindStarEvents() {
        const self = this;
        const starContainer = document.getElementById('star-rating');
        const ratingLabel = document.getElementById('rating-label');

        const labels = ['', 'Sangat Buruk', 'Buruk', 'Biasa', 'Bagus', 'Sangat Bagus'];

        starContainer.addEventListener('click', function (e) {
            const btn = e.target.closest('.star-btn');
            if (!btn) return;
            const star = parseInt(btn.dataset.star);
            self.state.selectedRating = star;
            starContainer.innerHTML = self.renderClickableStars(star);
            ratingLabel.textContent = labels[star] || '';
            ratingLabel.className = 'text-sm text-gray-700 mt-2 font-medium';
            self.bindStarEvents();
        });
    },

    async submitRating() {
        if (this.state.submitting) return;

        if (this.state.selectedRating === 0) {
            document.getElementById('rating-error').textContent = 'Silakan pilih rating terlebih dahulu';
            document.getElementById('rating-error').classList.remove('hidden');
            return;
        }

        this.state.submitting = true;
        const btn = document.getElementById('submit-rating');
        const errorEl = document.getElementById('rating-error');
        errorEl.classList.add('hidden');

        btn.disabled = true;
        btn.textContent = 'Mengirim...';

        try {
            const comment = document.getElementById('rating-comment').value.trim();
            const res = await fetch('/api/rating/public-submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    booking_code: this.state.code,
                    rating: this.state.selectedRating,
                    comment: comment
                })
            });
            const json = await res.json();
            if (!json.status) throw json;

            this.showSuccess();
        } catch (err) {
            errorEl.textContent = err.message || 'Gagal mengirim rating. Silakan coba lagi.';
            errorEl.classList.remove('hidden');
            btn.disabled = false;
            btn.textContent = 'Kirim Rating';
            this.state.submitting = false;
        }
    },

    showSuccess() {
        const wrapper = document.getElementById('rating-form-wrapper');
        wrapper.style.transition = 'opacity 0.3s, transform 0.3s';

        wrapper.innerHTML = `
            <div class="py-8 animate-fade-in">
                <div class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                </div>
                <h2 class="text-xl font-bold text-gray-800 mb-1">Terima Kasih!</h2>
                <p class="text-sm text-gray-500">Rating Anda sangat berarti bagi kami</p>
                <div class="flex items-center justify-center gap-1 mt-3">
                    ${this.renderStaticStars(this.state.selectedRating)}
                </div>
            </div>
        `;
    },

    renderStaticStars(rating) {
        let html = '';
        for (let i = 1; i <= 5; i++) {
            const filled = i <= rating;
            html += `<svg class="w-6 h-6 ${filled ? 'text-yellow-400' : 'text-gray-200'}" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
        }
        return html;
    }
};
