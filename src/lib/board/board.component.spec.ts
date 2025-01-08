import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HubBoardComponent } from './board.component';

describe('BoardComponent', () => {
	let component: HubBoardComponent;
	let fixture: ComponentFixture<HubBoardComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [HubBoardComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(HubBoardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
