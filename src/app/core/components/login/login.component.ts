import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ChangeDetectorRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'gad-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  hide = true;
  isLoginForm = true;
  group: FormGroup;

  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private authService: AuthService,
    private cdRef: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {
    this.group = new FormGroup({
      user: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      confirmPassword: new FormControl(null), // Agrega este control sin validador
    });

    // Establece el validador solo para el formulario de registro
    if (!this.isLoginForm) {
      this.group.get('confirmPassword')?.setValidators([Validators.required]);
    }
  }

  login() {
    const user = this.group.get('user')?.value;
    const password = this.group.get('password')?.value;

    this.httpClient.post<any>('http://localhost:3000/api/auth/login', { user, password }).subscribe(
      (response) => {
        if (response.success) {
          console.log('Inicio de sesión exitoso');
          this.authService.isLoggedIn = true;
          this.router.navigate(['compra']);
        } else {
          console.error('Credenciales incorrectas');
        }
      },
      (error) => {
        console.error('Error en la solicitud al backend:', error);
      }
    );
  }

  logout() {
    this.authService.logout();
  }

  toggleForms() {
    this.isLoginForm = !this.isLoginForm;

    // Restablece los validadores al cambiar el formulario
    if (this.isLoginForm) {
      this.group.get('confirmPassword')?.clearValidators();
    } else {
      this.group.get('confirmPassword')?.setValidators([Validators.required]);
    }

    this.group.get('confirmPassword')?.updateValueAndValidity();

    this.cdRef.detectChanges();
  }

  toggleHidePassword() {
    this.hidePassword = !this.hidePassword;
  }

  toggleHideConfirmPassword() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  registro() {
    const user = this.group.get('user')?.value;
    const password = this.group.get('password')?.value;
    const confirmPassword = this.group.get('confirmPassword')?.value;

    if (this.isLoginForm) {
      // Aquí implementa la lógica de inicio de sesión
      console.log('Inicio de sesión', user, password);
    } else {
      // Aquí implementa la lógica de registro
      // Verifica si las contraseñas coinciden
      if (password !== confirmPassword) {
        this.snackBar.open('Las contraseñas no coinciden', 'Cerrar', { duration: 3000 });
        return;
      }

      console.log('Registro exitoso', user, password);
    }
  }
}
