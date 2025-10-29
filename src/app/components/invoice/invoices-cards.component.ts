import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import {
	MatCardContent,
	MatCard,
	MatCardHeader,
	MatCardTitle,
	MatCardModule,
} from '@angular/material/card';
import { StatusComponent } from '../status.component';
import { Invoice } from 'src/app/pages/bills-to-receive/invoices/invoices.type';
import { RecordReadingComponent } from '../record-reading.component';
import { Router } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';

@Component({
	selector: 'app-invoices-cards',
	imports: [CommonModule, MaterialModule, StatusComponent, RecordReadingComponent, TranslateModule],
	template: `
		@if (data.length) {
		<div>
			<div class="row m-t-10">
				@for (invoice of data; track invoice) {
				<div class="col-lg-3 m-0 p-0">
					<mat-card class="m-10">
						<mat-card-header>
							<mat-card-title class="p-10 ">
								{{ invoice.dueDate | date : 'dd/MM/yyyy' }}
							</mat-card-title>
							<app-status class="p-10 m-l-auto" [status]="invoice.statusStyle"></app-status>
						</mat-card-header>
						<mat-card-content>
							<app-record-reading title="TYPE">
								<app-status [status]="invoice.typeStyle"></app-status>
							</app-record-reading>

							<app-record-reading title="VALUE" class="m-l-auto">
								{{ invoice.amount | currency : 'BRL' }}
							</app-record-reading>
						</mat-card-content>
						<mat-card-actions class="d-flex justify-content-center">
							<button matButton="outlined" color="primary" (click)="navigateToInvoice(invoice.id)">
								{{ 'SEE_MORE' | translate }}
							</button>
						</mat-card-actions>
					</mat-card>
				</div>
				}
			</div>
		</div>
		} @else {
		<p class="text-center">
			{{ 'NO_RESULTS' | translate }}
		</p>
		}
	`,
	encapsulation: ViewEncapsulation.None,
})
export class PersonalCardComponent {
	@Input() data: Invoice[];
	@Input() class: string = '';
	constructor(private router: Router) {}

	navigateToInvoice(invoiceId: string) {
		this.router.navigate([`/bills-to-receive/invoices/show/${invoiceId}`]);
	}
}
