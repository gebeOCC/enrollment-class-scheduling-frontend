import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api/',
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    async (config) => {
        // Attach CSRF token if necessary
        if (!config.headers['X-XSRF-TOKEN']) {
            await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
                withCredentials: true,
            });
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response, // Pass successful responses
    (error) => {
        if (error.response) {
            if (error.response.status === 403) {
                console.error('Access forbidden. Please check your permissions.');
            }
        } else if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
            console.warn('Retrying request due to network error.');
            return axiosInstance.request(error.config);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
