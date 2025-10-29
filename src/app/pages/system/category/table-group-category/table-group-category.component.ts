import { Component } from '@angular/core';
import BaseTableComponent from 'src/app/components/base-table.component';
import { importBase } from 'src/app/shared/constant/import-base.constant';
import { URI_PATH } from 'src/app/shared/constant/path.contant';
import { Category } from 'src/app/shared/types';
import { UpsertCategoryComponent } from '../upsert-category/upsert-category.component';
import { FilterGroupCategoryComponent } from './filter-group-category/filter-group-category.component';

@Component({
	selector: 'app-table-group-category',
	standalone: true,
	imports: importBase,
	templateUrl: './table-group-category.component.html',
})
export class TableGroupCategoryComponent extends BaseTableComponent<Category> {
	constructor() {
		super('TableGroupCategoryComponent');
		this.filterComponent = FilterGroupCategoryComponent;

		this.urlPath = URI_PATH.CORE.CATEGORY.MAIN;
		(this.relations = { group: true }),
			(this.displayedColumns = ['code', 'name', 'tool', 'visibilityIcon']);
	}

	opneDialogUpsert(category: Category) {
		this._dialog
			.open<UpsertCategoryComponent>(UpsertCategoryComponent, {
				data: category,
			})
			.afterClosed()
			.subscribe({
				next: (data) => {
					if (data) {
						this.loading = true;
						this.requestService
							.update(`${URI_PATH.CORE.CATEGORY.MAIN}`, category.id, data)
							.subscribe({
								next: (res) => {},
							})
							.add(() => {
								this.loading = false;
								this.getDataSource();
							});
					}
				},
			});
	}
}
