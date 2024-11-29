import axios from 'axios';
import { store } from '../redux/store';
import { updateState } from '../redux/auth/slice';

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});
	failedQueue = [];
};

apiClient.interceptors.request.use(
	(config) => {
		const token = store.getState().auth.token;
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then((token) => {
						originalRequest.headers.Authorization = `Bearer ${token}`;
						return axios(originalRequest);
					})
					.catch((err) => Promise.reject(err));
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				const response = await axios.post(
					`${import.meta.env.VITE_API_URL}/auth/refresh-tokens`,
					{},
					{ withCredentials: true },
				);

				const { user, token } = response.data;

				store.dispatch(updateState({ user, token }));

				processQueue(null, token);

				originalRequest.headers.Authorization = `Bearer ${token}`;
				return axios(originalRequest);
			} catch (err) {
				console.log(err);
				processQueue(err, null);
				localStorage.removeItem('token');
				window.location.href = '/login';
				return Promise.reject(err);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	},
);

export default apiClient;
