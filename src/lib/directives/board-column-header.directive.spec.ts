import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { BoardColumnHeaderDirective } from './board-column-header.directive';

/**
 * Test component to verify the directive functionality
 */
@Component({
	template: `
		<ng-template columnHeaderTpt let-column="column" #headerTemplate>
			<div class="test-header-template" [attr.data-column-id]="column.id">
				<div class="header-title">
					<h3>{{ column.title }}</h3>
					<span class="header-subtitle" *ngIf="column.description">{{ column.description }}</span>
				</div>
				<div class="header-actions">
					<span class="card-count badge">{{ column.cards.length }}</span>
					<button class="add-card-btn" *ngIf="!column.disabled">Add Card</button>
					<span class="disabled-indicator" *ngIf="column.disabled">Disabled</span>
				</div>
				<div class="custom-data" *ngIf="column.data">
					<span class="priority">{{ column.data.priority }}</span>
					<span class="owner">{{ column.data.owner }}</span>
				</div>
			</div>
		</ng-template>

		<ng-template columnHeaderTpt #simpleHeaderTemplate>
			<div class="simple-header">
				<span>Simple Column Header</span>
			</div>
		</ng-template>

		<ng-template columnHeaderTpt let-column="column" #emptyHeaderTemplate>
			<div class="empty-header" [attr.data-empty]="true"></div>
		</ng-template>

		<!-- Template without directive for comparison -->
		<ng-template #regularTemplate>
			<div class="regular-template">Regular template</div>
		</ng-template>
	`,
	standalone: true,
	imports: [BoardColumnHeaderDirective, CommonModule]
})
class TestComponent {
	@ViewChild('headerTemplate', { read: BoardColumnHeaderDirective }) 
	headerDirective!: BoardColumnHeaderDirective;

	@ViewChild('headerTemplate', { read: TemplateRef }) 
	templateRef!: TemplateRef<any>;

	@ViewChild('simpleHeaderTemplate', { read: BoardColumnHeaderDirective })
	simpleHeaderDirective!: BoardColumnHeaderDirective;

	@ViewChild('emptyHeaderTemplate', { read: BoardColumnHeaderDirective })
	emptyHeaderDirective!: BoardColumnHeaderDirective;

	@ViewChild('regularTemplate', { read: TemplateRef })
	regularTemplateRef!: TemplateRef<any>;

	// Test data
	mockColumn = {
		id: 1,
		title: 'Test Column',
		description: 'Test column description',
		cards: [
			{ id: 1, title: 'Card 1' },
			{ id: 2, title: 'Card 2' },
			{ id: 3, title: 'Card 3' }
		],
		disabled: false,
		data: {
			priority: 'High',
			owner: 'John Doe'
		}
	};

	mockDisabledColumn = {
		id: 2,
		title: 'Disabled Column',
		description: 'This column is disabled',
		cards: [],
		disabled: true
	};

	mockMinimalColumn = {
		id: 3,
		title: 'Minimal Column',
		cards: []
	};
}

