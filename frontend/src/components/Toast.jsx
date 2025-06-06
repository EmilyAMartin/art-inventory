import React from 'react';
import { Toaster } from 'react-hot-toast';

const Toast = () => {
	return (
		<Toaster
			position='top-center'
			reverseOrder={false}
			toastOptions={{
				style: {
					fontFamily: 'Roboto, sans-serif',
					fontSize: '1rem',
				},
			}}
		/>
	);
};

export default Toast;
