import { QueryCache, QueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error, query) => {
			toast.error(query?.meta?.errorMessage ?? 'Something went wrong!');
		},
	}),
});
