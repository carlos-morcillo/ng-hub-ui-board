import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DragDropModule } from '@angular/cdk/drag-drop';
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
				DragDropModule,
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
				spyOn(component.onCardClick, 'next');
				const mockCard: BoardCard = { title: 'Test Card' };
				
				component.cardClick(mockCard);
				
				expect(component.onCardClick.next).toHaveBeenCalledWith(mockCard);
			});

			it('should emit onColumnMoved when dropColumn is called', () => {
				spyOn(component.onColumnMoved, 'emit');
				const mockEvent = {
					container: { data: [{ title: 'Col1' }, { title: 'Col2' }] },
					previousIndex: 0,
					currentIndex: 1
				} as any;

				component.dropColumn(mockEvent);

				expect(component.onColumnMoved.emit).toHaveBeenCalledWith(mockEvent);
			});

			it('should emit onCardMoved when dropCard is called', () => {
				spyOn(component.onCardMoved, 'emit');
				const mockEvent = {
					previousContainer: { data: { cards: [{ title: 'Card1' }] } },
					container: { data: { cards: [] } },
					previousIndex: 0,
					currentIndex: 0
				} as any;

				component.dropCard(mockEvent);

				expect(component.onCardMoved.emit).toHaveBeenCalledWith(mockEvent);
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

		describe('Drag and Drop Logic', () => {
			it('should move card within same column', () => {
				const cards = [{ title: 'Card1' }, { title: 'Card2' }, { title: 'Card3' }];
				const column = { cards };
				const mockEvent = {
					previousContainer: { data: column },
					container: { data: column },
					previousIndex: 0,
					currentIndex: 2
				} as any;

				component.dropCard(mockEvent);

				expect(cards[2].title).toBe('Card1');
				expect(cards[0].title).toBe('Card2');
			});

			it('should transfer card between columns', () => {
				const sourceCards = [{ title: 'Card1' }, { title: 'Card2' }];
				const targetCards = [{ title: 'Card3' }];
				const mockEvent = {
					previousContainer: { data: { cards: sourceCards } },
					container: { data: { cards: targetCards } },
					previousIndex: 0,
					currentIndex: 1
				} as any;

				component.dropCard(mockEvent);

				expect(sourceCards.length).toBe(1);
				expect(targetCards.length).toBe(2);
				expect(targetCards[1].title).toBe('Card1');
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

		it('should have proper drag and drop attributes', () => {
			const dragElements = hostFixture.debugElement.queryAll(By.css('[cdkDrag]'));
			expect(dragElements.length).toBeGreaterThan(0);

			const dropElements = hostFixture.debugElement.queryAll(By.css('[cdkDropList]'));
			expect(dropElements.length).toBeGreaterThan(0);
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

			expect(component.reachedEnd.emit).toHaveBeenCalledWith({
				index: 999,
				data: []
			});
		});
	});
});
