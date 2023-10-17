import { Directive, TemplateRef } from '@angular/core';

@Directive({
	selector: '[columnHeaderTpt]'
})
export class BoardColumnHeaderDirective {
	constructor(public templateRef: TemplateRef<unknown>) {}
}
