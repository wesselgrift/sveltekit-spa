/**
 * Discriminated union for typed success/failure returns.
 * Services return Result<T> so callers handle both paths explicitly
 * without ambient try/catch.
 */

export type Result<T, E = string> =
	| { ok: true; data: T }
	| { ok: false; error: E };
