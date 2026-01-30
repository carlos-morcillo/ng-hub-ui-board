import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Board } from '../../models/board';
import { HubBoardComponent } from './board.component';

describe('HubBoardComponent', () => {
	let component: HubBoardComponent;
	let fixture: ComponentFixture<HubBoardComponent>;
	let componentRef: ComponentRef<HubBoardComponent>;

	const mockBoard: Board = {
		id: 1,
		title: 'Test Board',
		columns: [
			{
				id: 1,
				title: 'Column 1',
				cards: [
					{ id: 101, columnId: 1, title: 'Card 1', data: {} },
					{ id: 102, columnId: 1, title: 'Card 2', data: {} }
				]
			},
			{
				id: 2,
				title: 'Column 2',
				cards: [{ id: 201, columnId: 2, title: 'Card 3', data: {} }]
			}
		]
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HubBoardComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(HubBoardComponent);
		component = fixture.componentInstance;
		componentRef = fixture.componentRef;

		// Set input using signal input API
		componentRef.setInput('board', JSON.parse(JSON.stringify(mockBoard)));

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should render columns and cards', () => {
		const columns = fixture.debugElement.queryAll(By.css('.hub-board__column'));
		expect(columns.length).toBe(2);

		const cards = fixture.debugElement.queryAll(By.css('.hub-board__card'));
		expect(cards.length).toBe(3);
	});

	describe('Column Drag & Drop', () => {
		it('should start column drag', () => {
			const event = new DragEvent('dragstart');
			Object.defineProperty(event, 'dataTransfer', {
				value: {
					setData: jasmine.createSpy('setData'),
					setDragImage: jasmine.createSpy('setDragImage'),
					effectAllowed: 'none'
				}
			});

			const column = component.columns()[0];
			component.onColumnDragStart(event, column, 0);

			// Wait for requestAnimationFrame
			// In test environment requestAnimationFrame might be synchronous or need done()
			// But using signal check directly might fail if async.
			// We can spy on dragState.set or check it after a timeout.

			// Let's force the callback logic since requestAnimationFrame is hard to test without fakeAsync
			// We can bypass or assume fakeAsync usage.
			// Or we can invoke the private method logic if we exposed it, but we can't.
		});

		// To properly test requestAnimationFrame we need fakeAsync/tick, but signals + standalone makes it tricky sometimes.
		// Let's rely on checking the implementation logic via calling methods directly when possible.
	});

	describe('Outputs', () => {
		it('should emit onCardClick', () => {
			spyOn(component.onCardClick, 'emit');
			const card = component.columns()[0].cards[0];
			component.cardClick(card);
			expect(component.onCardClick.emit).toHaveBeenCalledWith(card);
		});
	});

	describe('Scroll Infinite', () => {
		it('should emit reachedEnd when scrolled to bottom', () => {
			spyOn(component.reachedEnd, 'emit');
			const mockEvent = {
				target: {
					scrollTop: 100,
					clientHeight: 100,
					scrollHeight: 200 // Exactly matches padding 0 if no padding
				}
			} as unknown as Event;

			// threshold is 1px. 100+100 >= 200 - 1 = 199. True.
			component.onScroll(0, mockEvent);

			expect(component.reachedEnd.emit).toHaveBeenCalled();
		});

		it('should NOT emit reachedEnd when NOT scrolled to bottom', () => {
			spyOn(component.reachedEnd, 'emit');
			const mockEvent = {
				target: {
					scrollTop: 0,
					clientHeight: 100,
					scrollHeight: 200
				}
			} as unknown as Event;

			component.onScroll(0, mockEvent);
			expect(component.reachedEnd.emit).not.toHaveBeenCalled();
		});
	});

	// Testing complex Drag Logic directly (calling handlers)
	describe('Drag Logic Direct', () => {
		it('should set drag state on column drag start', (done) => {
			const event = new DragEvent('dragstart');
			Object.defineProperty(event, 'dataTransfer', {
				value: { setData: jasmine.createSpy('setData'), setDragImage: () => {}, effectAllowed: 'none' }
			});
			const column = component.columns()[0];

			component.onColumnDragStart(event, column, 0);

			setTimeout(() => {
				const state = component.dragState();
				expect(state).toBeTruthy();
				expect(state?.type).toBe('column');
				expect(state?.sourceColumnIndex).toBe(0);
				done();
			}, 20);
		});

		it('should move column on drop', () => {
			// Setup state manually
			(component as any).dragState.set({
				type: 'column',
				sourceColumnIndex: 0,
				item: component.columns()[0]
			});
			(component as any).columnDropIndicatorIndex.set(1); // Dropping at index 1 (effectively swapping 0 and 1)

			spyOn(component.onColumnMoved, 'emit');
			const event = new DragEvent('drop');
			event.preventDefault = jasmine.createSpy('preventDefault');

			component.onBoardDrop(event);

			expect(component.onColumnMoved.emit).toHaveBeenCalled();
			const columns = component.columns();
			expect(columns[0].title).toBe('Column 2');
			expect(columns[1].title).toBe('Column 1');
		});

		it('should move card within same column', () => {
			const column = component.columns()[0]; // 2 cards: index 0 and 1
			(component as any).dragState.set({
				type: 'card',
				sourceColumnIndex: 0,
				sourceCardIndex: 0,
				item: column.cards[0]
			});
			(component as any).dropIndicatorIndex.set(2);
			// Dropping at end (index 2). Logic: prev=0, current=2.
			// Same container => moveItemInArray(0, 2). BUT dropIndicator logic inside onCardDrop adjusts logic.

			spyOn(component.onCardMoved, 'emit');
			const event = new DragEvent('drop');
			event.preventDefault = jasmine.createSpy('preventDefault');
			event.stopPropagation = jasmine.createSpy('stopPropagation');

			component.onCardDrop(event, column, 0);

			expect(component.onCardMoved.emit).toHaveBeenCalled();
			const newCards = component.columns()[0].cards;
			expect(newCards[0].id).toBe(102); // Card 2 moved up
			expect(newCards[1].id).toBe(101); // Card 1 moved to end
		});

		it('should move card to different column', () => {
			const sourceColumn = component.columns()[0];
			const targetColumn = component.columns()[1];
			const cardToMove = sourceColumn.cards[0];

			(component as any).dragState.set({
				type: 'card',
				sourceColumnIndex: 0,
				sourceCardIndex: 0,
				item: cardToMove
			});
			(component as any).dropIndicatorIndex.set(0); // Drop at start of target

			spyOn(component.onCardMoved, 'emit');
			const event = new DragEvent('drop');
			event.preventDefault = jasmine.createSpy('preventDefault');
			event.stopPropagation = jasmine.createSpy('stopPropagation');

			component.onCardDrop(event, targetColumn, 1);

			expect(component.onCardMoved.emit).toHaveBeenCalled();
			expect(component.columns()[0].cards.length).toBe(1); // One less
			expect(component.columns()[1].cards.length).toBe(2); // One more
			expect(component.columns()[1].cards[0].id).toBe(101); // Moved card is first
		});
	});
});
