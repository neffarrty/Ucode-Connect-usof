import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App.tsx';
import { store } from './redux/store.ts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const root = createRoot(document.getElementById('root') as HTMLElement);
const client = new QueryClient();

root.render(
	<StrictMode>
		<BrowserRouter>
			<Provider store={store}>
				<QueryClientProvider client={client}>
					<App />
				</QueryClientProvider>
			</Provider>
		</BrowserRouter>
	</StrictMode>,
);
