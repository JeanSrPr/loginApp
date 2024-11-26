import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // Importar HttpClient

@Component({
  selector: 'app-restablecer',
  templateUrl: './restablecer.page.html',
  styleUrls: ['./restablecer.page.scss'],
})
export class RestablecerPage {
  email: string = '';
  codigo: string = '';
  nuevaPassword: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient // Inyectar HttpClient
  ) {}

  solicitarCodigo() {
    if (this.email) {
      this.authService.generarCodigoRestablecimiento(this.email).subscribe(
        (response: any) => {
          alert('Código enviado correctamente.');
        },
        (error: any) => {
          alert('Error al solicitar el código. Verifique el email ingresado.');
        }
      );
    } else {
      alert('Por favor, ingrese su correo electrónico.');
    }
  }

  actualizarPassword() {
    if (this.codigo && this.nuevaPassword) {
      this.authService.actualizarPassword(this.codigo, this.nuevaPassword).subscribe(
        (response: any) => {
          alert('Contraseña actualizada correctamente.');
          this.router.navigate(['/login']); // Redirige al login
        },
        (error: any) => {
          alert('Error al actualizar la contraseña.');
        }
      );
    } else {
      alert('Por favor, ingrese el código y la nueva contraseña.');
    }
  }

  obtenerCodigo() {
    if (this.email) {
      this.http
        .post('http://127.0.0.1:8000/usuarios/api/obtener-codigo-expiracion/', { email: this.email })
        .subscribe(
          (response: any) => {
            if (response.message) {
              alert(response.message); // Muestra el mensaje en una alerta
            } else {
              alert('Error: ' + response.error); // Muestra el error si algo falla
            }
          },
          (error) => {
            alert('Error al obtener el código. Por favor, inténtalo nuevamente.');
          }
        );
    } else {
      alert('Por favor, ingrese su correo electrónico para obtener el código.');
    }
  }
}
