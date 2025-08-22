import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { BoardColumnFooterDirective } from './board-column-footer.directive';

/**
 * Test component to verify the directive functionality
 */
@Component({
	template: `
		<ng-template columnFooterTpt let-column="column" #footerTemplate>
			<div class="test-footer-template" [attr.data-column-id]="column.id">
				<div class="footer-summary">
					<span class="total-cards">Total: {{ column.cards.length }}</span>
					<span class="completed-cards" *ngIf="getCompletedCards(column) > 0">
						Completed: {{ getCompletedCards(column) }}
					</span>
					<span class="priority-cards" *ngIf="getPriorityCards(column) > 0">
						High Priority: {{ getPriorityCards(column) }}
					</span>
				</div>
				<div class="footer-actions">
					<button class="quick-add-btn" *ngIf="!column.disabled">Quick Add</button>
					<button class="clear-all-btn" *ngIf="column.cards.length > 0 && !column.disabled">
						Clear All
					</button>
					<span class="disabled-footer" *ngIf="column.disabled">Column Disabled</span>
				</div>
				<div class="footer-metadata" *ngIf="column.data">
					<small class="last-updated">Updated: {{ column.data.lastUpdated | date }}</small>
					<small class="column-owner">Owner: {{ column.data.owner }}</small>
				</div>
			</div>
		</ng-template>

		<ng-template columnFooterTpt #simpleFooterTemplate>
			<div class="simple-footer">
				<span>Simple Footer</span>
			</div>
		</ng-template>

		<ng-template columnFooterTpt let-column="column" #statsFooterTemplate>
			<div class="stats-footer" [attr.data-stats]="true">
				<div class="stats-grid">
					<div class="stat-item">
						<span class="stat-value">{{ column.cards.length }}</span>
						<span class="stat-label">Cards</span>
					</div>
					<div class="stat-item" *ngIf="column.data?.estimatedHours">
						<span class="stat-value">{{ column.data.estimatedHours }}h</span>
						<span class="stat-label">Hours</span>
					</div>
				</div>
			</div>
		</ng-template>

		<!-- Template without directive for comparison -->
		<ng-template #regularTemplate>
			<div class="regular-template">Regular template</div>
		</ng-template>
	`,
	standalone: true,
	imports: [BoardColumnFooterDirective, CommonModule]
})
class TestComponent {
	@ViewChild('footerTemplate', { read: BoardColumnFooterDirective }) 
	footerDirective!: BoardColumnFooterDirective;

	@ViewChild('footerTemplate', { read: TemplateRef }) 
	templateRef!: TemplateRef<any>;

	@ViewChild('simpleFooterTemplate', { read: BoardColumnFooterDirective })
	simpleFooterDirective!: BoardColumnFooterDirective;

	@ViewChild('statsFooterTemplate', { read: BoardColumnFooterDirective })
	statsFooterDirective!: BoardColumnFooterDirective;

	@ViewChild('regularTemplate', { read: TemplateRef })
	regularTemplateRef!: TemplateRef<any>;

	// Test data
	mockColumn = {
		id: 1,
		title: 'Test Column',
		description: 'Test column description',
		cards: [
			{ id: 1, title: 'Card 1', data: { completed: true, priority: 'low' } },
			{ id: 2, title: 'Card 2', data: { completed: false, priority: 'high' } },
			{ id: 3, title: 'Card 3', data: { completed: true, priority: 'medium' } },
			{ id: 4, title: 'Card 4', data: { completed: false, priority: 'high' } }
		],
		disabled: false,
		data: {
			lastUpdated: new Date('2024-01-15T10:30:00Z'),
			owner: 'Jane Doe',
			estimatedHours: 24
		}
	};

	mockDisabledColumn = {
		id: 2,
		title: 'Disabled Column',
		description: 'This column is disabled',
		cards: [
			{ id: 5, title: 'Disabled Card 1' }
		],
		disabled: true
	};

	mockEmptyColumn = {
		id: 3,
		title: 'Empty Column',
		cards: [],
		disabled: false
	};

	// Helper methods used in template
	getCompletedCards(column: any): number {
		return column.cards?.filter((card: any) => card.data?.completed).length || 0;
	}

	getPriorityCards(column: any): number {
		return column.cards?.filter((card: any) => card.data?.priority === 'high').length || 0;
	}
}

