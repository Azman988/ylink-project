import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true, // CRITICAL: Tells browser to send HTTP-only cookies automatically
});

// Response Interceptor: Catches expired/invalid token responses globally
// API.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         const requestUrl = error.config?.url || '';
//         const isMain = window.location.pathname === '/';
//         const isMainEndpoint = requestUrl.includes('/');

//         // Only handle 401s if we aren't already on /Main and it wasn't a main endpoint request
//         if (error.response?.status === 401 && !isMain && !isMainEndpoint) {
//             // List routes that should NOT cause a hard logout on 401
//             const nonCriticalRoutes = ['/shop', '/solar', '/consultation'];
//             const isNonCritical = nonCriticalRoutes.some((route) => requestUrl.includes(route));

//             // If it's a non-critical route, reject the promise without logging out
//             if (isNonCritical) {
//                 return Promise.reject(error);
//             }

//             localStorage.removeItem('user');
//             localStorage.removeItem('role');

//             // Redirect to login page
//             window.location.href = '/auth';
//         }
//         return Promise.reject(error);
//     }
// );

export default API;