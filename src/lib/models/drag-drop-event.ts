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

// The array move/transfer helpers used when reordering cards and columns now live in the
// shared `ng-hub-ui-utils` drag-and-drop core and are re-exported from `./array-helpers`
// (kept in a dedicated file so the external re-export does not sit alongside the inline
// `import('./board-column')` type references above, which trips ng-packagr's compiler).
