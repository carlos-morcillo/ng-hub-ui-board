/**
 * Represents a drag-and-drop event for board operations.
 * This interface replaces the CDK's CdkDragDrop to provide a lightweight,
 * dependency-free alternative.
 *
 * @template C The type of the container data.
 * @template P The type of the previous container data (defaults to C).
 * @template I The type of the dragged item data (defaults to any).
 * @publicApi
 */
export interface BoardDragDropEvent<C, P = C, I = any> {
	/**
	 * The index of the item in its previous container before dragging.
	 */
	previousIndex: number;

	/**
	 * The index where the item was dropped in the current container.
	 */
	currentIndex: number;

	/**
	 * Data associated with the container where the item was dropped.
	 */
	container: BoardDropContainer<C>;

	/**
	 * Data associated with the container from which the item was dragged.
	 */
	previousContainer: BoardDropContainer<P>;

	/**
	 * The dragged item data.
	 */
	item: BoardDragItem<I>;

	/**
	 * Whether the item was dropped in the same container it started in.
	 */
	isPointerOverContainer: boolean;

	/**
	 * The distance the item was dragged.
	 */
	distance?: { x: number; y: number };

	/**
	 * The point where the item was dropped.
	 */
	dropPoint?: { x: number; y: number };
}

/**
 * Represents a drop container in the board.
 *
 * @template T The type of data associated with the container.
 * @publicApi
 */
export interface BoardDropContainer<T> {
	/**
	 * The data associated with this container.
	 */
	data: T;

	/**
	 * The DOM element of the container.
	 */
	element?: HTMLElement;
}

/**
 * Represents a dragged item in the board.
 *
 * @template T The type of data associated with the item.
 * @publicApi
 */
export interface BoardDragItem<T> {
	/**
	 * The data associated with this item.
	 */
	data: T;

	/**
	 * The DOM element of the dragged item.
	 */
	element?: HTMLElement;
}

/**
 * Type alias for card drag-drop events.
 * @publicApi
 */
export type CardDragDropEvent<T = any> = BoardDragDropEvent<
	import('./board-column').BoardColumn<T>,
	import('./board-column').BoardColumn<T>,
	import('./board-card').BoardCard<T>
>;

/**
 * Type alias for column drag-drop events.
 * @publicApi
 */
export type ColumnDragDropEvent<T = any> = BoardDragDropEvent<
	import('./board-column').BoardColumn<T>[],
	import('./board-column').BoardColumn<T>[],
	import('./board-column').BoardColumn<T>
>;

/**
 * Moves an item within an array from one index to another.
 * This is a replacement for CDK's moveItemInArray utility.
 *
 * @template T The type of items in the array.
 * @param array The array to modify.
 * @param fromIndex The index of the item to move.
 * @param toIndex The index to move the item to.
 * @publicApi
 */
export function moveItemInArray<T>(array: T[], fromIndex: number, toIndex: number): void {
	const clampedFrom = clamp(fromIndex, array.length - 1);
	const clampedTo = clamp(toIndex, array.length - 1);

	if (clampedFrom === clampedTo) {
		return;
	}

	const item = array[clampedFrom];
	const direction = clampedTo < clampedFrom ? -1 : 1;

	for (let i = clampedFrom; i !== clampedTo; i += direction) {
		array[i] = array[i + direction];
	}

	array[clampedTo] = item;
}

/**
 * Transfers an item from one array to another.
 * This is a replacement for CDK's transferArrayItem utility.
 *
 * @template T The type of items in the arrays.
 * @param currentArray The array from which the item should be removed.
 * @param targetArray The array into which the item should be inserted.
 * @param currentIndex The index of the item in the current array.
 * @param targetIndex The index at which to insert the item in the target array.
 * @publicApi
 */
export function transferArrayItem<T>(currentArray: T[], targetArray: T[], currentIndex: number, targetIndex: number): void {
	const clampedCurrentIndex = clamp(currentIndex, currentArray.length - 1);
	const clampedTargetIndex = clamp(targetIndex, targetArray.length);

	if (currentArray.length) {
		targetArray.splice(clampedTargetIndex, 0, currentArray.splice(clampedCurrentIndex, 1)[0]);
	}
}

/**
 * Clamps a number between zero and a maximum value.
 *
 * @param value The value to clamp.
 * @param max The maximum value.
 * @returns The clamped value.
 */
function clamp(value: number, max: number): number {
	return Math.max(0, Math.min(max, value));
}
