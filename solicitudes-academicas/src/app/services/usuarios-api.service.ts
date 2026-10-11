import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';
import { UsuarioApi } from '../models/usuario-api';

@Injectable({ providedIn: 'root' })
export class UsuariosApiService {
  // API de práctica propuesta; confirmar su aceptación con el docente.
  readonly url = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) {}

  listar(): Observable<UsuarioApi[]> {
    return this.http.get<UsuarioApi[]>(this.url).pipe(timeout(15000));
  }
}
