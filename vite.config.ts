import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { resolve } from 'path';

// Stub file for optional peer deps of sveltekit-superforms that we don't use
const stubPath = resolve('./src/lib/utils/empty-module.js');

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), devtoolsJson()],
	resolve: {
		alias: {
			valibot: stubPath,
			'@valibot/to-json-schema': stubPath,
			yup: stubPath,
			arktype: stubPath,
			'@ark/schema': stubPath,
			joi: stubPath,
			'@typeschema/main': stubPath
		}
	}
});
