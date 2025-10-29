import { Component } from '@angular/core';
import { Unit } from '../../../shared/types';
import { CanPipe } from '../../../shared/pipe/can.pipe';
import { ActivatedRoute } from '@angular/router';
import { URI_PATH } from '../../../shared/constant/path.contant';
import { importBase } from '../../../shared/constant/import-base.constant';
import { finalize, map, takeUntil } from 'rxjs';
import { styleFromData } from '../../../shared/helpers';
import { statusStyles } from '../units.const';
import { UpsertUnitComponent } from '../upsert-unit/upsert-unit.component';
import BaseComponent from 'src/app/components/base.component';
import { MatDialog } from '@angular/material/dialog';
import { LOCAL_STORAGE } from 'src/app/shared/constant/local-storage.constant';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@Component({
    selector: 'app-detail-unit',
    providers: [provideNgxMask()],
    templateUrl: './detail-unit.component.html',
    styles: `.regulation-link {
		text-decoration: underline;
		cursor: pointer;
		font-weight: bold;
	}
	`,
    imports: [...importBase, NgxMaskPipe]
})
export class DetailUnitComponent extends BaseComponent {
	public id: string;

	constructor(
		private _route: ActivatedRoute,
		protected _dialog: MatDialog,
		private _localStorageService: LocalStorageService
	) {
		super();
		this.loading = true;
		this.get();
	}

	get() {
		this._route.params.pipe(map(p => p['id'])).subscribe({
			next: id => {
				this.id = id;
				if (id) {
					this.requestService
						.show<Unit>(`${URI_PATH.CORE.UNITS.LIST}`, id)
						.pipe(
							map(unit => {
								unit.statusStyle = styleFromData(statusStyles, unit.isActive ? 'Ativa' : 'Inativo');
								return unit;
							}),
							finalize(() => (this.loading = false))
						)
						.subscribe({
							next: unit => (this.unit = unit),
						});
				} else {
					this.authService.$unit
						.pipe(
							takeUntil(this.unsubscribe$),
							map(unit => {
								unit.statusStyle = styleFromData(statusStyles, unit.isActive ? 'Ativa' : 'Inativo');
								return unit;
							})
						)
						.subscribe({
							next: unit => (this.unit = unit),
						});
					this.loading = false;
				}
			},
		});
	}
	openDialogUpsert(): void {
		const dialogRef = this._dialog.open(UpsertUnitComponent, {
			data: this.unit,
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.unit = { ...this.unit, ...result };
				if (!this.id) {
					this._localStorageService.setItem(LOCAL_STORAGE.UNIT, JSON.stringify(this.unit));
				}
				this.get();
			}
		});
	}
}
