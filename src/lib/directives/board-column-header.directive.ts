import { Directive, TemplateRef } from '@angular/core';

@Directive({
	selector: '[columnHeaderTpt]',
	standalone: true
})
export class BoardColumnHeaderDirective {
	constructor(public templateRef: TemplateRef<unknown>) {}
}
