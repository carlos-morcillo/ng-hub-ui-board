import { Directive, TemplateRef } from '@angular/core';

@Directive({
	selector: '[columnFooterTpt]',
	standalone: true
})
export class BoardColumnFooterDirective {
	constructor(public templateRef: TemplateRef<unknown>) {}
}
