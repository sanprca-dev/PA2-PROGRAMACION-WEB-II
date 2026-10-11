import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TIPOS_SOLICITUD, TipoSolicitud } from '../../models/solicitud';
import { SolicitudesService } from '../../services/solicitudes.service';
import { obtenerCodigoSolicitud } from '../../utils/solicitud.util';

// Contamos el texto real: los espacios solos no deben aprobar una validación.
const longitudReal = (minimo: number): ValidatorFn => (control: AbstractControl): ValidationErrors | null =>
  typeof control.value === 'string' && control.value.trim().length >= minimo ? null : { longitudReal: true };

@Component({ selector: 'app-nueva-solicitud', templateUrl: './nueva-solicitud.component.html' })
export class NuevaSolicitudComponent {
  tipos = TIPOS_SOLICITUD;
  enviado = false;
  mensaje = '';
  formulario = this.fb.nonNullable.group({
    estudiante: ['', [Validators.required, longitudReal(3), Validators.maxLength(80)]],
    codigo: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
    correo: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
    tipo: this.fb.nonNullable.control<TipoSolicitud | ''>('', Validators.required),
    motivo: ['', [Validators.required, longitudReal(20), Validators.maxLength(500)]]
  });

  constructor(private fb: FormBuilder, private solicitudesService: SolicitudesService, private router: Router) {}

  invalido(campo: keyof typeof this.formulario.controls): boolean {
    const control = this.formulario.controls[campo];
    return control.invalid && (control.touched || this.enviado);
  }

  guardar(): void {
    if (this.mensaje) return;
    this.enviado = true;
    this.formulario.markAllAsTouched();
    if (this.formulario.invalid) return;
    const { estudiante, codigo, correo, tipo, motivo } = this.formulario.getRawValue();
    if (tipo === '') return;
    const solicitud = this.solicitudesService.registrar({
      estudiante: estudiante.trim(), codigo, correo: correo.trim(), tipo, motivo: motivo.trim()
    });
    this.mensaje = `Solicitud ${obtenerCodigoSolicitud(solicitud.id)} registrada correctamente.`;
    this.formulario.disable();
  }

  async verSolicitudes(): Promise<void> {
    await this.router.navigate(['/solicitudes']);
  }
}
