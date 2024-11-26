import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router'; // Importa el Router

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router 
  ) {}

  async iniciarSesion() {
    try {
        const response = await this.authService.login({
            email: this.email,
            password: this.password,
        }).toPromise();

        // Procesa y almacena el nombre de usuario (parte antes del @)
        const nombreUsuario = response.email.split('@')[0];
        localStorage.setItem('userEmail', response.email); // Guarda el correo completo
        localStorage.setItem('nombreUsuario', nombreUsuario); // Guarda solo el nombre antes del @
        localStorage.setItem('tipoUsuario', response.tipo_usuario);

        console.log('Correo almacenado:', response.email);
        console.log('Nombre de usuario almacenado:', nombreUsuario);
        console.log('Tipo de usuario almacenado:', response.tipo_usuario);

        // Muestra mensaje de éxito y redirige a Home
        await this.showAlert('Bienvenido', `Hola, ${nombreUsuario}`);
        this.router.navigate(['/home']);
    } catch (error: any) {
        if (error.status === 400) {
            await this.showAlert('Error', 'Credenciales inválidas. Por favor, intenta de nuevo.');
        } else {
            await this.showAlert('Error', 'Ocurrió un problema. Inténtalo más tarde.');
        }
    }
}
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
