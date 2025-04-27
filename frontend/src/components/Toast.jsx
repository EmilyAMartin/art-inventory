import React from 'react';
import { QueryClient, QueryCache } from '@tanstack/react-query';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error, query) => {
			toast.error(query?.meta?.errorMessage ?? 'Something went wrong!');
		},
	}),
});
const Toast = () => {
	return <ToastContainer />;
};

export default Toast;
