import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
@Injectable({
	providedIn: 'root',
})
export class AuthGuard {
	constructor(public authService: AuthService, public router: Router) {}
	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		const isLoggedIn = this.authService.isLoggedIn();
		if (!isLoggedIn) {
			return this.router.createUrlTree(['/authentication/login']);
		}
				return true;
	}
}
