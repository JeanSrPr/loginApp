import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://127.0.0.1:8000/usuarios/api/'; // Asegúrate que termina con /

  constructor(private http: HttpClient) {}

  // Login
  login(credentials: { email: string; password: string }): Observable<any> {
    const url = `${this.baseUrl}login/`;
    console.log('Login request to:', url);
    console.log('Payload:', credentials);

    return this.http.post<any>(url, credentials).pipe(
      tap((response) => console.log('Login response:', response)),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  // Registro
  registro(datosRegistro: {
    email: string;
    password: string;
    tipo_usuario: string;
  }): Observable<any> {
    const url = `${this.baseUrl}registro/`;
    console.log('Registro request to:', url);
    return this.http.post<any>(url, datosRegistro).pipe(
      tap((response) => console.log('Registro response:', response)),
      catchError((error) => {
        console.error('Registro error:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener tipo de usuario desde el API
  getTipoUsuarioFromAPI(email: string): Observable<any> {
    const url = `${this.baseUrl}tipo_usuario/${email}`;
    console.log('Get tipo usuario request to:', url);
    return this.http.get<any>(url).pipe(
      tap((response) => console.log('Tipo usuario response:', response)),
      catchError((error) => {
        console.error('Get tipo usuario error:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener el email del usuario almacenado en localStorage
  getUserEmail(): string | null {
    return localStorage.getItem('userEmail');
  }

  // Logout
  logout(): Observable<any> {
    const url = `${this.baseUrl}logout/`;
    console.log('Logout request to:', url);
    return this.http.post(url, {}).pipe(
      tap(() => {
        localStorage.removeItem('userEmail'); // Limpia el correo almacenado
        localStorage.removeItem('tipoUsuario'); // Limpia el tipo de usuario almacenado
        console.log('Usuario desconectado correctamente.');
      }),
      catchError((error) => {
        console.error('Logout error:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener el nombre del usuario (antes del @)
  getNombreUsuario(): string | null {
    const email = this.getUserEmail();
    return email ? email.split('@')[0] : null; // Devuelve el nombre antes del @
  }

  // Asistencias
  registrarAsistencia(email: string): Observable<any> {
    const url = `${this.baseUrl}registrar_asistencia/`;
    console.log('Registrar asistencia request to:', url);
    return this.http.post<any>(url, { email }).pipe(
      tap((response) => console.log('Registrar asistencia response:', response)),
      catchError((error) => {
        console.error('Registrar asistencia error:', error);
        return throwError(() => error);
      })
    );
  }

  listarAsistencias(): Observable<any> {
    const url = `${this.baseUrl}listar_asistencias/`;
    console.log('Listar asistencias request to:', url);
    return this.http.get<any>(url).pipe(
      tap((response) => console.log('Listar asistencias response:', response)),
      catchError((error) => {
        console.error('Listar asistencias error:', error);
        return throwError(() => error);
      })
    );
  }

  limpiarAsistencias(): Observable<any> {
    const url = `${this.baseUrl}limpiar_asistencias/`;
    console.log('Limpiar asistencias request to:', url);
    return this.http.delete<any>(url).pipe(
      tap(() => console.log('Asistencias limpiadas correctamente.')),
      catchError((error) => {
        console.error('Limpiar asistencias error:', error);
        return throwError(() => error);
      })
    );
  }

  // Restablecer contraseña
  generarCodigoRestablecimiento(email: string): Observable<any> {
    const url = `${this.baseUrl}solicitar-codigo/`;
    console.log('Generar código de restablecimiento request to:', url);
    return this.http.post<any>(url, { email }).pipe(
      tap((response) => console.log('Código generado:', response)),
      catchError((error) => {
        console.error('Generar código error:', error);
        return throwError(() => error);
      })
    );
  }

  actualizarPassword(codigo: string, nuevaPassword: string): Observable<any> {
    const url = `${this.baseUrl}actualizar-password/`;
    console.log('Actualizar contraseña request to:', url);
    return this.http.post<any>(url, { codigo, nueva_password: nuevaPassword }).pipe(
      tap((response) => console.log('Contraseña actualizada:', response)),
      catchError((error) => {
        console.error('Actualizar contraseña error:', error);
        return throwError(() => error);
      })
    );
  }
}