describe('BoardColumnFooterDirective', () => {
	let component: TestComponent;
	let fixture: ComponentFixture<TestComponent>;
	let directive: BoardColumnFooterDirective;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TestComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(TestComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		directive = component.footerDirective;
	});

	describe('Basic Functionality', () => {
		it('should create an instance', () => {
			expect(directive).toBeTruthy();
		});

		it('should be a BoardColumnFooterDirective instance', () => {
			expect(directive).toBeInstanceOf(BoardColumnFooterDirective);
		});

		it('should have templateRef property', () => {
			expect(directive.templateRef).toBeTruthy();
			expect(directive.templateRef).toBeInstanceOf(TemplateRef);
		});

		it('should expose the same templateRef as accessed directly', () => {
			expect(directive.templateRef).toBe(component.templateRef);
		});
	});

	describe('Template Reference Behavior', () => {
		it('should provide access to template content through templateRef', () => {
			const embeddedView = directive.templateRef.createEmbeddedView({
				column: component.mockColumn
			});

			const templateElement = embeddedView.rootNodes[0] as HTMLElement;
			
			expect(templateElement).toBeTruthy();
			expect(templateElement.classList.contains('test-footer-template')).toBe(true);
			expect(templateElement.getAttribute('data-column-id')).toBe('1');
		});

		it('should render template with column context and computed values', () => {
			const embeddedView = directive.templateRef.createEmbeddedView({
				column: component.mockColumn
			});

			embeddedView.detectChanges();
			const templateElement = embeddedView.rootNodes[0] as HTMLElement;

			expect(templateElement.textContent).toContain('Total: 4'); // Total cards
			expect(templateElement.textContent).toContain('Completed: 2'); // Completed cards
			expect(templateElement.textContent).toContain('High Priority: 2'); // High priority cards
			expect(templateElement.textContent).toContain('Quick Add');
			expect(templateElement.textContent).toContain('Clear All');
			expect(templateElement.textContent).toContain('Jane Doe'); // Owner
		});

		it('should handle disabled column state', () => {
			const embeddedView = directive.templateRef.createEmbeddedView({
				column: component.mockDisabledColumn
			});

			embeddedView.detectChanges();
			const templateElement = embeddedView.rootNodes[0] as HTMLElement;

			expect(templateElement.textContent).toContain('Total: 1');
			expect(templateElement.textContent).toContain('Column Disabled');
			expect(templateElement.textContent).not.toContain('Quick Add');
			expect(templateElement.textContent).not.toContain('Clear All');
		});

		it('should handle empty column', () => {
			const embeddedView = directive.templateRef.createEmbeddedView({
				column: component.mockEmptyColumn
			});

			embeddedView.detectChanges();
			const templateElement = embeddedView.rootNodes[0] as HTMLElement;

			expect(templateElement.textContent).toContain('Total: 0');
			expect(templateElement.textContent).not.toContain('Completed:');
			expect(templateElement.textContent).not.toContain('High Priority:');
			expect(templateElement.textContent).not.toContain('Clear All');
			expect(templateElement.textContent).toContain('Quick Add');
		});

		it('should handle template without context data', () => {
			const embeddedView = directive.templateRef.createEmbeddedView({});
			
			expect(embeddedView).toBeTruthy();
			expect(embeddedView.rootNodes.length).toBeGreaterThan(0);
		});
	});

	describe('Multiple Template Instances', () => {
		it('should handle multiple template instances with the same directive', () => {
			const firstDirective = component.footerDirective;
			const secondDirective = component.simpleFooterDirective;
			const thirdDirective = component.statsFooterDirective;

			expect(firstDirective).toBeTruthy();
			expect(secondDirective).toBeTruthy();
			expect(thirdDirective).toBeTruthy();
			
			expect(firstDirective).not.toBe(secondDirective);
			expect(secondDirective).not.toBe(thirdDirective);
			
			expect(firstDirective.templateRef).not.toBe(secondDirective.templateRef);
			expect(secondDirective.templateRef).not.toBe(thirdDirective.templateRef);
		});

		it('should create different embedded views from different template instances', () => {
			const detailedView = component.footerDirective.templateRef.createEmbeddedView({
				column: component.mockColumn
			});

			const simpleView = component.simpleFooterDirective.templateRef.createEmbeddedView({});
			
			const statsView = component.statsFooterDirective.templateRef.createEmbeddedView({
				column: component.mockColumn
			});

			detailedView.detectChanges();
			simpleView.detectChanges();
			statsView.detectChanges();

			const detailedElement = detailedView.rootNodes[0] as HTMLElement;
			const simpleElement = simpleView.rootNodes[0] as HTMLElement;
			const statsElement = statsView.rootNodes[0] as HTMLElement;

			expect(detailedElement.classList.contains('test-footer-template')).toBe(true);
			expect(simpleElement.classList.contains('simple-footer')).toBe(true);
			expect(statsElement.classList.contains('stats-footer')).toBe(true);
		});
	});

	describe('Directive Selector', () => {
		it('should be applied to templates with columnFooterTpt selector', () => {
			const directiveElements = fixture.debugElement.queryAll(By.directive(BoardColumnFooterDirective));
			expect(directiveElements.length).toBeGreaterThan(0);

			const allTemplates = fixture.debugElement.queryAll(By.css('ng-template'));
			expect(allTemplates.length).toBeGreaterThan(0);
		});

		it('should have regular template available', () => {
			expect(component.regularTemplateRef).toBeTruthy();
		});
	});

	describe('Footer Statistics and Calculations', () => {
		it('should correctly calculate completed cards', () => {
			const testColumn = {
				id: 4,
				title: 'Stats Test Column',
				cards: [
					{ id: 1, data: { completed: true } },
					{ id: 2, data: { completed: false } },
					{ id: 3, data: { completed: true } },
					{ id: 4, data: { completed: true } },
					{ id: 5, data: {} }
				]
			};

			const embeddedView = directive.templateRef.createEmbeddedView({
				column: testColumn
			});

			embeddedView.detectChanges();
			const templateElement = embeddedView.rootNodes[0] as HTMLElement;

			expect(templateElement.textContent).toContain('Total: 5');
			expect(templateElement.textContent).toContain('Completed: 3');
		});

		it('should handle cards without data property', () => {
			const testColumn = {
				id: 5,
				title: 'No Data Column',
				cards: [
					{ id: 1, title: 'Card without data' },
					{ id: 2, title: 'Another card' }
				]
			};

			const embeddedView = directive.templateRef.createEmbeddedView({
				column: testColumn
			});

			embeddedView.detectChanges();
			const templateElement = embeddedView.rootNodes[0] as HTMLElement;

			expect(templateElement.textContent).toContain('Total: 2');
			expect(templateElement.textContent).not.toContain('Completed:');
			expect(templateElement.textContent).not.toContain('High Priority:');
		});

		it('should show statistics footer with custom data', () => {
			const embeddedView = component.statsFooterDirective.templateRef.createEmbeddedView({
				column: component.mockColumn
			});

			embeddedView.detectChanges();
			const templateElement = embeddedView.rootNodes[0] as HTMLElement;

			expect(templateElement.textContent).toContain('4'); // Card count
			expect(templateElement.textContent).toContain('Cards');
			expect(templateElement.textContent).toContain('24h'); // Estimated hours
			expect(templateElement.textContent).toContain('Hours');
		});
	});

	describe('Column Data Variations', () => {
		it('should handle column with mixed card data types', () => {
			const mixedColumn = {
				id: 6,
				title: 'Mixed Data Column',
				cards: [
					{ id: 1, data: { completed: true, priority: 'high' } },
					{ id: 2, data: { completed: 'yes', priority: 1 } }, // Different data types
					{ id: 3, data: null },
					{ id: 4 }, // No data property
					{ id: 5, data: { priority: 'high' } } // Missing completed
				]
			};

			const embeddedView = directive.templateRef.createEmbeddedView({
				column: mixedColumn
			});

			expect(() => embeddedView.detectChanges()).not.toThrow();
		});

		it('should handle column with null cards array', () => {
			const nullCardsColumn = {
				id: 7,
				title: 'Null Cards Column',
				cards: null
			};

			const embeddedView = directive.templateRef.createEmbeddedView({
				column: nullCardsColumn
			});

			expect(() => embeddedView.detectChanges()).not.toThrow();
		});

		it('should handle column with undefined cards', () => {
			const undefinedCardsColumn = {
				id: 8,
				title: 'Undefined Cards Column'
				// cards property is missing
			};

			const embeddedView = directive.templateRef.createEmbeddedView({
				column: undefinedCardsColumn
			});

			expect(() => embeddedView.detectChanges()).not.toThrow();
		});
	});

	describe('Template Context Edge Cases', () => {
		it('should handle null column gracefully', () => {
			const embeddedView = directive.templateRef.createEmbeddedView({
				column: null
			});

			expect(() => embeddedView.detectChanges()).not.toThrow();
		});

		it('should handle undefined column properties', () => {
			const columnWithUndefinedProps = {
				id: undefined,
				title: undefined,
				cards: undefined,
				disabled: undefined,
				data: undefined
			};

			const embeddedView = directive.templateRef.createEmbeddedView({
				column: columnWithUndefinedProps
			});

			expect(() => embeddedView.detectChanges()).not.toThrow();
		});

		it('should handle empty column object', () => {
			const embeddedView = directive.templateRef.createEmbeddedView({
				column: {}
			});

			expect(() => embeddedView.detectChanges()).not.toThrow();
		});

		it('should handle string values where objects are expected', () => {
			const stringColumn = {
				id: 9,
				title: 'String Column',
				cards: 'not an array',
				data: 'not an object',
				disabled: 'not a boolean'
			};

			const embeddedView = directive.templateRef.createEmbeddedView({
				column: stringColumn
			});

			expect(() => embeddedView.detectChanges()).not.toThrow();
		});
	});

	describe('Memory Management', () => {
		it('should properly clean up embedded views', () => {
			const embeddedView = directive.templateRef.createEmbeddedView({
				column: component.mockColumn
			});

			expect(embeddedView.destroyed).toBe(false);
			
			embeddedView.destroy();
			
			expect(embeddedView.destroyed).toBe(true);
		});

		it('should handle multiple view creation and destruction', () => {
			const views: any[] = [];
			
			for (let i = 0; i < 15; i++) {
				const view = directive.templateRef.createEmbeddedView({
					column: { 
						...component.mockColumn, 
						id: i, 
						title: `Footer Column ${i}`,
						cards: new Array(i).fill({}).map((_, idx) => ({ 
							id: idx, 
							title: `Card ${idx}`,
							data: { completed: idx % 2 === 0, priority: idx % 3 === 0 ? 'high' : 'low' }
						}))
					}
				});
				views.push(view);
			}

			expect(views.length).toBe(15);
			views.forEach(view => expect(view.destroyed).toBe(false));

			views.forEach(view => view.destroy());
			views.forEach(view => expect(view.destroyed).toBe(true));
		});
	});

	describe('Performance with Large Datasets', () => {
		it('should handle columns with many cards efficiently', () => {
			const largeColumn = {
				id: 10,
				title: 'Large Column',
				cards: new Array(1000).fill({}).map((_, i) => ({
					id: i,
					title: `Card ${i}`,
					data: {
						completed: Math.random() > 0.5,
						priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
					}
				})),
				disabled: false
			};

			const startTime = performance.now();
			
			const embeddedView = directive.templateRef.createEmbeddedView({
				column: largeColumn
			});
			
			embeddedView.detectChanges();
			embeddedView.destroy();
			
			const endTime = performance.now();
			const executionTime = endTime - startTime;

			// Should complete within reasonable time (less than 100ms)
			expect(executionTime).toBeLessThan(100);
		});
	});

	describe('Date and Formatting', () => {
		it('should handle date formatting in footer metadata', () => {
			const columnWithDate = {
				...component.mockColumn,
				data: {
					...component.mockColumn.data,
					lastUpdated: new Date('2024-03-15T14:30:00Z')
				}
			};

			const embeddedView = directive.templateRef.createEmbeddedView({
				column: columnWithDate
			});

			expect(() => embeddedView.detectChanges()).not.toThrow();
		});

		it('should handle invalid date objects', () => {
			const columnWithInvalidDate = {
				...component.mockColumn,
				data: {
					...component.mockColumn.data,
					lastUpdated: new Date('invalid-date')
				}
			};

			const embeddedView = directive.templateRef.createEmbeddedView({
				column: columnWithInvalidDate
			});

			expect(() => embeddedView.detectChanges()).not.toThrow();
		});
	});

	describe('Error Handling', () => {
		it('should handle template creation with invalid context gracefully', () => {
			const invalidContexts = [null, undefined, 'string', 123, [], true, false, Symbol('test')];

			invalidContexts.forEach(context => {
				expect(() => {
					const view = directive.templateRef.createEmbeddedView(context as any);
					view.detectChanges();
					view.destroy();
				}).not.toThrow(`Failed with context: ${String(context)}`);
			});
		});

		it('should handle circular references in column data', () => {
			const circularColumn: any = {
				id: 11,
				title: 'Circular Column',
				cards: []
			};
			circularColumn.data = { owner: 'Test', reference: circularColumn };

			const embeddedView = directive.templateRef.createEmbeddedView({
				column: circularColumn
			});

			expect(() => embeddedView.detectChanges()).not.toThrow();
		});
	});
});
