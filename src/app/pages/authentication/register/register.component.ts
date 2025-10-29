import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule,
    TranslateModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: SnackBarService
  ) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  get f() {
    return this.form.controls;
  }

  get passwordsMatch(): boolean {
    return !this.form.hasError('mismatch');
  }

  async submit() {
    if (this.form.invalid) {
      this.snackBar.error('Por favor, preencha todos os campos corretamente');
      return;
    }

    this.loading = true;

    try {
      const { firstName, lastName, email, password } = this.form.value;
      
      await this.authService.registerWithEmail(
        email,
        password,
        firstName,
        lastName
      );

      this.snackBar.success('Cadastro realizado com sucesso! Faça login para continuar.');
      this.router.navigate(['/authentication/login']);
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        this.snackBar.error('Este email já está cadastrado!');
      } else if (error.code === 'auth/weak-password') {
        this.snackBar.error('Senha muito fraca! Use pelo menos 6 caracteres.');
      } else {
        this.snackBar.error('Erro ao criar conta: ' + error.message);
      }
    } finally {
      this.loading = false;
    }
  }

  goToLogin() {
    this.router.navigate(['/authentication/login']);
  }
}
