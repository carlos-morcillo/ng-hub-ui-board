import { NgModule } from '@angular/core';
import { BoardColumnFooterDirective } from './board-column-footer.directive';
import { BoardColumnHeaderDirective } from './board-column-header.directive';
import { HubBoardComponent } from './board/board.component';
import { CardTemplateDirective } from './card-template.directive';

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
