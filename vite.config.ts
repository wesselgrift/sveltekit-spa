import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Plugin } from 'vite';

// Stubs unused optional peer deps of sveltekit-superforms (we only use Zod).
// Uses Rollup's syntheticNamedExports so any named import resolves to undefined
// without a build error — no real module or file needed.
function stubOptionalDeps(deps: string[]): Plugin {
	return {
		name: 'stub-optional-deps',
		resolveId(id) {
			if (deps.includes(id)) {
				return { id: `\0stub:${id}`, syntheticNamedExports: true };
			}
		},
		load(id) {
			if (id.startsWith('\0stub:')) {
				return 'export default {};';
			}
		}
	};
}

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		devtoolsJson(),
		stubOptionalDeps([
			'valibot',
			'@valibot/to-json-schema',
			'yup',
			'arktype',
			'@ark/schema',
			'joi',
			'@typeschema/main'
		])
	]
});
