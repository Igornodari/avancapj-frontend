import { Component, Inject } from '@angular/core';
import { importBase } from 'src/app/shared/constant/import-base.constant';
import { CategoryToolEnum } from '../../category.type';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import BaseFilterComponent from 'src/app/components/base-filter.component';

@Component({
    selector: 'app-filter-category',
    imports: [...importBase],
    templateUrl: './filter-category.component.html'
})
export class FilterCategoryComponent extends BaseFilterComponent<FilterCategoryComponent> {
	public tools: string[] = Object.keys(CategoryToolEnum);
	constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
		super(data);

		this.formGroup = this._formBuilder.nonNullable.group({
			code: [''],
			name: [''],
			tool: [''],
		});
	}

	getEnumValueFromKey<T>(enumObj: T, key: keyof T | string): T[keyof T] | undefined {
		return enumObj[key as keyof T];
	}

	override setSearch() {
		const fc = this.formGroup.controls;

		const toolValue = this.getEnumValueFromKey(CategoryToolEnum, fc['tool'].value) ?? '';

		this.setQuery('code', 'equal', this.fc['code'].value);
		this.setQuery('name', 'like', this.fc['name'].value);
		this.setQuery('tool', 'in', toolValue);
	}
}
