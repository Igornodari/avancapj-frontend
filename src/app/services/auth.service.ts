import { Injectable, inject } from '@angular/core';
import { RequestService } from './request.service';
import { URI_PATH } from '../shared/constant/path.contant';
import { LocalStorageService } from './local-storage.service';
import { LOCAL_STORAGE } from '../shared/constant/local-storage.constant';
import { Router } from '@angular/router';
import { BehaviorSubject, distinctUntilChanged, filter } from 'rxjs';
import { SnackBarService } from './snack-bar.service';
import { Unit, User } from '../shared/types';
import {
	Auth,
	GoogleAuthProvider,
	signInWithCustomToken,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
	createUserWithEmailAndPassword,
	updateProfile,
} from '@angular/fire/auth';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	auth: Auth = inject(Auth);
	private googleProvider = new GoogleAuthProvider();
	public currentUser: User;
	public pendingCred: any;
	private user: BehaviorSubject<User> = new BehaviorSubject<User>(null as any);
	private unit: BehaviorSubject<Unit> = new BehaviorSubject<Unit>(null as any);

	private isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);

	constructor(
		private _requestService: RequestService,
		private localStorageService: LocalStorageService,
		private router: Router,
		private _snackBar: SnackBarService
	) {
		if (!this.currentUser) {
			this.getUser();
		}
		this.$user.subscribe(user => (this.currentUser = user));
	}

	get token() {
		return this.localStorageService.getItem(LOCAL_STORAGE.TOKEM);
	}

	get $isLogggedIn() {
		return this.isAuthenticated;
	}

	/**
	 * Verifica se o usuário está logado
	 * Checa se existe token e usuário no localStorage
	 */
	isLoggedIn(): boolean {
		const token = this.localStorageService.getItem(LOCAL_STORAGE.TOKEM);
		const user = this.localStorageService.getItem(LOCAL_STORAGE.USER);
		return !!(token && user);
	}

	get $unit() {
		return this.unit.pipe(
			distinctUntilChanged(),
			filter(unit => !!unit)
		);
	}

	get $user() {
		return this.user.pipe(
			distinctUntilChanged(),
			filter(unit => !!unit)
		);
	}

	async authenticationWithToken() {
		const idToken = await this.auth.currentUser?.getIdToken();
		if (!idToken) {
			this._snackBar.error('Acesso negado');
			return;
		}
		return this._requestService.post(URI_PATH.CORE.AUTH.MAIN, { token: idToken }).subscribe({
			next: res => {
				this.setAuth(res);
				this.setUnit(res.user.unit);
				this.checkAndRedirect();
			},
			error: e => {
				this.logoutFirebase();
				this._snackBar.error('Acesso negado');
			},
		});
	}

	async loginDev(email: string, password: string) {
		return this._requestService.post(URI_PATH.CORE.AUTH.DEV, { email, password }).subscribe({
			next: async res => {
				await this.signInWithCustomToken(res.firebaseToken);
				this.setAuth(res);
				this.setUnit(res.user.unit);
				this.checkAndRedirect();
			},
			error: e => {
				this.logoutFirebase();
				this._snackBar.error('Acesso negado');
			},
		});
	}

	async loginWithEmail(email: string, password: string) {
		try {
			const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
			await this.authenticationWithToken();
			return userCredential;
		} catch (error: any) {
			if (error.code === 'auth/user-not-found') {
				this._snackBar.error('Não autorizado: Usuário não cadastrado!');
			} else if (error.code === 'auth/wrong-password') {
				this._snackBar.error('Não autorizado: Credenciais inválidas!');
			} else if (error.code === 'auth/invalid-credential') {
				this._snackBar.error('Credenciais inválidas!');
			} else {
				this._snackBar.error('Erro ao fazer login: ' + error.message);
			}
			throw error;
		}
	}
	loginProviderGoogle() {
		return signInWithPopup(this.auth, this.googleProvider).then(async result => {
			const credential = GoogleAuthProvider.credentialFromResult(result);
			await this.authenticationWithToken();
			return credential;
		});
	}

	/**
	 * Registra novo usuário com email e senha
	 */
	async registerWithEmail(
		email: string,
		password: string,
		firstName: string,
		lastName: string
	) {
		try {
			// Criar usuário no Firebase Auth
			const userCredential = await createUserWithEmailAndPassword(
				this.auth,
				email,
				password
			);

			// Atualizar perfil com nome
			if (userCredential.user) {
				await updateProfile(userCredential.user, {
					displayName: `${firstName} ${lastName}`,
				});
			}

			// Fazer logout após criar conta (usuário deve fazer login)
			await this.logoutFirebase();

			return userCredential;
		} catch (error: any) {
			if (error.code === 'auth/email-already-in-use') {
				this._snackBar.error('Este email já está cadastrado!');
			} else if (error.code === 'auth/weak-password') {
				this._snackBar.error('Senha muito fraca! Use pelo menos 6 caracteres.');
			} else if (error.code === 'auth/invalid-email') {
				this._snackBar.error('Email inválido!');
			} else {
				this._snackBar.error('Erro ao criar conta: ' + error.message);
			}
			throw error;
		}
	}

	forgotPassword(email: string) {
		return this._requestService.get(`${URI_PATH.CORE.AUTH.FORGOT_PASSWORD}/${email}`);
	}

	private setAuth(res: any) {
		res.user.photoUrl = res.user.photoUrl ?? '/assets/images/profile/user-1.jpg';
		this.localStorageService.setItem(LOCAL_STORAGE.USER, JSON.stringify(res.user));
		this.localStorageService.setItem(LOCAL_STORAGE.TOKEM, res.accessToken);
		this.user.next(res.user);

		this.isAuthenticated.next(true);
	}

	setUnit(unit: Unit) {
		this.localStorageService.setItem(LOCAL_STORAGE.UNIT, JSON.stringify(unit));
		this.unit.next(unit);
	}

	getUser() {
		const user = this.localStorageService.getItem(LOCAL_STORAGE.USER);
		if (user) {
			this.currentUser = JSON.parse(user);
		}

		return this.currentUser;
	}

	refresh() {
		return this._requestService
			.post(URI_PATH.CORE.AUTH.REFRESH, { refreshToken: this.token })
			.subscribe({
				next: res => {
					this.setAuth(res);
					this.signInWithCustomToken(res.firebaseToken);
					let unit = res.user.unit;
					if (unit?.name == 'Matriz') {
						const unitStorage = this.localStorageService.getItem(LOCAL_STORAGE.UNIT);
						if (unitStorage) {
							unit = JSON.parse(unitStorage);
						}
					}
					this.setUnit(unit);
				},
			});
	}

	logout() {
		this.localStorageService.removeItem(LOCAL_STORAGE.USER);
		this.localStorageService.removeItem(LOCAL_STORAGE.TOKEM);
		this.localStorageService.removeItem(LOCAL_STORAGE.UNIT);
		this.isAuthenticated.next(false);
		this.user.next(null as any);
		this.logoutFirebase();
		this.router.navigate(['/authentication/login']);
	}

	logoutFirebase() {
		signOut(this.auth)
			.then()
			.catch(error => {
				console.log('sign out error: ' + error);
			});
	}

	signInWithCustomToken(token: string) {
		signInWithCustomToken(this.auth, token)
			.then(userCredential => {
				const user = userCredential.user;
			})
			.catch(error => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(error);
				// ...
			});
	}

	private checkAndRedirect() {
		// Verificar se o usuário completou o questionário
		this._requestService.get('core/questionnaire/status').subscribe({
			next: (status: any) => {
				if (!status.completed) {
					this.router.navigate(['/authentication/questionnaire']);
				} else {
					this.router.navigate(['/']);
				}
			},
			error: () => {
				// Em caso de erro, redirecionar para home
				this.router.navigate(['/']);
			},
		});
	}

	prefillIframeEmail() {
		const iframe: any = document.getElementById('jsd-widget');
		const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

		if (iframeDocument) {
			iframeDocument.addEventListener('click', () => {
				if (this.currentUser.email) {
					iframe.contentWindow.postMessage({ email: 'usuario@exemplo.com' }, '*');
				}
				const emailField = iframeDocument.getElementById('email');
				if (emailField) {
				}
			});
		}
	}
}
