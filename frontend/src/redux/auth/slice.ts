import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { login, register, refreshTokens, fetchUser, logout } from './actions';
import { User } from '../../interface/User';

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
		updateState(
			state,
			action: PayloadAction<{ user: User; token: string }>,
		) {
			state.token = action.payload.token;
			state.user = action.payload.user;
			localStorage.setItem('token', action.payload.token);
			localStorage.setItem('user', JSON.stringify(action.payload.user));
		},
		updateUser: (state, action) => {
			state.user = { ...state.user, ...action.payload };
			localStorage.setItem('user', JSON.stringify(state.user));
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
				state.error = null;
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
			(state, _action: PayloadAction<any>) => {
				state.success = true;
				state.loading = false;
				state.error = null;
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
		builder.addCase(logout.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(logout.fulfilled, (state) => {
			state.user = null;
			state.token = null;
			state.loading = false;
			state.error = null;
			localStorage.removeItem('user');
			localStorage.removeItem('token');
		});
		builder.addCase(logout.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload || 'Failed to logout';
		});
	},
});

export const { setToken, updateState, updateUser } = authSlice.actions;

export default authSlice.reducer;
