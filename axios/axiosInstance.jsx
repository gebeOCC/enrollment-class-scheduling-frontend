// axiosConfig.jsx

import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api/',
    withCredentials: true,
});

// You can also add interceptors for request and response
axiosInstance.interceptors.request.use(
    (config) => {
        // You can modify the request config here, like adding authentication token
        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        // You can modify the response data here before it's returned
        return response;
    },  
    (error) => {
        // Handle response error
        return Promise.reject(error);
    }
);

export default axiosInstance;