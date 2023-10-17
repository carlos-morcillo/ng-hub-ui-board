import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InvertColorPipe } from '../pipes/invert-color.pipe';
import { BoardComponent } from './board/board.component';
import { CardTemplateDirective } from './card-template.directive';
import { BoardColumnHeaderDirective } from './board-column-header.directive';
import { BoardColumnFooterDirective } from './board-column-footer.directive';

@NgModule({
	declarations: [
		BoardComponent,
		CardTemplateDirective,
		BoardColumnHeaderDirective,
		BoardColumnFooterDirective
	],
	imports: [CommonModule, DragDropModule, InvertColorPipe],
	exports: [
		BoardComponent,
		CardTemplateDirective,
		BoardColumnHeaderDirective,
		BoardColumnFooterDirective
	]
})
export class BoardModule {}
