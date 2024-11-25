import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch } from '../redux/store';
import { setToken, updateState } from '../redux/auth/slice';
import { fetchUser } from '../redux/auth/actions';
import { CircularProgress } from '@mui/material';
import { RootState } from '../redux/store';

export const GoogleOAuthSuccess: React.FC = () => {
	const { token } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();
	const { success, user } = useSelector((state: RootState) => state.auth);

	useEffect(() => {
		if (token) {
			dispatch(setToken({ token }));
			dispatch(fetchUser());
		}
	}, [token, dispatch]);

	useEffect(() => {
		if (success && user) {
			dispatch(updateState({ user, token: token! }));
			navigate('/');
		}
	}, [success, user, dispatch, navigate, token]);

	return <CircularProgress />;
};
