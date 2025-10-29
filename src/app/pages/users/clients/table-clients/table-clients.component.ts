import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs';
import BaseTableComponent from 'src/app/components/base-table.component';
import { URI_PATH } from 'src/app/shared/constant/path.contant';
import { Client } from '../clients.type';
import { FilterClientsComponent } from './filter-clients/filter-clients.component';
import { getLeadScoreIcon } from 'src/app/shared/helpers/leadscore.helper';

@Component({
    selector: 'app-table-clients',
    templateUrl: './table-clients.component.html',
    standalone: false
})
export class TableClientsComponent extends BaseTableComponent<Client> {
	public formGroup: FormGroup;
	constructor() {
		super({ filterName: 'TableClientsComponent' });
		this.displayedColumns = [
			'name',
			'email',
			'cpf',
			'fone',
			'owner',
			'scoreIcon',
			'visibilityIcon',
		];
	}

	override setDataSource() {
		return this.requestService.list<Client>(`${URI_PATH.CORE.CLIENTS}`);
	}
	override openDialogFilter() {
		this._dialog
			.open<FilterClientsComponent>(FilterClientsComponent, {
				data: { name: 'TableClientsComponent' },
			})
			.afterClosed()
			.pipe(takeUntil(this.unsubscribe$))
			.subscribe({
				next: data => {
					if (data) {
						this.searchParams = { ...data };
						this.applyQueryString();
						this.getDataSource();
					}
				},
			});
	}

	getScoreIcon(score: number): string {
		return getLeadScoreIcon(score);
	}
}
