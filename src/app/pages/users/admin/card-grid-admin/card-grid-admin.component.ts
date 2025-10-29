import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { takeUntil, finalize } from 'rxjs';
import BaseComponent from 'src/app/components/base.component';
import { importBase } from 'src/app/shared/constant/import-base.constant';
import { URI_PATH } from 'src/app/shared/constant/path.contant';
import { labeGridAdminsMap } from 'src/app/shared/helpers/iconMap.helper';
import { Admin } from 'src/app/shared/types';
import { UpsertAdminComponent } from '../upsert-admin/upsert-admin.component';
import { CanPipe } from '../../../../shared/pipe/can.pipe';
import { PERMISSIONS } from '../../../../shared/constant/permissions.constant';
import { departmentStyles } from '../admin.const';
import { FilterGridAdminComponent } from './filter-grid-admin/filter-grid-admin.component';
import { FilterService } from 'src/app/services/filter.service';

@Component({
    selector: 'app-card-grid-admin',
    imports: [...importBase, CanPipe],
    templateUrl: './card-grid-admin.component.html',
    styleUrl: './card-grid-admin.component.scss'
})
export class CardGridAdminComponent extends BaseComponent implements OnInit {
	public admins: Admin[] = [];
	public departments: string[] = [];
	public photosUrl: string[] = [];
	public readonly PERMISSIONS = PERMISSIONS;
	public departmentStyles = departmentStyles;
	private labelMap = labeGridAdminsMap;
	page = 1;
	pageSize = 50;
	hasMore = false;

	constructor(
		private _router: Router,
		private _dialog: MatDialog,
		public filterService: FilterService
	) {
		super();
	}

	ngOnInit(): void {
		this.authService.$unit.pipe(takeUntil(this.unsubscribe$)).subscribe(async unit => {
			this.unit = unit;
			this.page = 1;
			await this.loadEmployees();
		});
	}

	loadEmployees(): void {
		this.loading = true;

		// Obtém os filtros salvos no serviço
		this.searchParams = {
			...this.filterService.get('CardGridAdminComponent').search,
			unit: { id: this.unit.id },
		};

		this.queryString.set('search', JSON.stringify(this.searchParams));
		this.queryString.set('page', this.page.toString());

		this.requestService
			.list<Admin>(`${URI_PATH.CORE.ADMIN}?${this.queryString}`)
			.pipe(finalize(() => (this.loading = false)))
			.subscribe(response => {
				this.hasMore = response.paginate.total > this.admins.length + response.data.length;
				this.admins = [...response.data];
			});
	}

	loadMore(): void {
		if (this.hasMore && !this.loading) {
			this.page++;
			this.loadEmployees();
		}
	}

	openDialogFilter() {
		this._dialog
			.open<FilterGridAdminComponent>(FilterGridAdminComponent, {
				data: { name: 'CardGridAdminComponent' },
			})
			.afterClosed()
			.pipe(takeUntil(this.unsubscribe$))
			.subscribe({
				next: data => {
					if (data) {
						this.searchParams = { ...this.searchParams, ...data }; // Atualiza os filtros aplicados
						this.loadEmployees(); // Recarrega os colaboradores com os novos filtros
					}
				},
			});
	}

	getCorrectLabel(departmentKey: string): string {
		return this.labelMap[departmentKey];
	}

	openDialog(admin?: Admin): void {
		const dialogRef = this._dialog.open(UpsertAdminComponent, { data: admin });
		dialogRef.afterClosed().subscribe(result => {
			if (result) this.loadEmployees();
		});
	}

	onViewEmployee(admin: Admin): void {
		this._router.navigate(['/users/admin/show/', admin.id]);
	}

	onEditEmployee(admin: Admin): void {
		this.openDialog(admin);
	}
}
