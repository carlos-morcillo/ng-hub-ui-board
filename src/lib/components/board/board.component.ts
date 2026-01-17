import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
	Component,
	ElementRef,
	EmbeddedViewRef,
	Signal,
	TemplateRef,
	ViewContainerRef,
	computed,
	contentChild,
	inject,
	input,
	output,
	signal,
	viewChild
} from '@angular/core';
import { BoardColumnFooterDirective } from '../../directives/board-column-footer.directive';
import { BoardColumnHeaderDirective } from '../../directives/board-column-header.directive';
import { CardDragPreviewDirective } from '../../directives/card-drag-preview.directive';
import { CardPlaceholderDirective } from '../../directives/card-placeholder.directive';
import { CardTemplateDirective } from '../../directives/card-template.directive';
import { ColumnDragPreviewDirective } from '../../directives/column-drag-preview.directive';
import { ColumnPlaceholderDirective } from '../../directives/column-placeholder.directive';
import { Board } from '../../models/board';
import { BoardCard } from '../../models/board-card';
import { BoardColumn } from '../../models/board-column';
import {
	BoardDragItem,
	CardDragDropEvent,
	ColumnDragDropEvent,
	moveItemInArray,
	transferArrayItem
} from '../../models/drag-drop-event';
import { ReachedEndEvent } from '../../models/reached-end-event';

/**
 * Internal interface for tracking drag state.
 */
interface DragState {
	type: 'column' | 'card';
	sourceColumnIndex: number;
	sourceCardIndex?: number;
	item: BoardColumn | BoardCard;
	element?: HTMLElement;
}

/**
 * Defines how the dragged element behaves visually during drag operations.
 * - 'ghost': Element becomes semi-transparent but remains visible and occupies space
 * - 'hide': Element is hidden but still occupies space (invisible placeholder)
 * - 'collapse': Element is completely hidden and its space is collapsed
 * @publicApi
 */
export type DragBehavior = 'ghost' | 'hide' | 'collapse';

/**
 * Standalone Kanban-style board component that provides column-based drag-and-drop,
 * custom templates and infinite-scroll detection.
 *
 * @publicApi
 */
@Component({
	selector: 'hub-board, hub-ui-board',
	templateUrl: './board.component.html',
	imports: [NgClass, NgStyle, NgTemplateOutlet],
	host: {
		class: 'hub-board'
	}
})
export class HubBoardComponent {
	/**
	 * Reactive input containing the full board definition (columns and cards).
	 */
	readonly board = input<Board>();

	/**
	 * Pixel threshold used when determining whether a column has reached scroll end.
	 * Allows for fractional scroll values across different browsers.
	 */
	private readonly scrollDetectionPadding = 1;

	/**
	 * Internal signal to track column updates and force re-renders.
	 */
	private readonly _columnsVersion = signal(0);

	/**
	 * Derived list of board columns exposed as a signal to the template.
	 * Depends on both the board input and internal version counter to ensure
	 * re-renders after in-place array mutations.
	 */
	columns: Signal<Array<BoardColumn>> = computed(() => {
		// Subscribe to version changes to force re-computation after mutations
		this._columnsVersion();
		return this.board()?.columns ?? [];
	});

	/**
	 * When true, column reordering via drag-and-drop is disabled.
	 */
	readonly columnSortingDisabled = input<boolean>(false);

	/**
	 * Controls how dragged elements behave visually during drag operations.
	 * - 'ghost': Element becomes semi-transparent (50% opacity) but remains visible
	 * - 'hide': Element is hidden but still occupies its space
	 * - 'collapse': Element is completely hidden and its space is collapsed (default)
	 */
	readonly dragBehavior = input<DragBehavior>('collapse');

	/**
	 * Custom card template supplied via the `cardTpt` structural directive.
	 */
	readonly cardTpt = contentChild(CardTemplateDirective, {
		read: TemplateRef<unknown>
	});

	/**
	 * Custom column header template supplied via the `columnHeaderTpt` structural directive.
	 */
	readonly columnHeaderTpt = contentChild(BoardColumnHeaderDirective, {
		read: TemplateRef<unknown>
	});

	/**
	 * Custom column footer template supplied via the `columnFooterTpt` structural directive.
	 */
	readonly columnFooterTpt = contentChild(BoardColumnFooterDirective, {
		read: TemplateRef<unknown>
	});

