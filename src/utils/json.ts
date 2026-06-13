/** Safe JSON parsing result used by job payload forms. */
export type JsonParseResult = { readonly ok: true; readonly value: unknown } | { readonly ok: false; readonly message: string };
/** Parses user-provided JSON and keeps errors deterministic for UI/tests. */
export function parseJsonInput(input: string): JsonParseResult { try { return { ok: true, value: JSON.parse(input) as unknown }; } catch (error) { return { ok: false, message: error instanceof Error ? error.message : 'Invalid JSON payload.' }; } }
/** Pretty-prints JSON strings or objects without HTML injection risk. */
export function formatJson(value: unknown): string { try { const parsed: unknown = typeof value === 'string' ? (JSON.parse(value) as unknown) : value; return JSON.stringify(parsed, null, 2); } catch { return String(value); } }
