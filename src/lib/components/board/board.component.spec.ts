import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { HubBoardComponent } from './board.component';
import { Board } from '../../models/board';
import { BoardCard } from '../../models/board-card';
import { CardTemplateDirective } from '../../directives/card-template.directive';
import { BoardColumnHeaderDirective } from '../../directives/board-column-header.directive';
import { BoardColumnFooterDirective } from '../../directives/board-column-footer.directive';

/**
 * Test host component to test templates and directives
 */
@Component({
	template: `
		<hub-board
			[board]="board()"
			[columnSortingDisabled]="columnSortingDisabled"
			(onCardClick)="onCardClick($event)"
			(onCardMoved)="onCardMoved($event)"
			(onColumnMoved)="onColumnMoved($event)"
			(reachedEnd)="onReachedEnd($event)">

			<ng-template cardTpt let-card="item" let-column="column">
				<div class="test-card" [attr.data-title]="card.title">
					<h4>{{ card.title }}</h4>
					<p>{{ card.description }}</p>
					<span class="column-title">{{ column.title }}</span>
				</div>
			</ng-template>

			<ng-template columnHeaderTpt let-column="column">
				<div class="test-header" [attr.data-column]="column.title">
					<h3>{{ column.title }}</h3>
					<span class="card-count">{{ column.cards.length }}</span>
				</div>
			</ng-template>

			<ng-template columnFooterTpt let-column="column">
				<div class="test-footer" [attr.data-column]="column.title">
					<button>Add Card</button>
				</div>
			</ng-template>
		</hub-board>
	`,
	standalone: true,
	imports: [
		HubBoardComponent,
		CardTemplateDirective,
		BoardColumnHeaderDirective,
		BoardColumnFooterDirective
	]
})
class TestHostComponent {
	board = signal<Board>({
		title: 'Test Board',
		columns: [
			{
				title: 'To Do',
				cards: [
					{ id: 1, title: 'Task 1', description: 'Description 1' },
					{ id: 2, title: 'Task 2', description: 'Description 2' }
				]
			},
			{
				title: 'In Progress',
				cards: [
					{ id: 3, title: 'Task 3', description: 'Description 3' }
				]
			},
			{
				title: 'Done',
				cards: []
			}
		]
	});

	columnSortingDisabled = false;
	cardClickEvents: BoardCard[] = [];
	cardMovedEvents: any[] = [];
	columnMovedEvents: any[] = [];
	reachedEndEvents: any[] = [];

	onCardClick(card: BoardCard) {
		this.cardClickEvents.push(card);
	}

	onCardMoved(event: any) {
		this.cardMovedEvents.push(event);
	}

	onColumnMoved(event: any) {
		this.columnMovedEvents.push(event);
	}

	onReachedEnd(event: any) {
		this.reachedEndEvents.push(event);
	}
}

