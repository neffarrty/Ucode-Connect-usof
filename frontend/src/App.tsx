import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import {
	ForgotPassword,
	ResetPassword,
	Login,
	Register,
	Verify,
	Dashboard,
	GoogleOAuthSuccess,
} from './pages';
import { theme } from './theme/theme';
import NotFound from './components/errors/NotFound';

const App: React.FC = () => {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Routes>
				<Route path="/" element={<Dashboard />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/password-reset" element={<ForgotPassword />} />
				<Route
					path="/password-reset/:token"
					element={<ResetPassword />}
				/>
				<Route
					path="/password-reset/:token"
					element={<ResetPassword />}
				/>
				<Route path="/verify/:token" element={<Verify />} />
				<Route
					path="/google-success/:token"
					element={<GoogleOAuthSuccess />}
				/>
				<Route path="*" element={<NotFound />} />
			</Routes>
		</ThemeProvider>
	);
};

export default App;
