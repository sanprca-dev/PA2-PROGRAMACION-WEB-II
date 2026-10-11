import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UsuarioApi } from '../../models/usuario-api';
import { UsuariosApiService } from '../../services/usuarios-api.service';

@Component({ selector: 'app-usuarios', templateUrl: './usuarios.component.html' })
export class UsuariosComponent implements OnInit, OnDestroy {
  usuarios: UsuarioApi[] = [];
  cargando = false;
  error = '';
  consultaRealizada = false;
  private consulta?: Subscription;

  constructor(public usuariosApi: UsuariosApiService) {}

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.consulta?.unsubscribe();
    this.cargando = true;
    this.error = '';
    this.usuarios = [];
    this.consultaRealizada = false;
    this.consulta = this.usuariosApi.listar().subscribe({
      next: usuarios => {
        this.usuarios = usuarios;
        this.cargando = false;
        this.consultaRealizada = true;
      },
      error: () => {
        this.error = 'No se pudo consultar la API. Verifica tu conexión e inténtalo nuevamente.';
        this.cargando = false;
      }
    });
  }

  ngOnDestroy(): void { this.consulta?.unsubscribe(); }
}
