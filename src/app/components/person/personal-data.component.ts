import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { Client } from 'src/app/pages/users/clients/clients.type';

@Component({
	selector: 'app-personal-data',
	imports: [
		MatIconModule,
		MatMenuModule,
		MatCheckboxModule,
		MatTooltipModule,
		CommonModule,
		TranslateModule,
		NgxMaskPipe,
	],
	providers: [provideNgxMask()],
	template: `
		<div class="row" [ngClass]="[class]">
			<div class="col-6">
				<div class="detail-item">
					<mat-icon>badge</mat-icon>
					<span class="label">{{ 'NAME' | translate }}:</span>
					<span class="value">{{ data.fullName }}</span>
				</div>
				<div class="detail-item">
					<mat-icon>email</mat-icon>
					<span class="label">{{ 'EMAIL' | translate }}:</span>
					<span class="value">{{ data.email }}</span>
				</div>
				<div class="detail-item">
					<mat-icon>phone</mat-icon>
					<span class="label">{{ 'PHONE' | translate }}:</span>
					<span class="value">
						{{ data.cellphone ? (data.cellphone | mask : '(00) 00000-0000') : 'N/A' }}
					</span>
				</div>
				<div class="detail-item">
					<mat-icon>calendar_today</mat-icon>
					<span class="label">{{ 'BIRTH_DATE' | translate }}:</span>
					<span class="value">{{ data.birthDate | date : 'dd/MM/yyyy' }}</span>
				</div>
				<div class="detail-item">
					<mat-icon>badge</mat-icon>
					<span class="label">{{ 'CPF' | translate }}:</span>
					<span class="value">{{ data.cpf ? (data.cpf | mask : '000.000.000-00') : '-' }}</span>
				</div>
				<div class="detail-item">
					<mat-icon>calendar_month</mat-icon>
					<span class="label">{{ 'CREATED_AT' | translate }}:</span>
					<span class="value">{{ data.createdAt | date : 'dd/MM/yyyy' }}</span>
				</div>
			</div>
			<div class="col-6">
				<div class="detail-item">
					<mat-icon>male</mat-icon>
					<span class="label">{{ 'GENDER' | translate }}:</span>
					<span class="value">{{ data.gender || '-' }}</span>
				</div>
				<div class="detail-item">
					<mat-icon>wc</mat-icon>
					<span class="label">{{ 'MARITAL_STATUS' | translate }}:</span>
					<span class="value">{{ data.maritalStatus || '-' }}</span>
				</div>
				<div class="detail-item">
					<mat-icon>public</mat-icon>
					<span class="label">{{ 'NATIONALITY' | translate }}:</span>
					<span class="value">{{ data.nationality || '-' }}</span>
				</div>
				<div class="detail-item">
					<mat-icon>verified_user</mat-icon>
					<span class="label">{{ 'DOCUMENT' | translate }}:</span>
					<span class="value">{{ data.document || '-' }}</span>
				</div>
				<div class="detail-item">
					<mat-icon>business</mat-icon>
					<span class="label">{{ 'CNPJ' | translate }}:</span>
					<span class="value">
						{{ data.cnpj ? (data.cnpj | mask : '00.000.000/0000-00') : '-' }}
					</span>
				</div>
				<div class="detail-item">
					<mat-icon>category</mat-icon>
					<span class="label">{{ 'TYPE' | translate }}:</span>
					<span class="value">{{ data.type || '-' | translate }}</span>
				</div>
			</div>
		</div>
	`,
	encapsulation: ViewEncapsulation.None,
})
export class PersonalDataComponent {
	@Input() data: Partial<Client>;
	@Input() class: string = '';
}
