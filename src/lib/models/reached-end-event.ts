/**
 * Event emitted when a column body is scrolled to its bottom.
 *
 * @template T - The type of column data being exposed to consumers (defaults to `any`).
 * @publicApi
 */
export interface ReachedEndEvent<T = any> {
	index: number;
	data: T;
}