	/**
	 * Custom card placeholder template supplied via the `cardPlaceholder` structural directive.
	 * Used to customize the appearance of the drop zone when dragging cards.
	 */
	readonly cardPlaceholderTpt = contentChild(CardPlaceholderDirective, {
		read: TemplateRef<unknown>
	});

	/**
	 * Custom column placeholder template supplied via the `columnPlaceholder` structural directive.
	 * Used to customize the appearance of the drop zone when dragging columns.
	 */
	readonly columnPlaceholderTpt = contentChild(ColumnPlaceholderDirective, {
		read: TemplateRef<unknown>
	});

	/**
	 * Custom card drag preview template supplied via the `cardDragPreview` structural directive.
	 * Used to customize the visual element that follows the cursor when dragging cards.
	 * The template receives `card` (the dragged card) and `column` (the source column) as context.
	 */
	readonly cardDragPreviewTpt = contentChild(CardDragPreviewDirective, {
		read: TemplateRef<unknown>
	});

	/**
	 * Custom column drag preview template supplied via the `columnDragPreview` structural directive.
	 * Used to customize the visual element that follows the cursor when dragging columns.
	 * The template receives `column` (the dragged column) as context.
	 */
	readonly columnDragPreviewTpt = contentChild(ColumnDragPreviewDirective, {
		read: TemplateRef<unknown>
	});

	/**
	 * Reference to the hidden container where drag preview elements are rendered.
	 */
	readonly dragPreviewContainer = viewChild<ElementRef<HTMLElement>>('dragPreviewContainer');

	/**
	 * ViewContainerRef for dynamically creating drag preview views.
	 */
	private readonly viewContainerRef = inject(ViewContainerRef);

	/**
	 * Reference to the currently active drag preview view.
	 */
	private currentDragPreviewView: EmbeddedViewRef<unknown> | null = null;

	/**
	 * Emits each time a card is clicked within the board.
	 */
	readonly onCardClick = output<BoardCard>();

	/**
	 * Emits when a card has been repositioned, either within the same column or into another column.
	 */
	readonly onCardMoved = output<CardDragDropEvent<any>>();

	/**
	 * Emits when columns are reordered through drag-and-drop.
	 */
	readonly onColumnMoved = output<ColumnDragDropEvent<any>>();

	/**
	 * Emits when a column body is scrolled to its end, enabling infinite-scroll behaviour.
	 */
	readonly reachedEnd = output<ReachedEndEvent>();

	/**
	 * Internal drag state tracking.
	 */
	readonly dragState = signal<DragState | null>(null);

	/**
	 * Signal for tracking the currently hovered column index during card drag.
	 */
	readonly hoveredColumnIndex = signal<number | null>(null);

	/**
	 * Signal for tracking the drop indicator position within a column.
	 */
	readonly dropIndicatorIndex = signal<number | null>(null);

	/**
	 * Signal for tracking the column drop indicator position.
	 */
	readonly columnDropIndicatorIndex = signal<number | null>(null);

	/**
	 * Default predicate that allows any card to be dropped into any column.
	 *
	 * @returns Always `true`, indicating that drop operations are permitted.
	 */
	defaultEnterPredicateFn = () => true;

	/**
	 * Returns the card currently being dragged, if any.
	 *
	 * @returns The dragged card or null if no card is being dragged.
	 */
	get draggedCard(): BoardCard | null {
		const state = this.dragState();
		return state?.type === 'card' ? (state.item as BoardCard) : null;
	}

	/**
	 * Returns the column currently being dragged, if any.
	 *
	 * @returns The dragged column or null if no column is being dragged.
	 */
	get draggedColumn(): BoardColumn | null {
		const state = this.dragState();
		return state?.type === 'column' ? (state.item as BoardColumn) : null;
	}

	/**
	 * Emits the clicked card through {@link onCardClick}.
	 *
	 * @param item - The card that triggered the click event.
	 */
	cardClick(item: BoardCard) {
		this.onCardClick.emit(item);
	}

	/**
	 * Track function for columns to ensure proper re-rendering.
	 * Uses column id if available, otherwise falls back to index.
	 *
	 * @param index - The index of the column.
	 * @param column - The column object.
	 * @returns A unique identifier for the column.
	 */
	trackColumnById(index: number, column: BoardColumn): string | number {
		return (column as any).id ?? index;
	}

	/**
	 * Checks if the given column is currently being dragged.
	 *
	 * @param column - The column to check.
	 * @returns Whether the column is being dragged.
	 */
	isDraggingColumn(column: BoardColumn): boolean {
		const state = this.dragState();
		return state?.type === 'column' && state.item === column;
	}

