export type TipoSolicitud = 'Constancia de estudios' | 'Cambio de horario' | 'Revisión de nota';
export type EstadoSolicitud = 'Pendiente' | 'En revisión' | 'Atendida';

export interface NuevaSolicitud {
  estudiante: string;
  codigo: string;
  correo: string;
  tipo: TipoSolicitud;
  motivo: string;
}

export interface Solicitud extends NuevaSolicitud {
  id: number;
  fecha: string;
  estado: EstadoSolicitud;
}

export const TIPOS_SOLICITUD: TipoSolicitud[] = [
  'Constancia de estudios', 'Cambio de horario', 'Revisión de nota'
];
