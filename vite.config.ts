import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import viteCompression from 'vite-plugin-compression';
import { resolve } from 'path';

export default defineConfig({
	plugins: [
		vue(),
		viteCompression({
			verbose: true,
			disable: false,
			threshold: 10240,
			algorithm: 'gzip',
			ext: '.gz',
		}),
	],
	base: '/',
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
		},
	},
	build: {
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
			},
		},
		rollupOptions: {
			output: {
				chunkFileNames: 'js/[name]-[hash].js',
				entryFileNames: 'js/[name]-[hash].js',
				assetFileNames: '[ext]/[name]-[hash].[ext]',
				manualChunks(id: string) {
					if (id.includes('node_modules')) {
						return 'vendor';
					}
				},
			},
		},
		cssCodeSplit: true,
		sourcemap: false,
		assetsInlineLimit: 4096,
	},
});
