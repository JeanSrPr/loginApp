import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  nombreUsuario: string | null = null;
  tipoUsuario: string | null = null; // Declara la propiedad tipoUsuario
  perfilImg: string = '';
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const email = localStorage.getItem('userEmail');
    this.nombreUsuario = email ? email.split('@')[0] : null; // Extraer nombre antes del @
    this.tipoUsuario = localStorage.getItem('tipoUsuario');
    console.log('Nombre de usuario:', this.nombreUsuario);
    console.log('Tipo de usuario:', this.tipoUsuario);

    // Determinar imagen de perfil
    if (this.tipoUsuario === 'alumno') {
      this.perfilImg = 'assets/icon/alumno.png';
    } else if (this.tipoUsuario === 'profesor') {
      this.perfilImg = 'assets/icon/profesor.png';
    } else {
      this.perfilImg = 'assets/icon/default.png'; // Imagen por defecto
    }
  }
  logout() {
    // Limpiar los datos y redirigir al login
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

