const api = {
    baseUrl: '/api',

    async request(method, endpoint, data = null) {
        const headers = {
            'X-Requested-With': 'XMLHttpRequest',
        };
        if (data) {
            headers['Content-Type'] = 'application/json';
        }

        const options = {
            method,
            headers,
            credentials: 'same-origin',
        };
        if (data) options.body = JSON.stringify(data);

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, options);

            if (!response.ok) {
                if (response.status === 401) {
                    window.location.hash = '#/login';
                    throw { httpStatus: 401, message: 'Session expired', status: false };
                }
                let json;
                try { json = await response.json(); } catch { json = {}; }
                throw { ...json, httpStatus: response.status };
            }

            let json;
            try { json = await response.json(); } catch {
                throw { httpStatus: 0, message: 'Server mengembalikan response yang tidak valid.' };
            }
            return json;
        } catch (error) {
            if (error.httpStatus) throw error;
            throw { httpStatus: 0, message: 'Network error. Please check your connection.' };
        }
    },

    get: (endpoint) => api.request('GET', endpoint),
    post: (endpoint, data) => api.request('POST', endpoint, data),
    put: (endpoint, data) => api.request('PUT', endpoint, data),
    delete: (endpoint) => api.request('DELETE', endpoint),
};
