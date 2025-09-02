import { QueryCache, QueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error, query) => {
			toast.error(query?.meta?.errorMessage ?? 'Something went wrong!');
		},
	}),
	defaultOptions: {
		queries: {
			// Reduce memory usage by limiting cache time
			staleTime: 5 * 60 * 1000, // 5 minutes
			gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
			// Limit concurrent queries to reduce memory pressure
			maxConcurrency: 3,
			// Retry fewer times to reduce memory usage
			retry: 1,
		},
		mutations: {
			// Reduce retry attempts for mutations
			retry: 1,
		},
	},
});
