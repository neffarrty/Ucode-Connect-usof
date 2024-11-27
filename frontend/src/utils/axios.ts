import axios from 'axios';
import { store } from '../redux/store';
import { updateState } from '../redux/auth/slice';

const instance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
});

instance.interceptors.request.use(
	(config) => {
		const token = store.getState().auth.token;

		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

let isRefreshing = false;
let queue: any[] = [];

const processQueue = (error: unknown, token = null) => {
	queue.forEach((promise) => {
		if (token) {
			promise.resolve(token);
		} else {
			promise.reject(error);
		}
	});

	queue = [];
};

instance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const request = error.config;

		if (error.response?.status === 401 && !request._retry) {
			request._retry = true;

			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					queue.push({ resolve, reject });
				}).then((token) => {
					request.headers['Authorization'] = `Bearer ${token}`;
					return axios(request);
				});
			}

			isRefreshing = true;

			try {
				const response = await instance.post('/auth/refresh-tokens');

				const { user, token } = response.data;
				store.dispatch(updateState({ user, token }));

				instance.defaults.headers['Authorization'] = `Bearer ${token}`;

				processQueue(null, token);

				return axios(request);
			} catch (error) {
				processQueue(error, null);
				store.dispatch({ type: 'auth/logout' });
				return Promise.reject(error);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	},
);

export default instance;
