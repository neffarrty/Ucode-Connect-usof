import { createTheme, ThemeOptions } from '@mui/material/styles';

const options: ThemeOptions = {
	palette: {
		mode: 'light',
		primary: {
			main: '#A33757',
			light: '#b55f78',
			dark: '#72263c',
		},
		secondary: {
			main: '#FFBB94',
			light: '#ffc8a9',
			dark: '#b28267',
		},
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				body: {
					height: '100vh',
					margin: 0,
					display: 'flex',
					flexDirection: 'column',
				},
			},
		},
	},
};

export const theme = createTheme(options);
