import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { login, register, refreshTokens, fetchUser } from './actions';

interface User {
	id: string;
	login: string;
	email: string;
	avatar: string;
}

interface AuthState {
	user: User | null;
	token: string | null;
	loading: boolean;
	error: string | null;
	success: boolean;
}

const initialState: AuthState = {
	user: JSON.parse(localStorage.getItem('user') || 'null'),
	token: localStorage.getItem('token'),
	loading: false,
	error: null,
	success: false,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setToken(state, action: PayloadAction<{ token: string }>) {
			state.token = action.payload.token;
			localStorage.setItem('token', action.payload.token);
		},
		logout(state) {
			state.user = null;
			state.token = null;
			localStorage.removeItem('user');
			localStorage.removeItem('token');
		},
		updateState(
			state,
			action: PayloadAction<{ user: User; token: string }>,
		) {
			console.log(action.payload.user);
			state.token = action.payload.token;
			state.user = action.payload.user;
			localStorage.setItem('token', action.payload.token);
			localStorage.setItem('user', JSON.stringify(action.payload.user));
		},
	},
	extraReducers: (builder) => {
		builder.addCase(login.pending, (state) => {
			state.loading = true;
			state.success = false;
		});
		builder.addCase(
			login.fulfilled,
			(state, action: PayloadAction<any>) => {
				state.loading = false;
				state.success = true;
				state.user = action.payload.user;
				state.token = action.payload.token;
				localStorage.setItem(
					'user',
					JSON.stringify(action.payload.user),
				);
				localStorage.setItem('token', action.payload.token);
			},
		);
		builder.addCase(login.rejected, (state, action) => {
			state.loading = false;
			state.success = false;
			state.error = action.payload as string;
		});
		builder.addCase(register.pending, (state) => {
			state.success = false;
			state.loading = true;
		});
		builder.addCase(
			register.fulfilled,
			(state, action: PayloadAction<any>) => {
				state.success = true;
				state.loading = false;
			},
		);
		builder.addCase(register.rejected, (state, action) => {
			state.loading = false;
			state.success = false;
			state.error = action.payload as string;
		});
		builder.addCase(refreshTokens.pending, (state) => {
			state.loading = true;
			state.success = false;
		});
		builder.addCase(
			refreshTokens.fulfilled,
			(state, action: PayloadAction<any>) => {
				state.loading = false;
				state.success = true;
				state.user = action.payload.user;
				state.token = action.payload.token;
				localStorage.setItem(
					'user',
					JSON.stringify(action.payload.user),
				);
				localStorage.setItem('token', action.payload.token);
			},
		);
		builder.addCase(refreshTokens.rejected, (state, action) => {
			state.loading = false;
			state.success = false;
			state.error = action.payload as string;
			state.user = null;
			state.token = null;
			localStorage.removeItem('user');
			localStorage.removeItem('token');
		});

		builder.addCase(fetchUser.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(
			fetchUser.fulfilled,
			(state, action: PayloadAction<any>) => {
				state.loading = false;
				state.success = true;
				state.user = action.payload.user;
				localStorage.setItem(
					'user',
					JSON.stringify(action.payload.user),
				);
			},
		);
		builder.addCase(fetchUser.rejected, (state, action) => {
			state.loading = false;
			state.success = false;
			state.error = action.payload as string;
		});
	},
});

export const { setToken, logout, updateState } = authSlice.actions;

export default authSlice.reducer;
