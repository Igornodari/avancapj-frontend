import { Injectable, inject } from '@angular/core';
import {
	MatSnackBar,
	MatSnackBarHorizontalPosition,
	MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { AnalyticsService } from './analytics.service'; // Importe o serviço de Analytics

@Injectable({
	providedIn: 'root',
})
export class SnackBarService {
	horizontalPosition: MatSnackBarHorizontalPosition = 'end';
	verticalPosition: MatSnackBarVerticalPosition = 'top';
	private _translate = inject(TranslateService);
	private _snackBar = inject(MatSnackBar);
	private analyticsService = inject(AnalyticsService);
	duration = 5000;

	constructor() {}

	default(
		text: string,
		options?: {
			horizontalPosition?: MatSnackBarHorizontalPosition;
			verticalPosition?: MatSnackBarVerticalPosition;
		},
	) {
		this.analyticsService.logEvent('msg_default', { message: text, type: 'default' });
		return this._snackBar.open(this._translate.instant(text), 'Fechar', {
			duration: this.duration,
			horizontalPosition: options?.horizontalPosition ?? this.horizontalPosition,
			verticalPosition: options?.verticalPosition ?? this.verticalPosition,
		});
	}

	success(text: string) {
		this.analyticsService.logEvent('msg_success', { message: text, type: 'success' });
		return this._snackBar.open(this._translate.instant(text), 'Fechar', {
			panelClass: 'success-snackbar',
			duration: this.duration,
			horizontalPosition: this.horizontalPosition,
			verticalPosition: this.verticalPosition,
		});
	}

	error(text: string) {
		this.analyticsService.logEvent('msg_error', { message: text, type: 'error' });
		return this._snackBar.open(this._translate.instant(text), 'Fechar', {
			panelClass: 'error-snackbar',
			duration: this.duration,
			horizontalPosition: this.horizontalPosition,
			verticalPosition: this.verticalPosition,
		});
	}

	warning(text: string) {
		this.analyticsService.logEvent('msg_warning', { message: text, type: 'warning' });
		return this._snackBar.open(this._translate.instant(text), 'Fechar', {
			panelClass: 'warning-snackbar',
			duration: this.duration,
			horizontalPosition: this.horizontalPosition,
			verticalPosition: this.verticalPosition,
		});
	}

	dismiss() {
		this._snackBar.dismiss();
	}
}
