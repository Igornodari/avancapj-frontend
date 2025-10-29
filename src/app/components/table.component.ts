import { Component, Input, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { importBase } from '../shared/constant/import-base.constant';
import { NestedValuePipe } from '../shared/pipe/nested-value.pipe';
import { ColumnDisplay } from './base-table.component';

@Component({
	selector: 'app-columns-table',
	standalone: true,
	imports: [...importBase, NestedValuePipe],
	template: `
		@for (column of columnsToDisplay; track $index) {
		<ng-container [matColumnDef]="column.key">
			<th
				mat-header-cell
				*matHeaderCellDef
				[disabled]="column.options?.type == 'icon-button'"
				[mat-sort-header]="column.options?.sort ?? column.key"
			>
				{{ column.label | translate }}
			</th>
			<td mat-cell *matCellDef="let row">
				<!-- tipos padrão -->
				<ng-container [ngSwitch]="column.options?.type">
					<ng-container *ngSwitchCase="'date'">
						{{ row | nestedValue : column.key | date : 'dd/MM/yy' }}
					</ng-container>
					<ng-container *ngSwitchCase="'currency'">
						{{ row | nestedValue : column.key | currency : 'BRL' }}
					</ng-container>
					<ng-container *ngSwitchCase="'status'">
						<app-status [status]="row | nestedValue : column.key"></app-status>
					</ng-container>
					<ng-container *ngSwitchCase="'icon-button'">
						@for (bt of column.buttons; track $index) {
						<button mat-icon-button [color]="bt.color ?? 'primary'" (click)="bt.click(row)">
							<mat-icon>{{ bt.icon }}</mat-icon>
						</button>
						}
					</ng-container>
					<ng-container *ngSwitchDefault>
						{{ row | nestedValue : column.key }}
					</ng-container>
				</ng-container>
			</td>
		</ng-container>
		}
	`,
	encapsulation: ViewEncapsulation.None,
})
export class TableComponent {
	@Input() columnsToDisplay: ColumnDisplay[];
	@Input() displayedColumns: string[];

	constructor(private translate: TranslateService) {}
}
