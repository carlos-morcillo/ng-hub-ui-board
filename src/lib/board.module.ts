import { NgModule } from '@angular/core';
import { HubBoardComponent } from './components/board/board.component';
import { BoardColumnFooterDirective } from './directives/board-column-footer.directive';
import { BoardColumnHeaderDirective } from './directives/board-column-header.directive';
import { CardPlaceholderDirective } from './directives/card-placeholder.directive';
import { CardTemplateDirective } from './directives/card-template.directive';
import { ColumnPlaceholderDirective } from './directives/column-placeholder.directive';

/**
 * Angular module that provides board functionality with drag-and-drop support.
 * 
 * This module includes all the necessary components and directives for creating
 * Kanban-style boards with customizable columns, cards, and templates.
 * 
 * @deprecated Use standalone components instead. Import individual components and directives directly.
 * @publicApi
 * 
 * @example
 * ```typescript
 * // Legacy module approach (not recommended)
 * import { BoardModule } from 'ng-hub-ui-board';
 * 
 * @NgModule({
 *   imports: [BoardModule]
 * })
 * export class AppModule {}
 * 
 * // Recommended standalone approach
 * import { HubBoardComponent, CardTemplateDirective } from 'ng-hub-ui-board';
 * 
 * @Component({
 *   standalone: true,
 *   imports: [HubBoardComponent, CardTemplateDirective]
 * })
 * export class MyComponent {}
 * ```
 */
@NgModule({
	declarations: [],
	imports: [
		HubBoardComponent,
		CardTemplateDirective,
		BoardColumnHeaderDirective,
		BoardColumnFooterDirective,
		CardPlaceholderDirective,
		ColumnPlaceholderDirective
	],
	exports: [
		HubBoardComponent,
		CardTemplateDirective,
		BoardColumnHeaderDirective,
		BoardColumnFooterDirective,
		CardPlaceholderDirective,
		ColumnPlaceholderDirective
	]
})
export class BoardModule {}
