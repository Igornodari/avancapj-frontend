import { Component, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import BaseTableComponent from 'src/app/components/base-table.component';
import { importBase } from 'src/app/shared/constant/import-base.constant';
import { URI_PATH } from 'src/app/shared/constant/path.contant';
import { Category } from 'src/app/shared/types';
import { UpsertCategoryComponent } from '../upsert-category/upsert-category.component';
import { FilterCategoryComponent } from './filter-category/filter-category.component';

@Component({
    selector: 'app-table-category',
    imports: importBase,
    templateUrl: './table-category.component.html'
})
export class TableCategoryComponent extends BaseTableComponent<Category> {
	private readonly _router = inject(Router);
	private readonly _snackBar = inject(MatSnackBar);

	constructor() {
		super({ filterName: 'TableCategoryComponent' });
		this.initializeTable();
	}

	private initializeTable(): void {
		this.filterComponent = FilterCategoryComponent;
		this.displayedColumns = ['code', 'name', 'tool', 'visibilityIcon'];

		if (this.isGroup) {
			this.urlPath = URI_PATH.CORE.CATEGORY.GROUP;
		} else {
			this.settings.relations = { group: true };
			this.urlPath = URI_PATH.CORE.CATEGORY.MAIN;
		}
	}

	get isGroup(): boolean {
		return this._router.url === '/system/categories/group';
	}

	openDialog(category?: Category): void {
		const dialogRef = this._dialog.open<UpsertCategoryComponent>(UpsertCategoryComponent, {
			data: {
				...(category || {}),
				isGroup: this.isGroup,
			},
			width: '600px',
		});

		dialogRef.afterClosed().subscribe({
			next: data => this.handleDialogResult(data, category?.id),
			error: err => this.showError('Erro ao processar a operação'),
		});
	}

	private handleDialogResult(data: any, categoryId?: string): void {
		if (!data) return;

		this.loading = true;
		const endpoint = this.isGroup ? URI_PATH.CORE.CATEGORY.GROUP : URI_PATH.CORE.CATEGORY.MAIN;

		const payload = {
			...data,
			unitId: this.unit?.id,
		};

		const operation = categoryId
			? this.requestService.update(endpoint, categoryId, payload)
			: this.requestService.post(endpoint, payload);

		operation
			.subscribe({
				next: () =>
					this.showSuccess(
						categoryId
							? 'SYSTEM.CATEGORIES.ITEMS.SNACK_BAR.UPDATE_SUCCESS'
							: 'SYSTEM.CATEGORIES.ITEMS.SNACK_BAR.CREATE_SUCCESS'
					),
				error: () =>
					this.showError(
						categoryId
							? 'SYSTEM.CATEGORIES.ITEMS.SNACK_BAR.UPDATE_ERROR'
							: 'SYSTEM.CATEGORIES.ITEMS.SNACK_BAR.CREATE_ERROR'
					),
			})
			.add(() => {
				this.loading = false;
				this.getDataSource();
			});
	}


	private showSuccess(message: string): void {
		this._snackBar.open(this.translate.instant(message), 'Fechar', {
			duration: 3000,
			panelClass: ['success-snackbar'],
		});
	}

	private showError(message: string): void {
		this._snackBar.open(this.translate.instant(message), 'Fechar', {
			duration: 5000,
			panelClass: ['error-snackbar'],
		});
	}
}
