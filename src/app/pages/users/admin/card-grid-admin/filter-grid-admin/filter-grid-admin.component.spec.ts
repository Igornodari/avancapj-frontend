import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import {
	MAT_DIALOG_DATA,
	MatDialog,
	MatDialogModule,
	MatDialogRef,
} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { RequestService } from 'src/app/services/request.service';
import {
	mockAdmin,
	mockUnit,
	mockUser,
} from 'src/app/shared/mocks/users/admin/card-grid-admin-mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { FormBuilder } from '@angular/forms';
import { FilterService } from 'src/app/services/filter.service';
import { FilterGridAdminComponent } from './filter-grid-admin.component';

describe('FilterGridAdminComponent', () => {
	let component: FilterGridAdminComponent;
	let fixture: ComponentFixture<FilterGridAdminComponent>;
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
				FilterGridAdminComponent,
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
				{ provide: MAT_DIALOG_DATA, useValue: { name: 'FilterGridAdminComponent' } },
				{ provide: MatDialogRef, useValue: mockDialogRef },
				{ provide: FilterService, useValue: mockFilterService },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(FilterGridAdminComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should initialize the form with values from the filterService', () => {
    expect(mockFilterService.get).toHaveBeenCalledWith('FilterGridAdminComponent');
    expect(component.formGroup).toBeTruthy();
  });

  it('should clear the form and close the dialog on clear()', () => {
    component.clear();
    expect(component.formGroup.value).toEqual({
      fullName: '',
      department: '',
    });
    expect(mockFilterService.clear).toHaveBeenCalledWith('FilterGridAdminComponent');
    expect(mockDialogRef.close).toHaveBeenCalledWith({});
  });

  it('should set search parameters correctly in setSearch()', () => {
    component.formGroup.controls['fullName'].setValue('John Doe');
    component.setSearch('fullName', 'like', 'John Doe');

    expect(mockFilterService.getValueSearch).toHaveBeenCalledWith('like', 'John Doe');
    expect(component.searchParams['fullName']).toBe(true);
  });

  it('should reset form control value in setSearch() when search value is falsy', () => {
    mockFilterService.getValueSearch.and.returnValue(false);

    component.formGroup.controls['department'].setValue('facilities');
    component.setSearch('department', 'like', 'facilities');

    expect(mockFilterService.getValueSearch).toHaveBeenCalledWith('like', 'facilities');
    expect(component.formGroup.controls['department'].value).toBe('');
  });

  it('should set search parameters and close dialog on onConfirm()', () => {
    component.formGroup.controls['fullName'].setValue('John Doe');
    component.formGroup.controls['department'].setValue('facilities');

    component.onConfirm();

    expect(mockFilterService.set).toHaveBeenCalledWith({
      name: 'FilterGridAdminComponent',
      search: component.searchParams,
      formValue: component.formGroup.value,
    });

    expect(mockDialogRef.close).toHaveBeenCalledWith(component.searchParams);
  });
});
