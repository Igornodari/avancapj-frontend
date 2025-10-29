import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
	constructor(protected readonly _router: Router, private authService: AuthService) {}

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		const newHeaders = new HttpHeaders({
			Authorization: `Bearer ${this.authService.token}`,
			Accept: '*/*',
			'Platform-Version': environment.version,
			'Platform-Origin': 'dashboard',
		});
		const secureReq = request.clone({
			headers: newHeaders,
		});
		return next.handle(secureReq);
	}
}
