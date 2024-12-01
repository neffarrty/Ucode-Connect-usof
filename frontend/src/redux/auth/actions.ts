import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { RootState } from '../store';

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
});

interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	login: string;
	email: string;
	password: string;
	fullname?: string | null;
}

interface User {
	id: string;
	login: string;
	email: string;
	avatar: string;
}

interface UserResponse {
	user: User;
}

interface AuthResponse {
	user: User;
	token: string;
}

export const login = createAsyncThunk<
	AuthResponse,
	LoginRequest,
	{ rejectValue: string }
>('auth/login', async ({ email, password }, { rejectWithValue }) => {
	try {
		const { data } = await api.post<AuthResponse>('/auth/login', {
			email,
			password,
		});
		return data;
	} catch (error) {
		if (error instanceof AxiosError) {
			return rejectWithValue(
				error.response?.data?.message || error.message,
			);
		}
		return rejectWithValue('An unknown error occurred.');
	}
});

export const register = createAsyncThunk<
	AuthResponse,
	RegisterRequest,
	{ rejectValue: string }
>(
	'auth/register',
	async ({ login, email, password, fullname }, { rejectWithValue }) => {
		try {
			const { data } = await api.post<AuthResponse>('/auth/register', {
				login,
				email,
				password,
				fullname,
			});
			return data;
		} catch (error) {
			if (error instanceof AxiosError) {
				return rejectWithValue(
					error.response?.data?.message || error.message,
				);
			}
			return rejectWithValue('An unknown error occurred.');
		}
	},
);

export const refreshTokens = createAsyncThunk<
	AuthResponse,
	{ rejectValue: string }
>('auth/refresh-tokens', async (_, { rejectWithValue }) => {
	try {
		const response = await api.post<AuthResponse>('/auth/refresh-tokens');
		return response.data;
	} catch (error) {
		return rejectWithValue('Failed to refresh tokens');
	}
});

export const forgotPassword = createAsyncThunk<
	void,
	{ email: string },
	{ rejectValue: string }
>('auth/forgot-password', async ({ email }, { rejectWithValue }) => {
	try {
		await axios.post('/auth/forgot-password', { email });
	} catch (error) {
		return rejectWithValue('Failed to send forgot password request');
	}
});

export const fetchUser = createAsyncThunk<
	UserResponse,
	void,
	{ rejectValue: string }
>('auth/fetch-user', async (_, { rejectWithValue, getState }) => {
	const token = (getState() as RootState).auth.token;

	if (!token) {
		return rejectWithValue('No token provided');
	}

	try {
		const { data } = await api.get<UserResponse>('/auth/self', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return data;
	} catch (error) {
		if (error instanceof AxiosError) {
			return rejectWithValue(
				error.response?.data?.message || error.message,
			);
		}
		return rejectWithValue('An unknown error occurred.');
	}
});

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
	'auth/logout',
	async (_, { rejectWithValue, getState }) => {
		const token = (getState() as RootState).auth.token;

		if (!token) {
			return rejectWithValue('No token provided');
		}

		try {
			await api.post(
				'/auth/logout',
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
		} catch (error) {
			if (error instanceof AxiosError) {
				return rejectWithValue(
					error.response?.data?.message || error.message,
				);
			}
			return rejectWithValue('An unknown error occurred.');
		}
	},
);
