import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  private auth = inject(Auth);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return from(this.auth.currentUser?.getIdToken() ?? Promise.resolve(null)).pipe(
      switchMap((idToken) => {
        const headersObj: Record<string, string> = {
          Accept: '*/*',
          'Platform-Version': environment.version,
          'Platform-Origin': 'dashboard',
        };

        if (idToken) {
          headersObj['Authorization'] = `Bearer ${idToken}`;
        }

        const secureReq = request.clone({
          headers: new HttpHeaders(headersObj),
        });

        return next.handle(secureReq);
      })
    );
  }
}
