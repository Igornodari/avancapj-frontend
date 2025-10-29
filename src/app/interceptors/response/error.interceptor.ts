import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	constructor(private _router: Router, private _snackBar: SnackBarService) {}

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		return next.handle(request).pipe(
			catchError((reqError: HttpErrorResponse) => {
				this.unauthorized(reqError);
				this.server(reqError);
				return throwError(() => new Error(reqError.message));
			}),
		);
	}

	noConnection(reqError: HttpErrorResponse) {
		if (reqError.status === 0) {
			this._snackBar.error('Problemas com sua conexão');
		}
	}
	unauthorized(reqError: HttpErrorResponse) {
		if (reqError.error.statusCode === 401) {
			this._snackBar.error('sessão expirada !');
			this._router.navigate(['authentication/login']).then((r) => r);
		}
	}

	server(reqError: HttpErrorResponse) {
		if (reqError.error.statusCode === 500) {
			this._snackBar.error('Error no servidor !');
		} else if ([400, 409, 408, 412, 422, 404].includes(reqError.error.statusCode)) {
			this._snackBar.error(reqError.error.message);
		}
	}
}
