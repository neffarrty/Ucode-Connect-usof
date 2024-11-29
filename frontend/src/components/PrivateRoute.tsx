import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface PrivateRouteProps {
	children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
	const { user: authUser } = useSelector((state: RootState) => state.auth);

	if (!authUser) {
		return <Navigate to="/login" />;
	}

	return children;
};

export default PrivateRoute;
