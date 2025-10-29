import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivityLog } from 'src/app/shared/types';
import BaseComponent from '../../base.component';
import { importBase } from 'src/app/shared/constant/import-base.constant';
import { NewLine } from 'src/app/shared/pipe/new-line.pipe';

@Component({
    selector: 'app-activity-modal',
    imports: [importBase, NewLine],
    templateUrl: './activity-modal.component.html',
    styleUrl: './activity-modal.component.scss'
})
export class ActivityModalComponent extends BaseComponent {
	constructor(
		public dialogRef: MatDialogRef<ActivityModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { activityLogs: ActivityLog[] }
	) {
		super();
	}
}
