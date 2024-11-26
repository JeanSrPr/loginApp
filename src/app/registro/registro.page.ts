import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  email: string = '';
  password: string = '';
  tipo_usuario: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  // Método para navegar a Login después del registro
  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  registrarUsuario() {
    const usuarioData = {
      email: this.email,
      password: this.password,
      tipo_usuario: this.tipo_usuario,
    };
    this.authService.registro(usuarioData).subscribe(
      response => {
        console.log('Registro exitoso:', response);
        this.navigateToLogin(); // Navegar a Login después de un registro exitoso
      },
      error => {
        console.error('Error en el registro:', error);
        // Aquí puedes agregar lógica para mostrar un mensaje de error al usuario
      }
    );
  }
}
