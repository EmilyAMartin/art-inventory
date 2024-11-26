import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	siteUrl: 'https://emilyamartin.github.io/art-inventory/',
	pathPrefix: '/<art-inventory>',
});
