import { Injectable } from '@angular/core';
import { NuevaSolicitud, Solicitud } from '../models/solicitud';

@Injectable({ providedIn: 'root' })
export class SolicitudesService {
  // La PA1 no pide backend: conservamos los registros en memoria durante la sesión.
  private solicitudes: Solicitud[] = [];
  private siguienteId = 1;

  listar(): Solicitud[] {
    return this.solicitudes.map(solicitud => ({ ...solicitud }));
  }

  registrar(datos: NuevaSolicitud): Solicitud {
    const solicitud: Solicitud = {
      ...datos,
      id: this.siguienteId++,
      fecha: new Date().toISOString(),
      estado: 'Pendiente'
    };
    this.solicitudes = [...this.solicitudes, solicitud];
    return { ...solicitud };
  }
}
