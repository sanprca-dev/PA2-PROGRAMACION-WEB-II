import { Solicitud } from '../models/solicitud';

export const obtenerCodigoSolicitud = (id: number): string => `SOL-${String(id).padStart(3, '0')}`;

export function contarPendientes(solicitudes: Solicitud[]): number {
  let total = 0;
  for (const { estado } of solicitudes) {
    if (estado === 'Pendiente') total++;
  }
  return total;
}
