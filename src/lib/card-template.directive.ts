import { Directive, ElementRef, TemplateRef } from '@angular/core';

@Directive({
	selector: '[cardTpt]'
})
export class CardTemplateDirective {
	constructor(public templateRef: TemplateRef<unknown>) {}
}
