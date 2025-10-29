import { Component, ElementRef, Inject, OnInit, ViewChild, DOCUMENT } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	ValidationErrors,
	ValidatorFn,
	Validators,
} from '@angular/forms';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import BaseComponent from 'src/app/components/base.component';
import { URI_PATH } from 'src/app/shared/constant/path.contant';
import { MARITAL_STATUSES } from 'src/app/shared/constant/users.contant';
import { CoreService } from 'src/app/services/core.service';
import { Admin } from 'src/app/shared/types';
import { takeUntil } from 'rxjs';
import { importBase } from 'src/app/shared/constant/import-base.constant';


@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    imports: [...importBase]
})
export class AccountComponent extends BaseComponent implements OnInit {
	@ViewChild('fileUpload') inputFile: ElementRef;
	public MARITAL_STATUSES = MARITAL_STATUSES;
	public admin: Admin;
	public formGroup: FormGroup;
	public formGroupPassword: FormGroup;
	public picture: any;
	options = this._settings.getOptions();
	constructor(
		private _formBuilder: FormBuilder,
		private _snackBar: SnackBarService,
		private _settings: CoreService,
		@Inject(DOCUMENT) private document: Document
	) {
		super();

		this.formGroup = this._formBuilder.nonNullable.group({
			firstName: [''],
			lastName: [''],
			email: [''],
			cellphone: [''],
			maritalStatus: [''],
		});
		this.formGroupPassword = this._formBuilder.nonNullable.group({
			password: ['', Validators.required],
			rePassword: ['', [Validators.required, this.checkPassword()]],
			passwordOld: [''],
		});
		this.authService.$user.pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
			this.user = user;
			this.picture = this.user.photoUrl;
			this.formGroup.patchValue(this.user);
		});
	}
	ngOnInit(): void {
    if (this.options.theme === 'dark') {
        this.document.documentElement.classList.add('dark');
        this.document.documentElement.classList.remove('light');
    } else {
        this.document.documentElement.classList.add('light');
        this.document.documentElement.classList.remove('dark');
    }
}

	checkPassword(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			if (control.root.get('password')?.value == control.value) {
				return null;
			} else {
				return { invalid: true, message: 'As senhas não são iguais' };
			}
		};
	}

	updateProfile() {
		this.loading = true;
		this.requestService
			.update<Admin>(URI_PATH.CORE.ADMIN, this.user.profileId, this.formGroup.value)
			.subscribe({
				next: () => {
					this._snackBar.success('Dados atualizados');
					this.loading = false;
				},
			})
			.add(() => (this.loading = false));
	}

	updatePassword() {
		this.loading = true;
		this.requestService
			.post<Admin>(URI_PATH.CORE.PROFILE.UPDATE_PASSWORD, this.formGroupPassword.value)
			.subscribe({
				next: () => {
					this._snackBar.success('Senha atualizada');
					this.loading = false;
				},
			})
			.add(() => (this.loading = false));
	}

	selectPicture(event: any): void {
		this.loading = true;
		const file = event.target.files[0];
		if (!file || file.length === 0) {
			this._snackBar.error('Nenhum imagem selecionada!');
			return;
		}
		const mimeType = file.type;
		if (mimeType.match(/image\/*/) == null) {
			this._snackBar.error('imagem não suportada !');

			this.loading = false;
			return;
		}
		if (file.size > 2000000) {
			this.inputFile.nativeElement.value = null;
			this._snackBar.error('Não permitido arquivos com mais de 2mb !');
			this.loading = false;
			return;
		}

		this.picture = URL.createObjectURL(file);
		const reader = new FileReader();
		reader.readAsText(file);

		const formData = new FormData();
		formData.append('pictureFile', file as Blob);
		this.requestService
			.post(URI_PATH.CORE.PROFILE.UPDATE_PICTURE, formData)
			.subscribe({
				next: (res: Admin) => {
					this.user.photoUrl = res.photoUrl;
					this._snackBar.success('Foto atualizada !');
					this.loading = false;
				},
			})
			.add(() => (this.loading = false));
	}

	changeOptions() {
		// Atualiza as opções no serviço de configurações
		this._settings.setOptions(this.options);

		// Aplica a classe do tema no document.documentElement (elemento <html>)
		if (this.options.theme === 'dark') {
			this.document.documentElement.classList.add('dark');
			this.document.documentElement.classList.remove('light');
		} else {
			this.document.documentElement.classList.add('light');
			this.document.documentElement.classList.remove('dark');
		}
	}
}
