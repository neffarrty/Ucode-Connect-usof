import * as yup from 'yup';

export const schema = yup.object().shape({
	login: yup
		.string()
		.min(5, 'Username must be at least 5 characters')
		.max(20, 'Username cannot exceed 20 characters')
		.required('Username is required'),
	email: yup
		.string()
		.email('Please enter a valid email')
		.required('Email is required'),
	password: yup
		.string()
		.matches(
			/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
			'Password must be at least 8 characters and include uppercase, lowercase, and a number',
		)
		.required('Password is required'),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref('password')], 'Passwords must match')
		.required('Confirm password is required'),
	fullname: yup
		.string()
		.min(5, 'Full name must be at least 5 characters')
		.max(32, 'Full name cannot exceed 32 characters')
		.required('Fullname is required'),
	role: yup.string().oneOf(['ADMIN', 'USER']).optional(),
});
