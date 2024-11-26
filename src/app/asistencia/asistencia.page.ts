import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { QRService } from '../services/qr.service';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
})
export class AsistenciaPage implements OnInit {
  tipoUsuario: string = 'desconocido';
  isScanning: boolean = false;
  scannedData: string | null = null;
  qrCodeData: string | null = null;
  mostrarQR: boolean = false;
  asistencias: any[] = []; // Almacena la lista de asistencias con la hora convertida
  mostrarAsistencias: boolean = false; // Controla si se muestran las asistencias

  constructor(private authService: AuthService, private qrService: QRService) {}

  ngOnInit() {
    this.obtenerTipoUsuario();
    this.listarAsistencias();
  }

  obtenerTipoUsuario() {
    const email = localStorage.getItem('userEmail'); // Ejemplo: "jean123@gmail.com"
    if (email) {
      this.authService.getTipoUsuarioFromAPI(email).subscribe(
        (response: any) => {
          this.tipoUsuario = response.tipo_usuario || 'desconocido';
          console.log('Tipo de usuario recuperado:', this.tipoUsuario);
        },
        (error: any) => {
          console.error('Error al obtener el tipo de usuario:', error);
          this.tipoUsuario = 'desconocido';
        }
      );
    } else {
      console.warn('No se encontró email en localStorage.');
    }
  }

  listarAsistencias() {
    this.authService.listarAsistencias().subscribe(
      (response: any) => {
        // Procesar y convertir la fecha/hora a la zona horaria local
        this.asistencias = response.asistencias.map((asistencia: any) => {
          const utcDate = asistencia.fecha_hora;
          const localDate = new Date(utcDate).toLocaleString(); // Convertir a hora local
          return {
            usuario: asistencia.usuario,
            fecha_hora: localDate, // Guarda la hora local en lugar de UTC
          };
        });
        console.log('Asistencias procesadas:', this.asistencias);
      },
      (error) => {
        console.error('Error al listar asistencias:', error);
      }
    );
  }

  // Alternar la visibilidad de las asistencias
  toggleAsistencias() {
    this.mostrarAsistencias = !this.mostrarAsistencias;
  }

  // Refrescar la lista de asistencias
  refrescarAsistencias() {
    console.log('Refrescando asistencias...');
    this.listarAsistencias();
  }

  // Limpiar todas las asistencias registradas
  limpiarAsistencias() {
    this.authService.limpiarAsistencias().subscribe(
      (response: any) => {
        console.log('Asistencias eliminadas:', response);
        this.asistencias = []; // Limpiar la lista en el frontend
        alert('Todas las asistencias han sido eliminadas.');
      },
      (error) => {
        console.error('Error al limpiar asistencias:', error);
        alert('No se pudieron eliminar las asistencias.');
      }
    );
  }

  async toggleScan() {
    if (this.isScanning) {
      this.qrService.stopScan();
      this.isScanning = false;
    } else {
      const result = await this.qrService.startScan();
      if (result.hasContent) {
        this.scannedData = result.content;
        this.qrService.stopScan();
        this.isScanning = false;

        // Registrar la asistencia
        try {
          const email = localStorage.getItem('userEmail');
          if (email) {
            const response = await this.authService.registrarAsistencia(email).toPromise();
            console.log('Asistencia registrada:', response);
          } else {
            console.warn('Email no encontrado en localStorage.');
          }
        } catch (error) {
          console.error('Error al registrar la asistencia:', error);
        }
      }
    }
  }

  async toggleQR() {
    if (this.mostrarQR) {
      this.mostrarQR = false;
      console.log('QR ocultado.');
    } else {
      const email = this.authService.getUserEmail();
      const tipoUsuario = localStorage.getItem('tipoUsuario');

      this.qrCodeData = await this.qrService.generarCodigoQR(
        JSON.stringify({
          email: email,
          tipo_usuario: tipoUsuario,
          timestamp: new Date().toISOString(),
        })
      );

      this.mostrarQR = true;
      console.log('QR generado y mostrado:', this.qrCodeData);
    }
  }
}