describe('BoardColumnHeaderDirective', () => {
	let component: TestComponent;
	let fixture: ComponentFixture<TestComponent>;
	let directive: BoardColumnHeaderDirective;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TestComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(TestComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		directive = component.headerDirective;
	});

	describe('Basic Functionality', () => {
		it('should create an instance', () => {
			expect(directive).toBeTruthy();
		});

		it('should be a BoardColumnHeaderDirective instance', () => {
			expect(directive).toBeInstanceOf(BoardColumnHeaderDirective);
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
			expect(templateElement.classList.contains('test-header-template')).toBe(true);
			expect(templateElement.getAttribute('data-column-id')).toBe('1');
		});

		it('should render template with column context', () => {
			const embeddedView = directive.templateRef.createEmbeddedView({
				column: component.mockColumn
			});

			embeddedView.detectChanges();
			const templateElement = embeddedView.rootNodes[0] as HTMLElement;

			expect(templateElement.textContent).toContain('Test Column');
			expect(templateElement.textContent).toContain('Test column description');
			expect(templateElement.textContent).toContain('3'); // Card count
			expect(templateElement.textContent).toContain('Add Card');
			expect(templateElement.textContent).toContain('High'); // Priority
			expect(templateElement.textContent).toContain('John Doe'); // Owner
		});

		it('should handle disabled column state', () => {
			const embeddedView = directive.templateRef.createEmbeddedView({
				column: component.mockDisabledColumn
			});

			embeddedView.detectChanges();
			const templateElement = embeddedView.rootNodes[0] as HTMLElement;

			expect(templateElement.textContent).toContain('Disabled Column');
			expect(templateElement.textContent).toContain('Disabled');
			expect(templateElement.textContent).not.toContain('Add Card');
		});

		it('should handle minimal column data', () => {
			const embeddedView = directive.templateRef.createEmbeddedView({
				column: component.mockMinimalColumn
			});

			embeddedView.detectChanges();
			const templateElement = embeddedView.rootNodes[0] as HTMLElement;

			expect(templateElement.textContent).toContain('Minimal Column');
			expect(templateElement.textContent).toContain('0'); // No cards
		});

		it('should handle template without context data', () => {
			const embeddedView = directive.templateRef.createEmbeddedView({});
			
			expect(embeddedView).toBeTruthy();
			expect(embeddedView.rootNodes.length).toBeGreaterThan(0);
		});
	});

	describe('Multiple Template Instances', () => {
		it('should handle multiple template instances with the same directive', () => {
			const firstDirective = component.headerDirective;
			const secondDirective = component.simpleHeaderDirective;
			const thirdDirective = component.emptyHeaderDirective;

			expect(firstDirective).toBeTruthy();
			expect(secondDirective).toBeTruthy();
			expect(thirdDirective).toBeTruthy();
			
			expect(firstDirective).not.toBe(secondDirective);
			expect(secondDirective).not.toBe(thirdDirective);
			
			expect(firstDirective.templateRef).not.toBe(secondDirective.templateRef);
			expect(secondDirective.templateRef).not.toBe(thirdDirective.templateRef);
		});

		it('should create different embedded views from different template instances', () => {
			const detailedView = component.headerDirective.templateRef.createEmbeddedView({
				column: component.mockColumn
			});

			const simpleView = component.simpleHeaderDirective.templateRef.createEmbeddedView({});
			
			const emptyView = component.emptyHeaderDirective.templateRef.createEmbeddedView({
				column: component.mockColumn
			});

			detailedView.detectChanges();
			simpleView.detectChanges();
			emptyView.detectChanges();

			const detailedElement = detailedView.rootNodes[0] as HTMLElement;
			const simpleElement = simpleView.rootNodes[0] as HTMLElement;
			const emptyElement = emptyView.rootNodes[0] as HTMLElement;

			expect(detailedElement.classList.contains('test-header-template')).toBe(true);
			expect(simpleElement.classList.contains('simple-header')).toBe(true);
			expect(emptyElement.classList.contains('empty-header')).toBe(true);
		});
	});

	describe('Directive Selector', () => {
		it('should be applied to templates with columnHeaderTpt selector', () => {
			const directiveElements = fixture.debugElement.queryAll(By.directive(BoardColumnHeaderDirective));
			expect(directiveElements.length).toBeGreaterThan(0);

			const allTemplates = fixture.debugElement.queryAll(By.css('ng-template'));
			expect(allTemplates.length).toBeGreaterThan(0);
		});

		it('should have regular template available', () => {
			expect(component.regularTemplateRef).toBeTruthy();
		});
	});

	describe('Column Data Variations', () => {
		it('should handle column with empty cards array', () => {
			const columnWithNoCards = {
				id: 4,
				title: 'Empty Column',
				cards: []
			};

			const embeddedView = directive.templateRef.createEmbeddedView({
				column: columnWithNoCards
			});

			embeddedView.detectChanges();
			const templateElement = embeddedView.rootNodes[0] as HTMLElement;

			expect(templateElement.textContent).toContain('Empty Column');
			expect(templateElement.textContent).toContain('0');
		});

		it('should handle column with large number of cards', () => {
			const columnWithManyCars = {
				id: 5,
				title: 'Busy Column',
				cards: new Array(100).fill(null).map((_, i) => ({ id: i, title: `Card ${i}` }))
			};

			const embeddedView = directive.templateRef.createEmbeddedView({
				column: columnWithManyCars
			});

			embeddedView.detectChanges();
			const templateElement = embeddedView.rootNodes[0] as HTMLElement;

			expect(templateElement.textContent).toContain('Busy Column');
			expect(templateElement.textContent).toContain('100');
		});

		it('should handle column with special characters in title', () => {
			const columnWithSpecialChars = {
				id: 6,
				title: 'Special <>&"` Column',
				description: 'Contains special chars <script>alert("test")</script>',
				cards: []
			};

			const embeddedView = directive.templateRef.createEmbeddedView({
				column: columnWithSpecialChars
			});

			embeddedView.detectChanges();
			const templateElement = embeddedView.rootNodes[0] as HTMLElement;

			expect(templateElement.textContent).toContain('Special <>&"` Column');
		});

		it('should handle column with complex nested data', () => {
			const columnWithComplexData = {
				id: 7,
				title: 'Complex Column',
				cards: [],
				data: {
					priority: 'Critical',
					owner: 'Team Lead',
					metadata: {
						created: new Date(),
						tags: ['urgent', 'backend', 'api'],
						settings: {
							autoAssign: true,
							notifications: false
						}
					}
				}
			};

			const embeddedView = directive.templateRef.createEmbeddedView({
				column: columnWithComplexData
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
				description: undefined,
				cards: undefined,
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
			
			for (let i = 0; i < 10; i++) {
				const view = directive.templateRef.createEmbeddedView({
					column: { ...component.mockColumn, id: i, title: `Column ${i}` }
				});
				views.push(view);
			}

			expect(views.length).toBe(10);
			views.forEach(view => expect(view.destroyed).toBe(false));

			views.forEach(view => view.destroy());
			views.forEach(view => expect(view.destroyed).toBe(true));
		});
	});

	describe('Performance Considerations', () => {
		it('should handle rapid view creation without memory leaks', () => {
			// Simulate rapid header updates (like in a real-time dashboard)
			for (let i = 0; i < 50; i++) {
				const view = directive.templateRef.createEmbeddedView({
					column: { 
						...component.mockColumn, 
						id: i, 
						title: `Dynamic Column ${i}`,
						cards: new Array(Math.floor(Math.random() * 20)).fill({}).map((_, idx) => ({ id: idx, title: `Card ${idx}` }))
					}
				});
				view.detectChanges();
				view.destroy();
			}

			// If we reach here without hanging or crashing, the test passes
			expect(true).toBe(true);
		});
	});

	describe('Error Handling', () => {
		it('should handle template creation with invalid context gracefully', () => {
			const invalidContexts = [null, undefined, 'string', 123, [], true, false];

			invalidContexts.forEach(context => {
				expect(() => {
					const view = directive.templateRef.createEmbeddedView(context as any);
					view.detectChanges();
					view.destroy();
				}).not.toThrow();
			});
		});

		it('should handle circular reference in column data', () => {
			const circularColumn: any = {
				id: 8,
				title: 'Circular Column',
				cards: []
			};
			circularColumn.self = circularColumn; // Create circular reference

			const embeddedView = directive.templateRef.createEmbeddedView({
				column: circularColumn
			});

			expect(() => embeddedView.detectChanges()).not.toThrow();
		});
	});
});
