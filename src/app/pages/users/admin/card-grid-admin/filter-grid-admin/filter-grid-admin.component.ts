import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import BaseComponent from 'src/app/components/base.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FilterService } from 'src/app/services/filter.service';
import { importBase } from 'src/app/shared/constant/import-base.constant';

@Component({
    selector: 'app-filter-grid-admin',
    imports: [...importBase],
    templateUrl: './filter-grid-admin.component.html'
})
export class FilterGridAdminComponent extends BaseComponent {
	public formGroup: FormGroup;
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<FilterGridAdminComponent>,
		private _formBuilder: FormBuilder,
		public filterService: FilterService,
	) {
		super();
		this.formGroup = this._formBuilder.nonNullable.group({
			fullName: [''],
			department:['']
		});

		this.formGroup.patchValue(this.filterService.get(this.data.name).formValue);
	}

	clear() {
		this.formGroup.reset();
		this.searchParams = {};
		this.dialogRef.close(this.filterService.clear(this.data.name).search);
	}

	setSearch(name: string, operator: string, value: any, formName?: string) {
		this.searchParams[name] = this.filterService.getValueSearch(operator, value);
		if (!this.searchParams[name]) {
			name = formName ?? name;
			this.formGroup.controls[name].setValue('');
		}
	}

	onConfirm() {
		const fc = this.formGroup.controls;
		this.setSearch('fullName', 'like', fc['fullName'].value, 'fullName');
		this.setSearch('department', 'like', fc['department'].value, 'department');
		this.filterService.set({
			name: this.data.name,
			search: this.searchParams,
			formValue: this.formGroup.value,
		});
		this.dialogRef.close(this.searchParams);
	}
}
