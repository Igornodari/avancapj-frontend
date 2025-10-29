import { Component } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { importBase } from 'src/app/shared/constant/import-base.constant';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	imports: [
		NgOptimizedImage,
		importBase
	]
})

export class LoginComponent {
	loginImage = './assets/images/backgrounds/logo';
	loading = false;
	admin;
	public form: FormGroup<{ username: FormControl<string>; password: FormControl<string> }>;

	constructor(private authService: AuthService, private _formBuilder: FormBuilder,
		activatedRouter: ActivatedRoute,
		private _snackBar: SnackBarService,
		private translate: TranslateService
	) {
		this.form = this._formBuilder.nonNullable.group({
			username: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(8)]],
		});
		this.admin = activatedRouter.snapshot.paramMap.get('admin');
	}

	get f() {
		return this.form.controls;
	}

	loginGoogle() {
		this.loading = true;
		this.authService
			.loginProviderGoogle()
			.then(() => (this.loading = false))
			.catch((error) => {
				this.loading = false;
				if (error.code === 'auth/admin-restricted-operation') {
					this._snackBar.error(this.translate.instant('LOGIN.ERROR_NOT_REGISTERED'));
				} else {
					this._snackBar.error(this.translate.instant('LOGIN.ERROR_CONTACT_ADMIN'));
				}
			});
	}

	async finishLogin(linked = false) {
		await this.authService.authenticationWithToken();
		if (linked) {
			this._snackBar.success(this.translate.instant('LOGIN.SUCCESS_LINKED'));
		} else {
			this._snackBar.success(this.translate.instant('LOGIN.SUCCESS'));
		}
	}

	async submit() {
		if (this.form.invalid) return;
		this.loading = true;
		if (this.admin) {
			(await this.authService.loginDev(this.f['username'].value, this.f['password'].value))
				.add(() => (this.loading = false));
		} else {
			this.authService.loginWithEmail(this.f['username'].value, this.f['password'].value)
				.finally(() => (this.loading = false));
		}
	}
}
