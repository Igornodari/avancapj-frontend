import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
@Injectable({
	providedIn: 'root',
})
export class AuthGuard {
	constructor(public authService: AuthService, public router: Router) {}
	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | UrlTree | boolean {
		this.authService.$isLogggedIn.subscribe((res) => res ?? this.router.navigate(['authentication/login']));

		return true;
	}
}
