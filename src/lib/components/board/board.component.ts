import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { Component, Signal, TemplateRef, computed, contentChild, input, output } from '@angular/core';
import { BoardColumnFooterDirective } from '../../directives/board-column-footer.directive';
import { BoardColumnHeaderDirective } from '../../directives/board-column-header.directive';
import { CardTemplateDirective } from '../../directives/card-template.directive';
import { Board } from '../../models/board';
import { BoardCard } from '../../models/board-card';
import { BoardColumn } from '../../models/board-column';
import { ReachedEndEvent } from '../../models/reached-end-event';

/**
 * Standalone Kanban-style board component that provides column-based drag-and-drop,
 * custom templates and infinite-scroll detection.
 *
 * @publicApi
 */
@Component({
	selector: 'hub-board, hub-ui-board',
	templateUrl: './board.component.html',
	imports: [NgClass, NgStyle, NgTemplateOutlet, DragDropModule],
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
	 * Derived list of board columns exposed as a signal to the template.
	 */
	columns: Signal<Array<BoardColumn>> = computed(() => {
		return this.board()?.columns ?? [];
	});

	/**
	 * When true, column reordering via drag-and-drop is disabled.
	 */
	readonly columnSortingDisabled = input<boolean>(false);

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
	 * Emits each time a card is clicked within the board.
	 */
	readonly onCardClick = output<BoardCard>();

	/**
	 * Emits when a card has been repositioned, either within the same column or into another column.
	 */
	readonly onCardMoved = output<CdkDragDrop<BoardColumn, BoardColumn, BoardCard<any>>>();

	/**
	 * Emits when columns are reordered through drag-and-drop.
	 */
	readonly onColumnMoved = output<CdkDragDrop<BoardColumn[]>>();

	/**
	 * Emits when a column body is scrolled to its end, enabling infinite-scroll behaviour.
	 */
	readonly reachedEnd = output<ReachedEndEvent>();

	/**
	 * Default predicate that allows any card to be dropped into any column.
	 *
	 * @returns Always `true`, indicating that drop operations are permitted.
	 */
	defaultEnterPredicateFn = () => true;

	/**
	 * Emits the clicked card through {@link onCardClick}.
	 *
	 * @param item - The card that triggered the click event.
	 */
	cardClick(item: BoardCard) {
		this.onCardClick.emit(item);
	}

	/**
	 * Updates column order when a drag-and-drop operation completes and emits the resulting event.
	 *
	 * @param event - Drag-and-drop metadata describing the column movement.
	 */
	dropColumn(event: CdkDragDrop<BoardColumn[]>) {
		moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
		this.onColumnMoved.emit(event);
	}

	/**
	 * Applies card reordering or transfer logic depending on the drag-drop target,
	 * then emits the corresponding drag event metadata.
	 *
	 * @param event - Drag-and-drop metadata describing the card movement.
	 */
	dropCard(event: CdkDragDrop<BoardColumn, BoardColumn, BoardCard<any>>) {
		if (event.previousContainer === event.container) {
			// Reorder the card within the same column
			moveItemInArray(event.container.data.cards, event.previousIndex, event.currentIndex);
		} else {
			// Transfer the card from one column to another
			transferArrayItem(
				event.previousContainer.data.cards,
				event.container.data.cards,
				event.previousIndex,
				event.currentIndex
			);
		}
		this.onCardMoved.emit(event);
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
}
