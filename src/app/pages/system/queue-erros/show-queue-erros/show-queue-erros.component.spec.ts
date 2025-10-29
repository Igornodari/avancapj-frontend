import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowQueueErrosComponent } from './show-queue-erros.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/services/snack-bar.service';

describe('ShowQueueErrosComponent', () => {
	let component: ShowQueueErrosComponent;
	let fixture: ComponentFixture<ShowQueueErrosComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ShowQueueErrosComponent],
			providers: [
				{ provide: MAT_DIALOG_DATA, useValue: { body: { test: 'value' } } },
				{ provide: SnackBarService, useValue: { success: jasmine.createSpy('success') } }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(ShowQueueErrosComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
