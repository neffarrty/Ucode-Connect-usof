import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import {
	ForgotPassword,
	ResetPassword,
	Login,
	Register,
	Verify,
	OAuthSuccess,
	HomePage,
	ProfilePage,
	PostsPage,
	PostPage,
	CreatePostPage,
	PostsByCategoryPage,
	BookmarksPage,
	CategoriesPage,
} from './pages';
import { theme } from './theme/theme';
import NotFound from './components/errors/NotFound';
import PrivateRoute from './components/PrivateRoute';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const App: React.FC = () => {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Routes>
				<Route
					path="/"
					element={
						<PrivateRoute>
							<HomePage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/home"
					element={
						<PrivateRoute>
							<HomePage />
						</PrivateRoute>
					}
				/>
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
					path="/oauth-success/:token"
					element={<OAuthSuccess />}
				/>
				<Route
					path="/posts"
					element={
						<PrivateRoute>
							<PostsPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/posts/new"
					element={
						<PrivateRoute>
							<CreatePostPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/posts/:id"
					element={
						<PrivateRoute>
							<PostPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/profile"
					element={
						<PrivateRoute>
							<ProfilePage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/bookmarks"
					element={
						<PrivateRoute>
							<BookmarksPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/categories"
					element={
						<PrivateRoute>
							<CategoriesPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/categories/:id/posts"
					element={
						<PrivateRoute>
							<PostsByCategoryPage />
						</PrivateRoute>
					}
				/>
				<Route path="*" element={<NotFound />} />
			</Routes>
		</ThemeProvider>
	);
};

export default App;
