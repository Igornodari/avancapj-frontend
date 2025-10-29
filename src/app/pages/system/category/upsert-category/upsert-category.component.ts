import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, map } from 'rxjs';
import BaseComponent from 'src/app/components/base.component';
import { Category, CategoryToolEnum } from '../category.type';
import { importBase } from 'src/app/shared/constant/import-base.constant';
import { URI_PATH } from 'src/app/shared/constant/path.contant';

@Component({
    selector: 'app-upsert-category',
    imports: [...importBase],
    templateUrl: './upsert-category.component.html'
})
export class UpsertCategoryComponent extends BaseComponent {
	public formGroup: FormGroup;
	public $categories: Observable<Category[]>;
	public tools: string[] = Object.values(CategoryToolEnum);

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<UpsertCategoryComponent>,
		private _formBuilder: FormBuilder,
	) {
		super();
		this.formGroup = this._formBuilder.nonNullable.group({
			code: ['', Validators.required],
			name: ['', Validators.required],
			tool: ['', Validators.required],
			groupId: ['', Validators.required],
		});

		if (this.data) {

			this.formGroup.patchValue(this.data);

			this.formGroup.controls['groupId'].setValue(this.data.group?.id);
			if (this.data.tool) {
				if (this.data.tool == CategoryToolEnum.PURCHASE_ORDER) {
					this.formGroup.disable();
				}

				if (!this.data.isGroup) {
					this.getGroup(this.data.tool);
				}
			}

			this.formGroup.controls['code'].disable();
		}
	}

	getGroup(value?: string) {
		this.$categories = this.requestService
			.list<Category>(URI_PATH.CORE.CATEGORY.GROUP, {
				search: { tool: value || '' },
			})
			.pipe(
				map((category) => {
					return category.data;
				}),
			);
	}

	onConfirm() {
		this.dialogRef.close(this.formGroup.value);
		return;
	}
}
