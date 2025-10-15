import { BoardColumn } from './board-column';

/**
 * Represents a board that can be composed of multiple columns.
 *
 * @template T - The type of data handled by each column (defaults to `any`).
 * @publicApi
 */
export interface Board<T = any> {
	/**
	 * Unique identifier for the board.
	 */
	id?: number;

	/**
	 * The board's main title.
	 */
	title: string;

	/**
	 * Optional description providing more details about the board.
	 */
	description?: string;

	/**
	 * An array of columns that belong to this board.
	 */
	columns?: BoardColumn<T>[];

	/**
	 * Optional list of CSS classes to apply to the board.
	 */
	classlist?: string[];

	/**
	 * Custom inline styles for the board, represented as a key-value mapping.
	 */
	style?: { [key: string]: any };
}
