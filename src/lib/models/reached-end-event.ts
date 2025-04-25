/**
 * Interface representing an event triggered when reaching the end of a board column.
 * @template T - The type of the data being paginated. Defaults to any.
 */
export interface ReachedEndEvent<T = any> {
	index: number;
	data: T;
}
