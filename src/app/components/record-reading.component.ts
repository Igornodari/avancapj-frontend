import { Component, Input, ViewEncapsulation } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../material.module';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-record-reading',
	imports: [TranslateModule, MaterialModule, CommonModule],
	template: `
		<div class="detail-item">
			@if(icon){
			<mat-icon>{{ icon }}</mat-icon>
			}

			<span class="label">{{ label || title | translate }}:</span>
			<ng-content class="value"></ng-content>
		</div>
	`,
	encapsulation: ViewEncapsulation.None,
})
export class RecordReadingComponent {
	@Input() title: string;
	@Input() label?: string;
	@Input() icon: string;
}
