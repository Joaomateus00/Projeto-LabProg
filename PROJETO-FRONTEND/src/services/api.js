import axios from 'axios';


const api = axios.create({
    baseURL: 'http://localhost:3001',
    timeout: 1000,
    headers: {
        'Content-Type' : 'aplication/json'
    }
});

api.interceptors.request.use(async config => {
    const token = localStorage.getItem('token');
    if (token){
        config.headers.Authorization = `Bearer ${token}`;

    }
    return config;
});

export default api;