describe('HubBoardComponent', () => {
	let component: HubBoardComponent;
	let fixture: ComponentFixture<HubBoardComponent>;
	let hostComponent: TestHostComponent;
	let hostFixture: ComponentFixture<TestHostComponent>;

	const mockBoard: Board = {
		id: 1,
		title: 'Test Board',
		description: 'Test Description',
		columns: [
			{
				id: 1,
				title: 'Column 1',
				description: 'Column 1 description',
				cards: [
					{ id: 1, title: 'Card 1', description: 'Card 1 description', disabled: false },
					{ id: 2, title: 'Card 2', description: 'Card 2 description', disabled: true }
				],
				disabled: false,
				cardSortingDisabled: false
			},
			{
				id: 2,
				title: 'Column 2',
				description: 'Column 2 description',
				cards: [
					{ id: 3, title: 'Card 3', description: 'Card 3 description' }
				],
				disabled: true
			}
		]
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				HubBoardComponent,
				NoopAnimationsModule,
				TestHostComponent
			]
		}).compileComponents();
	});

	describe('Standalone Component', () => {
		beforeEach(() => {
			fixture = TestBed.createComponent(HubBoardComponent);
			component = fixture.componentInstance;
		});

		it('should create', () => {
			expect(component).toBeTruthy();
		});

		it('should have default values for inputs', () => {
			expect(component.board()).toBeUndefined();
			expect(component.columnSortingDisabled()).toBeFalse();
		});

		it('should compute columns from board signal', () => {
			expect(component.columns()).toEqual([]);

			fixture.componentRef.setInput('board', mockBoard);
			fixture.detectChanges();

			expect(component.columns()).toEqual(mockBoard.columns || []);
		});

		it('should return empty array when board has no columns', () => {
			const boardWithoutColumns: Board = { title: 'Test', columns: undefined };
			fixture.componentRef.setInput('board', boardWithoutColumns);
			fixture.detectChanges();

			expect(component.columns()).toEqual([]);
		});

		it('should handle undefined board gracefully', () => {
			fixture.componentRef.setInput('board', undefined);
			fixture.detectChanges();

			expect(component.columns()).toEqual([]);
		});

		it('should have default enter predicate function', () => {
			expect(component.defaultEnterPredicateFn()).toBe(true);
		});

		describe('Event Emitters', () => {
			it('should emit onCardClick when cardClick is called', () => {
				spyOn(component.onCardClick, 'emit');
				const mockCard: BoardCard = { title: 'Test Card' };

				component.cardClick(mockCard);

				expect(component.onCardClick.emit).toHaveBeenCalledWith(mockCard);
			});

			it('should emit reachedEnd when onScroll reaches bottom', () => {
				spyOn(component.reachedEnd, 'emit');
				fixture.componentRef.setInput('board', mockBoard);
				fixture.detectChanges();

				const mockElement = {
					scrollTop: 100,
					clientHeight: 100,
					scrollHeight: 200
				};
				const mockEvent = { target: mockElement } as any;

				component.onScroll(0, mockEvent);

				expect(component.reachedEnd.emit).toHaveBeenCalledWith({
					index: 0,
					data: mockBoard.columns![0]
				});
			});

			it('should not emit reachedEnd when not at bottom', () => {
				spyOn(component.reachedEnd, 'emit');
				const mockElement = {
					scrollTop: 50,
					clientHeight: 100,
					scrollHeight: 200
				};
				const mockEvent = { target: mockElement } as any;

				component.onScroll(0, mockEvent);

				expect(component.reachedEnd.emit).not.toHaveBeenCalled();
			});

			it('should not emit reachedEnd when column data is missing', () => {
				spyOn(component.reachedEnd, 'emit');
				fixture.componentRef.setInput('board', { title: 'Empty Board', columns: [] });
				fixture.detectChanges();

				const mockElement = {
					scrollTop: 100,
					clientHeight: 100,
					scrollHeight: 200
				};
				const mockEvent = { target: mockElement } as any;

				component.onScroll(0, mockEvent);

				expect(component.reachedEnd.emit).not.toHaveBeenCalled();
			});
		});

		describe('Native Drag and Drop', () => {
			beforeEach(() => {
				fixture.componentRef.setInput('board', mockBoard);
				fixture.detectChanges();
			});

			it('should handle column drag start', () => {
				const column = mockBoard.columns![0];
				const mockEvent = {
					preventDefault: jasmine.createSpy('preventDefault'),
					currentTarget: document.createElement('div'),
					dataTransfer: { effectAllowed: '', setData: jasmine.createSpy('setData') }
				} as any;

				component.onColumnDragStart(mockEvent, column, 0);

				expect(mockEvent.dataTransfer.effectAllowed).toBe('move');
				expect(mockEvent.dataTransfer.setData).toHaveBeenCalledWith('text/plain', 'column:0');
			});

			it('should prevent drag start for disabled columns', () => {
				const disabledColumn = mockBoard.columns![1]; // Column 2 is disabled
				const mockEvent = {
					preventDefault: jasmine.createSpy('preventDefault'),
					currentTarget: document.createElement('div'),
					dataTransfer: { effectAllowed: '', setData: jasmine.createSpy('setData') }
				} as any;

				component.onColumnDragStart(mockEvent, disabledColumn, 1);

				expect(mockEvent.preventDefault).toHaveBeenCalled();
			});

			it('should prevent drag start when column sorting is disabled', () => {
				fixture.componentRef.setInput('columnSortingDisabled', true);
				fixture.detectChanges();

				const column = mockBoard.columns![0];
				const mockEvent = {
					preventDefault: jasmine.createSpy('preventDefault'),
					currentTarget: document.createElement('div'),
					dataTransfer: { effectAllowed: '', setData: jasmine.createSpy('setData') }
				} as any;

				component.onColumnDragStart(mockEvent, column, 0);

				expect(mockEvent.preventDefault).toHaveBeenCalled();
			});

			it('should handle card drag start', () => {
				const card = mockBoard.columns![0].cards[0];
				const mockEvent = {
					preventDefault: jasmine.createSpy('preventDefault'),
					stopPropagation: jasmine.createSpy('stopPropagation'),
					currentTarget: document.createElement('div'),
					dataTransfer: { effectAllowed: '', setData: jasmine.createSpy('setData') }
				} as any;

				component.onCardDragStart(mockEvent, card, 0, 0);

				expect(mockEvent.stopPropagation).toHaveBeenCalled();
				expect(mockEvent.dataTransfer.effectAllowed).toBe('move');
				expect(mockEvent.dataTransfer.setData).toHaveBeenCalledWith('text/plain', 'card:0:0');
			});

			it('should prevent drag start for disabled cards', () => {
				const disabledCard = mockBoard.columns![0].cards[1]; // Card 2 is disabled
				const mockEvent = {
					preventDefault: jasmine.createSpy('preventDefault'),
					stopPropagation: jasmine.createSpy('stopPropagation'),
					currentTarget: document.createElement('div'),
					dataTransfer: { effectAllowed: '', setData: jasmine.createSpy('setData') }
				} as any;

				component.onCardDragStart(mockEvent, disabledCard, 0, 1);

				expect(mockEvent.preventDefault).toHaveBeenCalled();
			});

			it('should show column drop indicator correctly', () => {
				// Simulate column drag in progress
				const column = mockBoard.columns![0];
				const startEvent = {
					preventDefault: jasmine.createSpy('preventDefault'),
					currentTarget: document.createElement('div'),
					dataTransfer: { effectAllowed: '', setData: jasmine.createSpy('setData') }
				} as any;

				component.onColumnDragStart(startEvent, column, 0);
				component['columnDropIndicatorIndex'].set(1);

				expect(component.shouldShowColumnDropIndicator(1)).toBe(true);
				expect(component.shouldShowColumnDropIndicator(0)).toBe(false); // Source column
				expect(component.shouldShowColumnDropIndicator(2)).toBe(false);
			});
		});
	});

	describe('Component with Templates', () => {
		beforeEach(() => {
			hostFixture = TestBed.createComponent(TestHostComponent);
			hostComponent = hostFixture.componentInstance;
			hostFixture.detectChanges();
		});

		it('should render board with custom templates', () => {
			const boardElement = hostFixture.debugElement.query(By.css('hub-board'));
			expect(boardElement).toBeTruthy();

			const customCards = hostFixture.debugElement.queryAll(By.css('.test-card'));
			expect(customCards.length).toBe(3); // Total cards across all columns

			const customHeaders = hostFixture.debugElement.queryAll(By.css('.test-header'));
			expect(customHeaders.length).toBe(3); // One per column

			const customFooters = hostFixture.debugElement.queryAll(By.css('.test-footer'));
			expect(customFooters.length).toBe(3); // One per column
		});

		it('should display card content from custom template', () => {
			const firstCard = hostFixture.debugElement.query(By.css('.test-card'));
			expect(firstCard.nativeElement.getAttribute('data-title')).toBe('Task 1');
			expect(firstCard.nativeElement.textContent).toContain('Task 1');
			expect(firstCard.nativeElement.textContent).toContain('Description 1');
			expect(firstCard.nativeElement.textContent).toContain('To Do');
		});

		it('should display column header from custom template', () => {
			const firstHeader = hostFixture.debugElement.query(By.css('.test-header'));
			expect(firstHeader.nativeElement.getAttribute('data-column')).toBe('To Do');
			expect(firstHeader.nativeElement.textContent).toContain('To Do');
			expect(firstHeader.nativeElement.textContent).toContain('2'); // Card count
		});

		it('should handle card clicks', () => {
			const cardElement = hostFixture.debugElement.query(By.css('.hub-board__card'));
			cardElement.nativeElement.click();

			expect(hostComponent.cardClickEvents.length).toBe(1);
			expect(hostComponent.cardClickEvents[0].title).toBe('Task 1');
		});

		it('should disable column sorting when input is true', () => {
			hostComponent.columnSortingDisabled = true;
			hostFixture.detectChanges();

			const boardElement = hostFixture.debugElement.query(By.css('.hub-board'));
			expect(boardElement).toBeTruthy();

			// Check if the component property is set correctly
			const boardComponentInstance = hostFixture.debugElement.query(By.directive(HubBoardComponent)).componentInstance;
			expect(boardComponentInstance.columnSortingDisabled()).toBe(true);
		});

		it('should handle empty board gracefully', () => {
			hostComponent.board.set({ title: 'Empty Board', columns: [] });
			hostFixture.detectChanges();

			const columns = hostFixture.debugElement.queryAll(By.css('.hub-board__column'));
			expect(columns.length).toBe(0);
		});

		it('should handle board with no columns property', () => {
			hostComponent.board.set({ title: 'No Columns Board' });
			hostFixture.detectChanges();

			const columns = hostFixture.debugElement.queryAll(By.css('.hub-board__column'));
			expect(columns.length).toBe(0);
		});
	});

	describe('Accessibility', () => {
		beforeEach(() => {
			hostFixture = TestBed.createComponent(TestHostComponent);
			hostComponent = hostFixture.componentInstance;
			hostFixture.detectChanges();
		});

		it('should have proper draggable attributes on columns', () => {
			const columnContainers = hostFixture.debugElement.queryAll(By.css('.hub-board__column-container'));
			expect(columnContainers.length).toBeGreaterThan(0);

			// Check that draggable is set
			columnContainers.forEach(container => {
				expect(container.nativeElement.getAttribute('draggable')).toBeTruthy();
			});
		});

		it('should have proper draggable attributes on cards', () => {
			const cards = hostFixture.debugElement.queryAll(By.css('.hub-board__card'));
			expect(cards.length).toBeGreaterThan(0);

			// Check that draggable is set on non-disabled cards
			cards.forEach(card => {
				const draggable = card.nativeElement.getAttribute('draggable');
				expect(draggable).toBeTruthy();
			});
		});

		it('should disable dragging for disabled cards', () => {
			// Update board to have a disabled card
			const boardWithDisabledCard: Board = {
				title: 'Test Board',
				columns: [
					{
						title: 'Column 1',
						cards: [
							{ title: 'Card 1', disabled: true }
						]
					}
				]
			};

			hostComponent.board.set(boardWithDisabledCard);
			hostFixture.detectChanges();

			const disabledCard = hostFixture.debugElement.query(By.css('.hub-board__card--disabled'));
			expect(disabledCard).toBeTruthy();
			expect(disabledCard.nativeElement.getAttribute('draggable')).toBe('false');
		});
	});

	describe('Error Handling', () => {
		beforeEach(() => {
			fixture = TestBed.createComponent(HubBoardComponent);
			component = fixture.componentInstance;
		});

		it('should handle null scroll event target', () => {
			const mockEvent = { target: null } as any;

			expect(() => component.onScroll(0, mockEvent)).not.toThrow();
		});

		it('should handle scroll event with undefined board', () => {
			const mockElement = {
				scrollTop: 100,
				clientHeight: 100,
				scrollHeight: 200
			};
			const mockEvent = { target: mockElement } as any;

			expect(() => component.onScroll(0, mockEvent)).not.toThrow();
		});

		it('should handle invalid column index in onScroll', () => {
			spyOn(component.reachedEnd, 'emit');
			fixture.componentRef.setInput('board', mockBoard);
			fixture.detectChanges();

			const mockElement = {
				scrollTop: 100,
				clientHeight: 100,
				scrollHeight: 200
			};
			const mockEvent = { target: mockElement } as any;

			component.onScroll(999, mockEvent);

			// Should not emit because column at index 999 doesn't exist
			expect(component.reachedEnd.emit).not.toHaveBeenCalled();
		});
	});
});
