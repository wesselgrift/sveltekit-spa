// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { User } from 'firebase/auth';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {
		//   user?: User | null; // Optional: for future use if needed
		// }
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
