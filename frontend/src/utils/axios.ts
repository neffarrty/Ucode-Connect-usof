import axios from 'axios';
import { store } from '../redux/store';
import { updateState, updateUser } from '../redux/auth/slice';

const instance = axios.create({
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

instance.interceptors.request.use(
	(config) => {
		const token = store.getState().auth.token;
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

instance.interceptors.response.use(
	async (response) => {
		const user = store.getState().auth.user;

		try {
			const token = store.getState().auth.token;

			const response = await axios.get(`/users/${user?.id}`, {
				baseURL: import.meta.env.VITE_API_URL,
				withCredentials: true,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			localStorage.setItem('user', JSON.stringify(response.data));
			store.dispatch(updateUser(response.data));
		} catch (err) {
			console.error(err);
		}
		return response;
	},
	async (error) => {
		const request = error.config;

		if (error.response?.status === 401 && !request._retry) {
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then((token) => {
						request.headers.Authorization = `Bearer ${token}`;
						return axios(request);
					})
					.catch((err) => Promise.reject(err));
			}

			request._retry = true;
			isRefreshing = true;

			try {
				const response = await axios.post(
					`/auth/refresh-tokens`,
					{},
					{
						baseURL: import.meta.env.VITE_API_URL,
						withCredentials: true,
					},
				);

				const { user, token } = response.data;

				store.dispatch(updateState({ user, token }));

				processQueue(null, token);

				request.headers.Authorization = `Bearer ${token}`;
				return axios(request);
			} catch (err) {
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

export default instance;
