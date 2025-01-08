import { Directive, ElementRef, TemplateRef } from '@angular/core';

@Directive({
	selector: '[cardTpt]',
	standalone: true
})
export class CardTemplateDirective {
	constructor(public templateRef: TemplateRef<unknown>) {}
}
