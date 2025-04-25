import {
	CdkDragDrop,
	DragDropModule,
	moveItemInArray,
	transferArrayItem
} from '@angular/cdk/drag-drop';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
	Component,
	EventEmitter,
	Output,
	Signal,
	TemplateRef,
	computed,
	contentChild,
	input
} from '@angular/core';
import { Board } from '../../board';
import { BoardCard } from '../../board-card';
import { BoardColumn } from '../../board-column';
import { BoardColumnFooterDirective } from '../../board-column-footer.directive';
import { BoardColumnHeaderDirective } from '../../board-column-header.directive';
import { CardTemplateDirective } from '../../card-template.directive';
import { ReachedEndEvent } from '../../reached-end-event';

@Component({
	selector: 'hub-board, hub-ui-board',
	templateUrl: './board.component.html',
	styleUrls: ['./board.component.scss'],
	standalone: true,
	imports: [NgClass, NgStyle, NgTemplateOutlet, DragDropModule],
	host: {
		class: 'd-block'
	}
})
export class HubBoardComponent {
	readonly board = input<Board>();

	columns: Signal<Array<BoardColumn>> = computed(() => {
		return this.board()?.columns ?? [];
	});

	// Used to disable the sorting of columns in the board
	readonly columnSortingDisabled = input<boolean>(false);

	// A template reference for the card template
	readonly cardTpt = contentChild(CardTemplateDirective, {
		read: TemplateRef<unknown>
	});

	// A template reference for the column header template
	readonly columnHeaderTpt = contentChild(BoardColumnHeaderDirective, {
		read: TemplateRef<unknown>
	});

	// A template reference for the column footer template
	readonly columnFooterTpt = contentChild(BoardColumnFooterDirective, {
		read: TemplateRef<unknown>
	});

	// triggered when a card is clicked
	@Output() onCardClick = new EventEmitter<BoardCard>();

	// triggered when a card is moved
	@Output() onCardMoved = new EventEmitter<
		CdkDragDrop<BoardColumn, BoardColumn, BoardCard<any>>
	>();

	// triggered when a column is moved
	@Output() onColumnMoved = new EventEmitter<CdkDragDrop<BoardColumn[]>>();

	// emit an event when the user has scrolled to the end of a specific column in the board.
	@Output() reachedEnd = new EventEmitter<ReachedEndEvent>();

	/* Defines a default enter predicate function for the drag and drop operation. */
	defaultEnterPredicateFn = () => true;

	/**
	 * Emits an event with the clicked item as a parameter.
	 *
	 * @param {any} item - Represents the item that was clicked on the card.
	 */
	cardClick(item: any) {
		this.onCardClick.next(item);
	}

	/**
	 * Used to handle the event when a column is dropped in a drag and drop operation, and it moves the column in the array and
	 * emits an event.
	 *
	 * @param event - represents the drag and drop event that occurred.
	 */
	dropColumn(event: CdkDragDrop<any>) {
		moveItemInArray(
			event.container.data,
			event.previousIndex,
			event.currentIndex
		);
		this.onColumnMoved.emit(event);
	}

	/**
	 * Used to handle the dropping of a card in a drag and drop operation, either moving the card within the same container or
	 * transferring it to a different container.
	 *
	 * @param event - a generic type that takes three arguments:
	 */
	dropCard(event: CdkDragDrop<BoardColumn, BoardColumn, BoardCard<any>>) {
		if (event.previousContainer === event.container) {
			moveItemInArray(
				event.container.data.cards,
				event.previousIndex,
				event.currentIndex
			);
		} else {
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
	 * Checks if the user has scrolled to the end of a specific element and emits an event if so.
	 *
	 * @param {number} index - The index parameter is a number that represents the index of the column being scrolled.
	 * @param {Event} event - The event parameter is an object that represents the scroll event. It contains information about the
	 * scroll event, such as the source element that triggered the event, the amount of scrolling that has occurred, and the dimensions
	 * of the scrollable area.
	 */
	onScroll(index: number, event: Event) {
		const el = event.target as HTMLElement;
		if (el && el.scrollTop + el.clientHeight >= el.scrollHeight) {
			this.reachedEnd.emit({
				index,
				data: this.board()?.columns?.[index] ?? []
			});
		}
	}
}
