import { Component } from '@angular/core';
import { Solicitud } from '../../models/solicitud';
import { SolicitudesService } from '../../services/solicitudes.service';
import { contarPendientes, obtenerCodigoSolicitud } from '../../utils/solicitud.util';

@Component({ selector: 'app-lista-solicitudes', templateUrl: './lista-solicitudes.component.html' })
export class ListaSolicitudesComponent {
  solicitudes: Solicitud[];
  obtenerCodigo = obtenerCodigoSolicitud;

  constructor(private solicitudesService: SolicitudesService) {
    this.solicitudes = this.solicitudesService.listar();
  }

  get pendientes(): number {
    return contarPendientes(this.solicitudes);
  }
}
