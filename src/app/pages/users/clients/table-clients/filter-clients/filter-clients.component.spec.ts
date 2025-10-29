import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterClientsComponent } from './filter-clients.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { mockAdmin, mockUnit, mockUser } from 'src/app/shared/mocks/users/admin/card-grid-admin-mock';
import { FormBuilder } from '@angular/forms';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FilterService } from 'src/app/services/filter.service';
import { RequestService } from 'src/app/services/request.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

describe('FilterClientsComponent', () => {
	let component: FilterClientsComponent;
	let fixture: ComponentFixture<FilterClientsComponent>;

	let mockRequestService: any;
	let mockRouter: any;

	let mockDialogRef: any;
	let mockFilterService: any;
	beforeEach(async () => {


		class FakeLoader implements TranslateLoader {
			getTranslation(lang: string) {
				return of({});
			}
		}

		const mockAuthService = {
			$unit: of(mockUnit),
			$user: of(mockUser),
			currentUser: {
				...mockUser,
				role: {
					name: 'admin',
					permissions: [{ name: 'admin-access' }],
				},
			},
		};

		const mockSnackBarService = {
			open: jasmine.createSpy('open'),
		};

		mockDialogRef = {
			close: jasmine.createSpy('close'),
		};

		mockFilterService = {
			get: jasmine.createSpy('get').and.returnValue({ formValue: {} }),
			clear: jasmine.createSpy('clear').and.returnValue({ search: {} }),
			set: jasmine.createSpy('set'),
			getValueSearch: jasmine.createSpy('getValueSearch').and.returnValue(true),
		};

		mockRequestService = jasmine.createSpyObj(['list']);
		mockRequestService.list.and.returnValue(of({ data: [mockAdmin] }));
		mockRouter = jasmine.createSpyObj('Router', ['navigate']);

		await TestBed.configureTestingModule({
			imports: [
				FilterClientsComponent,
				BrowserAnimationsModule,
				MatDialogModule,
				TranslateModule.forRoot({
					loader: { provide: TranslateLoader, useClass: FakeLoader },
				}),
			],
			providers: [
				FormBuilder,
				{ provide: RequestService, useValue: mockRequestService },
				{ provide: MatDialog, useValue: {} },
				{ provide: AuthService, useValue: mockAuthService },
				{ provide: Router, useValue: mockRouter },
				{ provide: SnackBarService, useValue: mockSnackBarService },
				{ provide: ActivatedRoute, useValue: { snapshot: { params: { id: '1' } } } },
				{ provide: MAT_DIALOG_DATA, useValue: { name: 'FilterClientsComponent' } },
				{ provide: MatDialogRef, useValue: mockDialogRef },
				{ provide: FilterService, useValue: mockFilterService },
			],
		}).compileComponents();


		fixture = TestBed.createComponent(FilterClientsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should set search parameter correctly in setSearch()', () => {
		component.setSearch('email', 'like', 'test@example.com');
		expect(mockFilterService.getValueSearch).toHaveBeenCalledWith('like', 'test@example.com');
	});

	it('should initialize form with correct fields', () => {
		expect(component.formGroup).toBeDefined();
		expect(component.formGroup.controls['email']).toBeDefined();
		expect(component.formGroup.controls['fullName']).toBeDefined();
		expect(component.formGroup.controls['cpf']).toBeDefined();
		expect(component.formGroup.controls['nationality']).toBeDefined();
	});

	it('should reset form and close dialog on clear()', () => {
		component.clear();
		expect(component.formGroup.value).toEqual({ email: '', fullName: '', cpf: '', nationality: '' });
		expect(mockDialogRef.close).toHaveBeenCalledWith({});
	});

	it('should call filterService.set and close dialog with correct filters on onConfirm()', () => {
		spyOn(component, 'onConfirm').and.callThrough();

		component.formGroup.patchValue({
			email: 'test@example.com',
			fullName: 'John Doe',
			cpf: '12345678900',
			nationality: 'Brazilian',
		});

		component.onConfirm();

		expect(mockFilterService.set).toHaveBeenCalledWith({
			name: 'FilterClientsComponent',
			search: {
				email: true,
				fullName: true,
				cpf: true,
				nationality: true,
			},
			formValue: {
				email: 'test@example.com',
				fullName: 'John Doe',
				cpf: '12345678900',
				nationality: 'Brazilian',
			},
		});

		expect(mockDialogRef.close).toHaveBeenCalledWith({
			email: true,
			fullName: true,
			cpf: true,
			nationality: true,
		});
	});

	it('should clear form field when setSearch is called with an invalid value', () => {
		spyOn(component, 'setSearch').and.callThrough();

		component.setSearch('email', 'like', null);

		expect(component.formGroup.controls['email'].value).toBe('');
	});

	it('should initialize form with data from filterService', () => {
		mockFilterService.get.and.returnValue({
			formValue: {
				email: 'john@example.com',
				fullName: 'John Doe',
				cpf: '12345678900',
				nationality: 'Brazilian',
			},
		});

		fixture = TestBed.createComponent(FilterClientsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		expect(component.formGroup.value.email).toBe('john@example.com');
		expect(component.formGroup.value.fullName).toBe('John Doe');
		expect(component.formGroup.value.cpf).toBe('12345678900');
		expect(component.formGroup.value.nationality).toBe('Brazilian');
	});


	it('should call filterService.clear on clear()', () => {
		spyOn(component, 'clear').and.callThrough();

		component.clear();

		expect(mockFilterService.clear).toHaveBeenCalledWith('FilterClientsComponent');
		expect(mockDialogRef.close).toHaveBeenCalledWith({});
	});

	it('should clear form field when filterService.getValueSearch returns an invalid value', () => {
		mockFilterService.getValueSearch.and.returnValue(null);

		component.formGroup.controls['email'].setValue('valid@example.com'); // Simula um valor já existente
		component.setSearch('email', 'like', null);

		expect(component.searchParams['email']).toBe(null);
		expect(component.formGroup.controls['email'].value).toBe('');
	});


});