	/**
	 * Checks if the given card is currently being dragged.
	 *
	 * @param card - The card to check.
	 * @returns Whether the card is being dragged.
	 */
	isDraggingCard(card: BoardCard): boolean {
		const state = this.dragState();
		return state?.type === 'card' && state.item === card;
	}

	/**
	 * Handles the drag start event for columns.
	 *
	 * @param event - The native drag event.
	 * @param column - The column being dragged.
	 * @param columnIndex - The index of the column in the board.
	 */
	onColumnDragStart(event: DragEvent, column: BoardColumn, columnIndex: number): void {
		if (this.columnSortingDisabled() || column.disabled) {
			event.preventDefault();
			return;
		}

		const element = event.currentTarget as HTMLElement;

		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = 'move';
			event.dataTransfer.setData('text/plain', `column:${columnIndex}`);

			// Use custom drag preview if template is provided
			const previewTemplate = this.columnDragPreviewTpt();
			if (previewTemplate) {
				const previewElement = this.createDragPreview(previewTemplate, { column });
				if (previewElement) {
					event.dataTransfer.setDragImage(previewElement, 0, 0);
				}
			}
		}

		// Set drag state after a micro-delay to allow the browser to capture the drag image
		// before we hide the element
		requestAnimationFrame(() => {
			this.dragState.set({
				type: 'column',
				sourceColumnIndex: columnIndex,
				item: column,
				element
			});
		});
	}

	/**
	 * Handles the drag end event for columns.
	 *
	 * @param _event - The native drag event (unused).
	 */
	onColumnDragEnd(_event: DragEvent): void {
		this.destroyDragPreview();
		this.columnDropIndicatorIndex.set(null);
		this.dragState.set(null);
	}

	/**
	 * Handles the drag over event for the board container.
	 * Calculates the drop position based on mouse position relative to columns.
	 *
	 * @param event - The native drag event.
	 */
	onBoardDragOver(event: DragEvent): void {
		const state = this.dragState();
		if (!state || state.type !== 'column') {
			return;
		}

		event.preventDefault();
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'move';
		}

		// Find which column we're over based on mouse position
		const boardElement = event.currentTarget as HTMLElement;
		const columnElements = boardElement.querySelectorAll('.hub-board__column-container');
		const mouseX = event.clientX;

		let dropIndex = this.columns().length; // Default to end

		for (let i = 0; i < columnElements.length; i++) {
			const columnElement = columnElements[i] as HTMLElement;
			const rect = columnElement.getBoundingClientRect();
			const columnMiddle = rect.left + rect.width / 2;

			if (mouseX < columnMiddle) {
				dropIndex = i;
				break;
			} else if (mouseX < rect.right) {
				dropIndex = i + 1;
				break;
			}
		}

		this.columnDropIndicatorIndex.set(dropIndex);
	}

	/**
	 * Handles the drop event for the board container (column reordering).
	 *
	 * @param event - The native drag event.
	 */
	onBoardDrop(event: DragEvent): void {
		event.preventDefault();
		const state = this.dragState();

		if (!state || state.type !== 'column') {
			return;
		}

		const dropIndicator = this.columnDropIndicatorIndex();
		if (dropIndicator === null) {
			// No valid drop position - reset state
			this.columnDropIndicatorIndex.set(null);
			this.dragState.set(null);
			return;
		}

		const columns = this.columns();
		const previousIndex = state.sourceColumnIndex;

		// Calculate the actual target index
		// If dropping after the source, we need to subtract 1 because the source will be removed first
		let currentIndex = dropIndicator;
		if (dropIndicator > previousIndex) {
			currentIndex = dropIndicator - 1;
		}

		if (previousIndex !== currentIndex) {
			moveItemInArray(columns, previousIndex, currentIndex);

			// Force re-render by incrementing the version counter
			this._columnsVersion.update((v) => v + 1);

			const dropEvent: ColumnDragDropEvent = {
				previousIndex,
				currentIndex,
				container: { data: columns },
				previousContainer: { data: columns },
				item: { data: state.item as BoardColumn },
				isPointerOverContainer: true
			};

			this.onColumnMoved.emit(dropEvent);
		}

		this.columnDropIndicatorIndex.set(null);
		this.dragState.set(null);
	}

	/**
	 * Handles the drag start event for cards.
	 *
	 * @param event - The native drag event.
	 * @param card - The card being dragged.
	 * @param columnIndex - The index of the column containing the card.
	 * @param cardIndex - The index of the card within the column.
	 */
	onCardDragStart(event: DragEvent, card: BoardCard, columnIndex: number, cardIndex: number): void {
		if (card.disabled) {
			event.preventDefault();
			return;
		}

		event.stopPropagation();

		const element = event.currentTarget as HTMLElement;
		const sourceColumn = this.columns()[columnIndex];

		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = 'move';
			event.dataTransfer.setData('text/plain', `card:${columnIndex}:${cardIndex}`);

			// Use custom drag preview if template is provided
			const previewTemplate = this.cardDragPreviewTpt();
			if (previewTemplate) {
				const previewElement = this.createDragPreview(previewTemplate, { card, column: sourceColumn });
				if (previewElement) {
					event.dataTransfer.setDragImage(previewElement, 0, 0);
				}
			}
		}

		// Set drag state after a micro-delay to allow the browser to capture the drag image
		// before we hide the element
		requestAnimationFrame(() => {
			this.dragState.set({
				type: 'card',
				sourceColumnIndex: columnIndex,
				sourceCardIndex: cardIndex,
				item: card,
				element
			});
		});
	}

	/**
	 * Handles the drag end event for cards.
	 *
	 * @param _event - The native drag event (unused).
	 */
	onCardDragEnd(_event: DragEvent): void {
		this.destroyDragPreview();
		this.hoveredColumnIndex.set(null);
		this.dropIndicatorIndex.set(null);
		this.dragState.set(null);
	}

	/**
	 * Handles the drag over event for column bodies (card drop zones).
	 *
	 * @param event - The native drag event.
	 * @param column - The column being dragged over.
	 * @param columnIndex - The index of the column.
	 */
	onCardDragOver(event: DragEvent, column: BoardColumn, columnIndex: number): void {
		const state = this.dragState();
		if (!state || state.type !== 'card') {
			return;
		}

		// Check if the column accepts this card via predicate
		const predicate = column.predicate ?? this.defaultEnterPredicateFn;
		const dragItem: BoardDragItem<BoardCard> = { data: state.item as BoardCard, element: state.element };

		if (!predicate(dragItem) || column.cardSortingDisabled) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();

		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'move';
		}

		this.hoveredColumnIndex.set(columnIndex);

		// Calculate drop position based on mouse Y position
		const containerElement = event.currentTarget as HTMLElement;
		const cards = containerElement.querySelectorAll('.hub-board__card:not(.hub-board__card--dragging)');
		const mouseY = event.clientY;

		let dropIndex = column.cards.length;

		for (let i = 0; i < cards.length; i++) {
			const cardElement = cards[i] as HTMLElement;
			const rect = cardElement.getBoundingClientRect();
			const cardMiddle = rect.top + rect.height / 2;

			if (mouseY < cardMiddle) {
				// Adjust index to account for the dragged card if in same column
				if (state.sourceColumnIndex === columnIndex && state.sourceCardIndex !== undefined) {
					dropIndex = i <= state.sourceCardIndex ? i : i;
				} else {
					dropIndex = i;
				}
				break;
			}
		}

		this.dropIndicatorIndex.set(dropIndex);
	}

	/**
	 * Handles the drag leave event for column bodies.
	 *
	 * @param event - The native drag event.
	 * @param columnIndex - The index of the column being left.
	 */
	onCardDragLeave(event: DragEvent, columnIndex: number): void {
		const relatedTarget = event.relatedTarget as HTMLElement | null;
		const currentTarget = event.currentTarget as HTMLElement;

		// Only clear if we're actually leaving the container (not entering a child)
		if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
			if (this.hoveredColumnIndex() === columnIndex) {
				this.hoveredColumnIndex.set(null);
				this.dropIndicatorIndex.set(null);
			}
		}
	}

	/**
	 * Handles the drop event for cards.
	 *
	 * @param event - The native drag event.
	 * @param column - The target column.
	 * @param columnIndex - The index of the target column.
	 */
	onCardDrop(event: DragEvent, column: BoardColumn, columnIndex: number): void {
		event.preventDefault();
		event.stopPropagation();

		const state = this.dragState();
		if (!state || state.type !== 'card' || state.sourceCardIndex === undefined) {
			return;
		}

		const columns = this.columns();
		const sourceColumn = columns[state.sourceColumnIndex];
		const targetColumn = column;

		const previousIndex = state.sourceCardIndex;
		let currentIndex = this.dropIndicatorIndex() ?? targetColumn.cards.length;

		// Adjust for same-column moves
		if (state.sourceColumnIndex === columnIndex && previousIndex < currentIndex) {
			currentIndex--;
		}

		const isSameContainer = state.sourceColumnIndex === columnIndex;

		if (isSameContainer) {
			if (previousIndex !== currentIndex) {
				moveItemInArray(targetColumn.cards, previousIndex, currentIndex);
			}
		} else {
			transferArrayItem(sourceColumn.cards, targetColumn.cards, previousIndex, currentIndex);
		}

		// Force re-render by incrementing the version counter
		this._columnsVersion.update((v) => v + 1);

		const dropEvent: CardDragDropEvent = {
			previousIndex,
			currentIndex,
			container: { data: targetColumn },
			previousContainer: { data: sourceColumn },
			item: { data: state.item as BoardCard },
			isPointerOverContainer: true
		};

		this.onCardMoved.emit(dropEvent);

		this.hoveredColumnIndex.set(null);
		this.dropIndicatorIndex.set(null);
		this.dragState.set(null);
	}

	/**
	 * Determines if a column should show the drop indicator.
	 *
	 * @param columnIndex - The index position to check for the drop indicator.
	 * @returns Whether the drop indicator should be shown at this position.
	 */
	shouldShowColumnDropIndicator(columnIndex: number): boolean {
		const state = this.dragState();
		if (state?.type !== 'column') {
			return false;
		}
		return this.columnDropIndicatorIndex() === columnIndex;
	}

	/**
	 * Determines if a card drop indicator should be shown at a specific position.
	 *
	 * @param columnIndex - The index of the column.
	 * @param cardIndex - The index where the indicator would appear.
	 * @returns Whether the drop indicator should be shown.
	 */
	shouldShowCardDropIndicator(columnIndex: number, cardIndex: number): boolean {
		const state = this.dragState();
		if (state?.type !== 'card') {
			return false;
		}

		return this.hoveredColumnIndex() === columnIndex && this.dropIndicatorIndex() === cardIndex;
	}

	/**
	 * Emits {@link reachedEnd} once a column body is scrolled to its bottom.
	 *
	 * @param index - Index of the scrolled column within the board.
	 * @param event - Browser scroll event originating from the column body element.
	 */
	onScroll(index: number, event: Event) {
		const el = event.target as HTMLElement | null;
		if (!el) {
			return;
		}

		const scrolledToBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - this.scrollDetectionPadding;

		if (!scrolledToBottom) {
			return;
		}

		const column = this.board()?.columns?.[index];
		if (!column) {
			return;
		}

		this.reachedEnd.emit({
			index,
			data: column
		});
	}

	/**
	 * Creates a custom drag preview element from a template and renders it in a hidden container.
	 * The element must be in the DOM for setDragImage to work properly.
	 *
	 * @param template - The template to render as the drag preview.
	 * @param context - The context to pass to the template.
	 * @returns The native HTML element to use as the drag image, or null if creation failed.
	 */
	private createDragPreview(template: TemplateRef<unknown>, context: Record<string, unknown>): HTMLElement | null {
		// Destroy any existing preview first
		this.destroyDragPreview();

		// Create the embedded view from the template
		const viewRef = this.viewContainerRef.createEmbeddedView(template, context);
		this.currentDragPreviewView = viewRef;

		// Detect changes to ensure the view is rendered
		viewRef.detectChanges();

		// Get the container element
		const container = this.dragPreviewContainer();
		if (!container) {
			return null;
		}

		// Append all root nodes from the view to the container
		for (const node of viewRef.rootNodes) {
			if (node instanceof HTMLElement) {
				container.nativeElement.appendChild(node);
			}
		}

		// Return the first element node as the drag image
		const firstElement = viewRef.rootNodes.find((node): node is HTMLElement => node instanceof HTMLElement);
		return firstElement ?? null;
	}

	/**
	 * Destroys the current drag preview view and cleans up related resources.
	 */
	private destroyDragPreview(): void {
		if (this.currentDragPreviewView) {
			this.currentDragPreviewView.destroy();
			this.currentDragPreviewView = null;
		}

		// Clear the container
		const container = this.dragPreviewContainer();
		if (container) {
			container.nativeElement.innerHTML = '';
		}
	}
}
