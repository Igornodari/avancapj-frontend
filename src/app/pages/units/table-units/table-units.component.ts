import { Component } from '@angular/core';
import { URI_PATH } from '../../../shared/constant/path.contant';
import { Unit } from '../../../shared/types';
import { map, takeUntil } from 'rxjs';
import { importBase } from '../../../shared/constant/import-base.constant';
import BaseTableComponent from '../../../components/base-table.component';
import { statusStyles } from '../units.const';
import { styleFromData } from '../../../shared/helpers';
import { UpsertUnitComponent } from '../upsert-unit/upsert-unit.component';

@Component({
    selector: 'app-table-units',
    imports: [...importBase],
    templateUrl: './table-units.component.html'
})
export class TableUnitsComponent extends BaseTableComponent<Unit> {
	constructor() {
		super({ filterName: 'TableUnitsComponent' });

		this.displayedColumns = [
			'createdAt',
			'hotelCode',
			'name',
			'opening',
			'closure',
			'status',
			'visibilityIcon',
		];
	}
	override beforeApplyQueryRequest(): void {}

	override setDataSource() {
		return this.requestService.list<Unit>(`${URI_PATH.CORE.UNITS.LIST}?${this.queryString}`).pipe(
			takeUntil(this.unsubscribe$),
			map(data => {
				data.data.map(item => {
					item.statusStyle = styleFromData(statusStyles, item.isActive ? 'Ativa' : 'Inativo');
				});
				return data;
			})
		);
	}

	openDialogUpsert(): void {
		const dialogRef = this._dialog.open(UpsertUnitComponent);
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.getDataSource();
			}
		});
	}
}
