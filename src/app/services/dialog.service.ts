import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppDialogConfirmationComponent } from '../components/dialog-confirmation.component';
import { AppDialogActionComponent } from '../components/dialog-action.component';

@Injectable({
	providedIn: 'root',
})
export class DialogService {
	constructor(private _dialog: MatDialog) {}

	openDialogConfirmation(data?: { title?: string; subTitle?: string; data?: any }) {
		return this._dialog.open<AppDialogConfirmationComponent>(AppDialogConfirmationComponent, {
			data,
		});
	}

	openDialogAction(data: {
		title: string;
		subTitle: string;
		data?: any;
		type?: string;
		description?: string;
		descriptionRequerid?: boolean;
	}) {
		return this._dialog
			.open<AppDialogActionComponent>(AppDialogActionComponent, {
				data,
			})
			.afterClosed();
	}
}
