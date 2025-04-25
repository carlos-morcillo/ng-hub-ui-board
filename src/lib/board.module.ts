import { NgModule } from '@angular/core';
import { HubBoardComponent } from './components/board/board.component';
import { BoardColumnFooterDirective } from './directives/board-column-footer.directive';
import { BoardColumnHeaderDirective } from './directives/board-column-header.directive';
import { CardTemplateDirective } from './directives/card-template.directive';

@NgModule({
	declarations: [],
	imports: [
		HubBoardComponent,
		CardTemplateDirective,
		BoardColumnHeaderDirective,
		BoardColumnFooterDirective
	],
	exports: [
		HubBoardComponent,
		CardTemplateDirective,
		BoardColumnHeaderDirective,
		BoardColumnFooterDirective
	]
})
export class BoardModule {}
