import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';


@Injectable({
  providedIn: 'root',
})
export class QRService {
  constructor() {}

  async startScan() {
    await BarcodeScanner.checkPermission({ force: true });
    await BarcodeScanner.hideBackground();
    return await BarcodeScanner.startScan();
  }

  stopScan() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
  }

   // Método para generar el contenido del QR
   generarCodigoQR(data: string): string {
    // Aquí puedes personalizar cómo generas el QR
    return `https://example.com/?data=${encodeURIComponent(data)}`;
  }
}
