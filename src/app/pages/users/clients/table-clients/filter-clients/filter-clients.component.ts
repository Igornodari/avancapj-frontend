import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import BaseComponent from 'src/app/components/base.component';
import { FilterService } from 'src/app/services/filter.service';
import { importBase } from 'src/app/shared/constant/import-base.constant';

@Component({
    selector: 'app-filter-table-clients',
    imports: [...importBase],
    templateUrl: './filter-clients.component.html'
})
export class FilterClientsComponent extends BaseComponent {
	public formGroup: FormGroup;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<FilterClientsComponent>,
		private _formBuilder: FormBuilder,
		public filterService: FilterService
	) {
		super();
		this.formGroup = this._formBuilder.nonNullable.group({
			email: [''],
			fullName:[''],
			cpf:[''],
			nationality:['']
		});

		this.formGroup.patchValue(this.filterService.get(this.data.name).formValue);
	}

	clear() {
		this.formGroup.reset();
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
    const filters = {
        email: this.filterService.getValueSearch('like', fc['email'].value),
        fullName: this.filterService.getValueSearch('like', fc['fullName'].value),
        cpf: this.filterService.getValueSearch('like', fc['cpf'].value),
        nationality: this.filterService.getValueSearch('like', fc['nationality'].value),
    };


    this.filterService.set({
        name: this.data.name,
        search: filters,
        formValue: this.formGroup.value,
    });

    this.dialogRef.close(filters); // Passar os filtros corretos ao fechar o diálogo
}

}
