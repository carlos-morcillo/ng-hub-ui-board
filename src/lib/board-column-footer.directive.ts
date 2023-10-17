import { Directive, TemplateRef } from '@angular/core';

@Directive({
	selector: '[columnFooterTpt]'
})
export class BoardColumnFooterDirective {
	constructor(public templateRef: TemplateRef<unknown>) {}
}
