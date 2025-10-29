import { AfterViewInit, ChangeDetectorRef, Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MARITAL_STATUSES } from 'src/app/shared/constant/users.contant';
import { URI_PATH } from 'src/app/shared/constant/path.contant';
import BaseComponent from 'src/app/components/base.component';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { Unit } from 'src/app/shared/types';
import { importBase } from 'src/app/shared/constant/import-base.constant';
import { TimePickerComponent } from '../../../components/time-picker.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { TranslateService } from '@ngx-translate/core';
import { titleCase } from 'src/app/shared/helpers';
import { AddressData } from 'src/app/shared/types/address-data';
import { CepValidatorDirective } from 'src/app/shared/directive/cep.directive';

@Component({
    selector: 'upsert-unit',
    templateUrl: './upsert-unit.component.html',
    imports: [...importBase, NgxMaskDirective, TimePickerComponent, CepValidatorDirective],
    providers: [provideNgxMask()]
})
export class UpsertUnitComponent extends BaseComponent implements AfterViewInit {
	public action: string = 'Editar usuario';
	public formGroup: FormGroup;
	public MARITAL_STATUSES = MARITAL_STATUSES;
	constructor(
		private _formBuilder: FormBuilder,
		public dialogRef: MatDialogRef<UpsertUnitComponent>,
		private cdr: ChangeDetectorRef,
		private _snackBar: SnackBarService,
		private translate: TranslateService,
		@Optional() @Inject(MAT_DIALOG_DATA) public data: Unit
	) {
		super();

		this.formGroup = this._formBuilder.nonNullable.group({
			name: ['', Validators.required],
			waPhoneNumber: [''],
			opening: ['', Validators.required],
			closure: ['', Validators.required],
			regulationUrl: [''],
			addressStreet: ['', Validators.required],
			isActive: [true],
			addressCity: [''],
			addressNeighborhood: [''],
			addressZipCode: [''],
			addressState: [''],
			addressNumber: [''],
			latitude: [],
			longitude: [],
		});
		const label = this.data ? 'HOME.UNITS.UPSERT.EDIT_TITLE' : 'HOME.UNITS.UPSERT.CREATE_TITLE';
		this.action = this.translate.instant(label);
	}

	ngAfterViewInit() {
		if (this.data) {
			this.formGroup.get('name')?.disable();
			this.formGroup.patchValue({
				...this.data,
			});
			this.cdr.detectChanges();
		}
	}

	fillFormWithAddressData(addressData: AddressData) {
		this.formGroup.patchValue({
			addressStreet: titleCase(addressData.street),
			addressNeighborhood: titleCase(addressData.neighborhood),
			addressCity: titleCase(addressData.city),
			addressState: addressData.state.toUpperCase(),
			addressNumber: String(),
		});
	}

	handleCepInvalid() {
		this.formGroup.patchValue({
			fantasyName: String(),
			corporateName: String(),
			addressStreet: String(),
		});
	}

	close(): void {
		this.dialogRef.close(false);
	}

	onConfirm() {
		this.loading = true;
		let request = this.requestService.post<Unit>(URI_PATH.CORE.UNITS.MAIN, this.formGroup.value);

		if (this.data) {
			request = this.requestService.update<Unit>(
				URI_PATH.CORE.UNITS.MAIN,
				this.data.id,
				this.formGroup.value
			);
		} else {
			request = this.requestService.post<Unit>(URI_PATH.CORE.UNITS.MAIN, this.formGroup.value);
		}
		request
			.subscribe({
				next: () => {
					this._snackBar.success('Dados salvos !');
					this.loading = false;
					this.dialogRef.close(this.formGroup.value);
				},
			})
			.add(() => (this.loading = false));
	}
}
