import {
	CdkDragDrop,
	DragDropModule,
	moveItemInArray,
	transferArrayItem
} from '@angular/cdk/drag-drop';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  Signal,
  TemplateRef,
  computed,
  contentChild,
  input,
  output
} from '@angular/core';
import { BoardColumnFooterDirective } from '../../directives/board-column-footer.directive';
import { BoardColumnHeaderDirective } from '../../directives/board-column-header.directive';
import { CardTemplateDirective } from '../../directives/card-template.directive';
import { Board } from '../../models/board';
import { BoardCard } from '../../models/board-card';
import { BoardColumn } from '../../models/board-column';
import { ReachedEndEvent } from '../../models/reached-end-event';

@Component({
	selector: 'hub-board, hub-ui-board',
	templateUrl: './board.component.html',
	styleUrls: ['./board.component.scss'],
	standalone: true,
	imports: [NgClass, NgStyle, NgTemplateOutlet, DragDropModule]
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
	readonly onCardClick = output<BoardCard>();

	// triggered when a card is moved
	readonly onCardMoved = output<CdkDragDrop<BoardColumn, BoardColumn, BoardCard<any>>>();

	// triggered when a column is moved
	readonly onColumnMoved = output<CdkDragDrop<BoardColumn[]>>();

	// emit an event when the user has scrolled to the end of a specific column in the board.
	readonly reachedEnd = output<ReachedEndEvent>();

	/**
	 * Default predicate function that allows all drag and drop operations.
	 * This function is used when no custom predicate is provided for a column.
	 * 
	 * @returns Always returns true, allowing any card to be dropped in any column
	 */
	defaultEnterPredicateFn = () => true;

	/**
	 * Handles card click events and emits the clicked card data.
	 * This method is triggered when a user clicks on a card within the board.
	 *
	 * @param item - The card data object that was clicked
	 */
	cardClick(item: BoardCard) {
		this.onCardClick.emit(item);
	}

	/**
	 * Handles column reordering when a column is dropped after being dragged.
	 * This method updates the column positions in the array and emits a column moved event.
	 *
	 * @param event - The drag and drop event containing information about the moved column
	 */
	dropColumn(event: CdkDragDrop<BoardColumn[]>) {
		moveItemInArray(
			event.container.data,
			event.previousIndex,
			event.currentIndex
		);
		this.onColumnMoved.emit(event);
	}

	/**
	 * Handles card drag and drop operations, supporting both reordering within the same column
	 * and transferring cards between different columns.
	 *
	 * @param event - The drag and drop event containing source/target containers and card data
	 */
	dropCard(event: CdkDragDrop<BoardColumn, BoardColumn, BoardCard<any>>) {
		// Check if the card was moved within the same column
		if (event.previousContainer === event.container) {
			// Reorder the card within the same column
			moveItemInArray(
				event.container.data.cards,
				event.previousIndex,
				event.currentIndex
			);
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
	 * Detects when a column has been scrolled to the bottom and emits a reachedEnd event.
	 * This is useful for implementing lazy loading or infinite scroll functionality.
	 *
	 * @param index - The index of the column that was scrolled
	 * @param event - The scroll event containing target element and scroll position information
	 */
	onScroll(index: number, event: Event) {
		const el = event.target as HTMLElement;
		
		// Check if the element exists and if we've scrolled to the bottom
		if (el && el.scrollTop + el.clientHeight >= el.scrollHeight) {
			// Emit event with column index and data for lazy loading purposes
			this.reachedEnd.emit({
				index,
				data: this.board()?.columns?.[index] ?? []
			});
		}
	}
}
