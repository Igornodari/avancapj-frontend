import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardContent, MatCard, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { NgxMaskPipe, provideNgxMask } from 'ngx-mask';

import {
	MatExpansionPanel,
	MatExpansionPanelHeader,
	MatExpansionModule,
} from '@angular/material/expansion';
import { Client } from 'src/app/pages/users/clients/clients.type';
import { PersonalDataComponent } from './personal-data.component';

@Component({
	selector: 'app-personal-expansion',
	imports: [
		MatIconModule,
		MatMenuModule,
		MatCheckboxModule,
		MatTooltipModule,
		CommonModule,
		TranslateModule,
		MatExpansionPanel,
		MatExpansionPanelHeader,
		MatExpansionModule,
		PersonalDataComponent,
	],
	providers: [provideNgxMask()],
	template: `
		<mat-expansion-panel [ngClass]="[class]">
			<mat-expansion-panel-header>
				<mat-panel-title class="f-w-600">
					{{ 'FINANCE.BILLS_TO_RECEIVE.INVOICES.TABLE.CLIENT' | translate }}
				</mat-panel-title>
				<mat-panel-description class="mat-body-1">
					{{ data.firstName }} {{ data.lastName }}
					<mat-icon class="m-l-auto m-r-8">account_circle</mat-icon>
				</mat-panel-description>
			</mat-expansion-panel-header>
			<app-personal-data class="p-0" [data]="data"></app-personal-data>
		</mat-expansion-panel>
	`,
	encapsulation: ViewEncapsulation.None,
})
export class PersonalExpansionComponent {
	@Input() data: Partial<Client>;
	@Input() class: string = '';
}
