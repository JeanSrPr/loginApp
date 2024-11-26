import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nueva-password',
  templateUrl: './nueva-password.page.html',
  styleUrls: ['./nueva-password.page.scss'],
})
export class NuevaPasswordPage {
  codigo: string = '';
  nuevaPassword: string = '';

  constructor(private authService: AuthService) {}

  actualizarPassword() {
    if (this.codigo && this.nuevaPassword) {
      this.authService.actualizarPassword(this.codigo, this.nuevaPassword).subscribe(
        (response: any) => {
          alert('Contraseña actualizada correctamente.');
          console.log('Respuesta:', response);
        },
        (error) => {
          console.error('Error al actualizar la contraseña:', error);
          alert('Error al actualizar la contraseña. Verifique el código.');
        }
      );
    } else {
      alert('Por favor, complete todos los campos.');
    }
  }
}
