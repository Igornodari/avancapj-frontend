import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardContent, MatCard, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { Client } from 'src/app/pages/users/clients/clients.type';
import { PersonalDataComponent } from './personal-data.component';

@Component({
	selector: 'app-personal-card',
	imports: [
		MatIconModule,
		MatMenuModule,
		MatCheckboxModule,
		MatTooltipModule,
		CommonModule,
		TranslateModule,
		MatCardContent,
		MatCard,
		MatCardHeader,
		MatCardTitle,
		PersonalDataComponent,
	],
	template: `
		<mat-card [ngClass]="['detail-card', class]">
			<mat-card-header>
				<mat-card-title class="detail-items">
					<mat-icon>person</mat-icon>
					<span class="label">{{ 'PERSONAL_DATA' | translate }}</span>
				</mat-card-title>
			</mat-card-header>
			@if (data) {
			<mat-card-content>
				<app-personal-data class="bg-light-secondary p-0" [data]="data"></app-personal-data>
			</mat-card-content>
			}
		</mat-card>
	`,
	encapsulation: ViewEncapsulation.None,
})
export class PersonalCardComponent {
	@Input() data: Partial<Client>;
	@Input() class: string = '';
}
