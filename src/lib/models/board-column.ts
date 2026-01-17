import { BoardCard } from './board-card';
import { BoardDragItem } from './drag-drop-event';

/**
 * Represents a column within a board layout.
 *
 * @template T The data type associated with the column (defaults to `any`).
 * @publicApi
 */
export interface BoardColumn<T = any> {
	/**
	 * A unique identifier for the column.
	 */
	id?: number;

	/**
	 * The identifier of the board this column belongs to.
	 */
	boardId?: number;

	/**
	 * The title displayed for this column.
	 */
	title: string;

	/**
	 * An optional description of this column.
	 */
	description?: string;

	/**
	 * An array of cards contained within this column.
	 */
	cards: BoardCard<T>[];

	/**
	 * An optional set of inline styles applied to the column.
	 */
	style?: { [key: string]: any };

	/**
	 * A string or array of CSS classes applied to the column.
	 */
	classlist?: string[] | string;

	/**
	 * If true, the column is disabled (e.g., user interactions might be restricted).
	 */
	disabled?: boolean;

	/**
	 * Additional data that can be attached to this column.
	 */
	data?: any;

	/**
	 * If true, sorting cards within this column (via drag-and-drop) is disabled.
	 */
	cardSortingDisabled?: boolean;

	/**
	 * A function to determine whether a dragged item is allowed in this column.
	 *
	 * @param item The dragged item (if any) being tested.
	 * @returns A boolean indicating if the item can be dropped in this column.
	 */
	predicate?: (item?: BoardDragItem<T>) => boolean;
}
