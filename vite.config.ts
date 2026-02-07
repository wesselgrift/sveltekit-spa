import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// Optional peer deps of sveltekit-superforms that we don't use (we use Zod)
const optionalSuperformsDeps = [
	'valibot',
	'@valibot/to-json-schema',
	'yup',
	'arktype',
	'@ark/schema',
	'joi',
	'@typeschema/main'
];

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), devtoolsJson()],
	build: {
		rollupOptions: {
			external: (id) => optionalSuperformsDeps.includes(id)
		}
	}
});
