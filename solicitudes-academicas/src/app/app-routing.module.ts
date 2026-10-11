import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaSolicitudesComponent } from './components/lista-solicitudes/lista-solicitudes.component';
import { NuevaSolicitudComponent } from './components/nueva-solicitud/nueva-solicitud.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';

const routes: Routes = [
  { path: '', redirectTo: 'solicitudes', pathMatch: 'full' },
  { path: 'solicitudes', component: ListaSolicitudesComponent },
  { path: 'nueva-solicitud', component: NuevaSolicitudComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: '**', redirectTo: 'solicitudes' }
];

@NgModule({ imports: [RouterModule.forRoot(routes)], exports: [RouterModule] })
export class AppRoutingModule {}
