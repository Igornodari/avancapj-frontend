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
		// Verificar se está logado
		const isLoggedIn = this.authService.isLoggedIn();
		
		if (!isLoggedIn) {
			// Se não estiver logado, redireciona para login
			return this.router.createUrlTree(['/authentication/login']);
		}
		
		// Se estiver logado, permite acesso
		return true;
	}
}
