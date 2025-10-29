import { Component, Inject } from '@angular/core';
import { importBase } from 'src/app/shared/constant/import-base.constant';
import { CategoryToolEnum } from '../../category.type';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import BaseFilterComponent from 'src/app/components/base-filter.component';

@Component({
	selector: 'app-filter-category',
	standalone: true,
	imports: [...importBase],
	templateUrl: './filter-group-category.component.html',
})
export class FilterGroupCategoryComponent extends BaseFilterComponent<FilterGroupCategoryComponent> {
	public tools: string[] = Object.values(CategoryToolEnum);
	constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
		super(data);

		this.formGroup = this._formBuilder.nonNullable.group({
			code: [''],
			name: [''],
			tool: [''],
		});
	}

	override setSearch() {
		this.setQuery('code', 'equal', this.fc['code'].value);
		this.setQuery('name', 'like', this.fc['name'].value);
		this.setQuery('tool', 'in', this.fc['tool'].value);
	}
}
